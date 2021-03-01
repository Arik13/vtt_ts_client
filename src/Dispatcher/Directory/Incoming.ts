import { serverProxy} from '@/Stores/ServerProxy';
import {DIRECTORY_EVENT_NAME, DIRECTORY_EVENT_TYPE} from "@shared/Directories/Directory";
import * as Dir from "@shared/Directories/Directory";
import { directoryStore} from '@/Stores/DirectoryStore';

export const directoryCreated = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_CREATED) => {
    return directoryStore.attachChild(event.directory, event.targetDirectoryID);
}
export const directoryUpdated = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_UPDATED) => {
    const dir = directoryStore.getDirectory(event.directoryID);
    dir.name = event.name;
}
export const directoryDeleted = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_DELETED) => {
    const dir = directoryStore.getDirectory(event.directoryID);
    Dir.deleteDirectory(dir);
}
export const directoryMoved = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_MOVED) => {
    const moveDir = directoryStore.getDirectory(event.moveDirectoryID);
    const targetDir = directoryStore.getDirectory(event.targetDirectoryID);
    Dir.moveDirectory(moveDir, targetDir);
}

serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_CREATED, directoryCreated);
serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_UPDATED, directoryUpdated);
serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_DELETED, directoryDeleted);
serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_MOVED, directoryMoved);