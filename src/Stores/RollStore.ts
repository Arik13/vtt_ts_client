import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";

export class RollStore extends AssetStore<Asset.Roll.Data> {
    constructor() {
        super(
            "Roll Store",
            CLIENT_EVENT.ROLL_ADDED,
            CLIENT_EVENT.ROLL_UPDATED,
            CLIENT_EVENT.ROLL_DELETED,
        );
    }
}
const rollStore = new RollStore();

export {rollStore};
