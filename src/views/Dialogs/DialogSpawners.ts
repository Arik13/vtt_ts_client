import dispatcher from '@/Dispatcher/Dispatcher';
import { directoryStore } from '@/Stores/DirectoryStore';
import { dialogs, UpdateDirectoryState } from './Dialog';

export const spawnCreateDirectoryDialog = (dirID: string) => {
    const dialog = dialogs.createDirectory;
    dialog.state.parentID = dirID;
    dialog.show(state => {
        dispatcher.createDirectory(
            state.name,
            state.parentID,
        );
    })
    return;
}
export const spawnUpdateDirectoryDialog = (dirID: string) => {
    let dir = directoryStore.get(dirID);
    const dialog = dialogs.updateDirectory;
    dialog.state.directoryID = dirID;
    dialog.state.name = dir.name;
    dialog.show(state => {
        dispatcher.updateDirectory(
            state.directoryID,
            state.name,
        );
    })
    return;
}