import { serverProxy} from '@/Stores/ServerProxy';
import {DIRECTORY_EVENT_NAME, DIRECTORY_EVENT_TYPE, Directory} from "@shared/Directories/Directory";
import {directoryCreated} from "./Incoming";

export const createDirectory = async (name: string, parentID: string) => {
    const event: DIRECTORY_EVENT_TYPE.CREATE_DIRECTORY = {
        parentID: parentID,
        name: name,
    }
    // serverProxy.emit(DIRECTORY_EVENT_NAME.CREATE_DIRECTORY, event, (result: any) => {});
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return new Promise<Directory>((resolve, reject) => {
        serverProxy.emit(DIRECTORY_EVENT_NAME.CREATE_DIRECTORY, event, async (payload: any) => {
            payload.success? resolve(directoryCreated(payload.event)) : reject(null);
        });
    })
}

export const updateDirectory = async (directoryID: string, name: string) => {
    const event: DIRECTORY_EVENT_TYPE.UPDATE_DIRECTORY = {
        directoryID,
        name,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(DIRECTORY_EVENT_NAME.UPDATE_DIRECTORY, event, (result: any) => {});
}
export const deleteDirectory = async (directoryID: string) => {
    const event: DIRECTORY_EVENT_TYPE.DELETE_DIRECTORY = {
        directoryID
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(DIRECTORY_EVENT_NAME.DELETE_DIRECTORY, event, (result: any) => {});
}
export const moveDirectory = async (moveDir: Directory, targetDir: Directory) => {
    const event: DIRECTORY_EVENT_TYPE.MOVE_DIRECTORY = {
        moveDirectoryID: moveDir.id,
        targetDirectoryID: targetDir.id,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(DIRECTORY_EVENT_NAME.MOVE_DIRECTORY, event, (result: any) => {});
}