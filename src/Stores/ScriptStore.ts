import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

export class ScriptStore extends AssetStore<Asset.Script.Data> {
    constructor() {
        super("Script Store");
    }
}
const scriptStore = new ScriptStore();

export {scriptStore};
