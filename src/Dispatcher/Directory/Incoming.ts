import { serverProxy} from '@/Stores/ServerProxy';
import {DIRECTORY_EVENT_NAME, DIRECTORY_EVENT_TYPE} from "@shared/Directories/Directory";
import * as Dir from "@shared/Directories/Directory";
import { directoryStore} from '@/Stores/DirectoryStore';

export const directoryCreated = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_CREATED) => {
    return directoryStore.add(event.directory);
}
export const directoryUpdated = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_UPDATED) => {
    directoryStore.rename(event.directoryID, event.name);
}
export const directoryDeleted = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_DELETED) => {
    directoryStore.delete(event.directoryID);
}
export const directoryMoved = (event: DIRECTORY_EVENT_TYPE.DIRECTORY_MOVED) => {
    directoryStore.move(event.moveDirectoryID, event.targetDirectoryID);
}

serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_CREATED, directoryCreated);
serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_UPDATED, directoryUpdated);
serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_DELETED, directoryDeleted);
serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_MOVED, directoryMoved);