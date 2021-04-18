import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";

export class ScriptStore extends AssetStore<Asset.Script.Data> {
    constructor() {
        super(
            "Script Store",
            CLIENT_EVENT.SCRIPT_ADDED,
            CLIENT_EVENT.SCRIPT_UPDATED,
            CLIENT_EVENT.SCRIPT_DELETED,
        );
    }
}
const scriptStore = new ScriptStore();

export {scriptStore};
