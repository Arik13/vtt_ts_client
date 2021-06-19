import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { scriptStore } from '@/Stores/ScriptStore';
import { stateObjectStore } from "@/Stores/StateObjectStore";

export const createStateObject = (stateObject: Asset.StateObject.Data, directoryID: string, callback: (reply: any) => void) => {
    const event: EVENT_TYPE.CREATE_STATE_OBJECT = {
        stateObject,
        directoryID,
    }
    serverProxy.emit(EVENT_NAME.CREATE_STATE_OBJECT, event, (reply: any) => {
        if (reply.success) {
            callback(reply);
        }
    });
}
// export const updateStateObject = (script: Asset.ScriptData, directoryID: string) => {
//     const event: EVENT_TYPE.UPDATE_SCRIPT = {
//         script,
//         directoryID,
//     }
//     /* eslint-disable  @typescript-eslint/no-explicit-any */
//     serverProxy.emit(EVENT_NAME.UPDATE_SCRIPT, event, (reply: any) => {});
// }
export const deleteStateObject = async (soID: string, directoryID: string, callback?: (reply: any) => void) => {
    stateObjectStore.deleted(soID);
    await DB.deleteStateObject(soID);
    const event: EVENT_TYPE.DELETE_STATE_OBJECT = {
        soID,
        directoryID,
    }
    // /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_STATE_OBJECT, event, callback);
}