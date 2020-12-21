import dispatcher from '@/Dispatcher/Dispatcher';
import { dialogMap, DIALOG_NAME } from './Dialog';
import { DialogObject } from './DialogObject';

export const spawnCreateDirectoryDialog = (itemID: string) => {
    const dialog = dialogMap.get(DIALOG_NAME.CREATE_DIRECTORY) as DialogObject<any>;
    dialog.state.parentID = itemID;
    dialog.show((state: any) => {
        dispatcher.createDirectory(
            state.name,
            state.parentID,
        );
    })
    return;
}