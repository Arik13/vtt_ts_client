import dispatcher from '@/Dispatcher/Dispatcher';
import { directoryStore } from '@/Stores/DirectoryStore';
import { dialogMap, DIALOG_NAME, UpdateDirectoryState } from './Dialog';
import { DialogObject } from './DialogObject';

export const spawnCreateDirectoryDialog = (dirID: string) => {
    const dialog = dialogMap.get(DIALOG_NAME.CREATE_DIRECTORY) as DialogObject<any>;
    dialog.state.parentID = dirID;
    dialog.show((state: any) => {
        dispatcher.createDirectory(
            state.name,
            state.parentID,
        );
    })
    return;
}
export const spawnUpdateDirectoryDialog = (dirID: string) => {
    let dir = directoryStore.getDirectory(dirID);
    const dialog = dialogMap.get(DIALOG_NAME.UPDATE_DIRECTORY) as DialogObject<UpdateDirectoryState>;
    dialog.state.directoryID = dirID;
    dialog.state.name = dir.name;
    dialog.show((state: any) => {
        dispatcher.updateDirectory(
            state.directoryID,
            state.name,
        );
    })
    return;
}