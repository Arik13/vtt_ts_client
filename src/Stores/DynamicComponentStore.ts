import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";

export const assembleCD = (cd: any) => {
    for (let key in cd) {
        if (
            cd[key] &&
            (typeof(cd[key]) == "object" ||
            Array.isArray(cd[key]))
        ) {
            let cdID = null;
            let cdKey = null;
            if (cd[key].cds && typeof(cd[key].cds) == "string") {
                cdID = cd[key].cds;
                cdKey = "cds";
            }
            else if (cd[key].choices && typeof(cd[key].choices) == "string") {
                cdID = cd[key].choices;
                cdKey = "choices";
            }
            if (cdID) {
                let storeCD = dcStore.get(cdID).cd;
                let subCD = JSON.parse(JSON.stringify(storeCD));
                assembleCD(subCD);
                cd[key][cdKey] = subCD;
            }
            else {
                assembleCD(cd[key]);
            }
        }
    }
}

export class DynamicComponentStore extends AssetStore<Asset.DynamicComponent.Data> {
    nameMap: Map<string, Asset.DynamicComponent.Data> = new Map();
    constructor() {
        super(
            "Dynamic Component Store",
            CLIENT_EVENT.DC_ADDED,
            CLIENT_EVENT.DC_UPDATED,
            CLIENT_EVENT.DC_DELETED,
        );
    }
    get(id: string) {
        let dc = super.get(id);
        return (dc)? dc : this.nameMap.get(id);
    }
    getAssembledDC(id: string): Asset.DynamicComponent.Data {
        let dc = JSON.parse(JSON.stringify(this.get(id)));
        assembleCD(dc);
        return dc;
    }
    setAll(dcs: Asset.DynamicComponent.Data[]) {
        super.setAll(dcs);
        this.forEach(dc => {
            this.nameMap.set(dc.name, dc);
        });
    }
    update(dc: Asset.DynamicComponent.Data) {
        console.log(dc);

        this.nameMap.set(dc.name, dc);
        super.update(dc);
    }
}
const dcStore = new DynamicComponentStore();

export {dcStore};
