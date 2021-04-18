import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";

export class StateObjectStore extends AssetStore<any> {
    constructor() {
        super(
            "State Object Store",
            CLIENT_EVENT.STATE_OBJECT_ADDED,
            CLIENT_EVENT.STATE_OBJECT_UPDATED,
            CLIENT_EVENT.STATE_OBJECT_DELETED,
        );
    }
}
const stateObjectStore = new StateObjectStore();

export {stateObjectStore};
