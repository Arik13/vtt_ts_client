import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

const assembleCD = (cd: any) => {
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
    constructor() {
        super("Script Store");
    }
    getAssembledDC(id: string): Asset.DynamicComponent.Data {
        let dc = JSON.parse(JSON.stringify(this.get(id)));
        assembleCD(dc);
        return dc;
    }
}
const dcStore = new DynamicComponentStore();

export {dcStore};
