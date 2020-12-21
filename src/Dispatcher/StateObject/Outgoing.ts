import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { scriptStore } from '@/Stores/ScriptStore';

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
export const deleteStateObject = async (scriptID: string, directoryID: string) => {
    // // scriptStore.deleted(scriptID);
    // // await DB.deleteScript(scriptID);
    // const event: EVENT_TYPE.DELETE_SCRIPT = {
    //     scriptID,
    //     directoryID,
    // }
    // /* eslint-disable  @typescript-eslint/no-explicit-any */
    // serverProxy.emit(EVENT_NAME.DELETE_SCRIPT, event, (reply: any) => {});
}