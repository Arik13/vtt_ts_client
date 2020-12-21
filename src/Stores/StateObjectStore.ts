import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

export class StateObjectStore extends AssetStore<Asset.StateObject.Data> {
    constructor() {
        super("Script Store");
    }
}
const stateObjectStore = new StateObjectStore();

export {stateObjectStore};
