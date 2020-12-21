import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

export class DynamicComponentStore extends AssetStore<Asset.DynamicComponent.Data> {
    constructor() {
        super("Script Store");
    }
}
const dcStore = new DynamicComponentStore();

export {dcStore};
