import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

export class RollStore extends AssetStore<Asset.Roll.Data> {
    constructor() {
        super("Roll Store");
    }
}
const rollStore = new RollStore();

export {rollStore};
