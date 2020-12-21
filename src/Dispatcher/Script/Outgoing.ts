import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { scriptStore } from '@/Stores/ScriptStore';

export const createScript = (script: Asset.Script.Data, directoryID: string) => {
    const event: EVENT_TYPE.CREATE_SCRIPT = {
        script,
        directoryID,
    }
    serverProxy.emit(EVENT_NAME.CREATE_SCRIPT, event, (reply: any) => {});
}
export const updateScript = (script: Asset.Script.Data, directoryID: string) => {
    const event: EVENT_TYPE.UPDATE_SCRIPT = {
        script,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.UPDATE_SCRIPT, event, (reply: any) => {});
}
export const deleteScript = async (scriptID: string, directoryID: string) => {
    const event: EVENT_TYPE.DELETE_SCRIPT = {
        scriptID,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_SCRIPT, event, (reply: any) => {});
}