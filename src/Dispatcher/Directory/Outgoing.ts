import { serverProxy} from '@/Stores/ServerProxy';
import {DIRECTORY_EVENT_NAME, DIRECTORY_EVENT_TYPE, Directory} from "@shared/Directories/Directory";

export const createDirectory = async (name: string, parentID: string) => {
    const event: DIRECTORY_EVENT_TYPE.CREATE_DIRECTORY = {
        parentID: parentID,
        name: name,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(DIRECTORY_EVENT_NAME.CREATE_DIRECTORY, event, (result: any) => {});
}

export const moveDirectory = async (moveDir: Directory, targetDir: Directory) => {
    const event: DIRECTORY_EVENT_TYPE.MOVE_DIRECTORY = {
        moveDirectoryID: moveDir.id,
        targetDirectoryID: targetDir.id,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(DIRECTORY_EVENT_NAME.MOVE_DIRECTORY, event, (result: any) => {});
}
export const deleteDirectory = async (directoryID: string) => {
    const event: DIRECTORY_EVENT_TYPE.DELETE_DIRECTORY = {
        directoryID
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(DIRECTORY_EVENT_NAME.DELETE_DIRECTORY, event, (result: any) => {});
}