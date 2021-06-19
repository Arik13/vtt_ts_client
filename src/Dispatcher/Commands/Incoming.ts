import { DB } from '@/DB/IndexedDB';
import { store } from '@/Stores';
import { directoryStore } from '@/Stores/DirectoryStore';
import { locationStore } from '@/Stores/LocationStore';
import { serverProxy } from '@/Stores/ServerProxy';
import { stateObjectStore } from '@/Stores/StateObjectStore';
import { turnState, turnViewInterface } from '@/views/TurnViewInterface';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';

export const undone = async (event: EVENT_TYPE.UNDONE) => {
    let syncGroup = event.syncGroup;

    // ADD
    syncGroup.locationData.toAdd.forEach(location => {
        // console.log(location);
    });
    syncGroup.tokenData.toAdd.forEach(token => {
        // console.log(token);
    });
    syncGroup.soData.toAdd.forEach(so => {
        // console.log(so);
    });
    store.state.turnState.set(syncGroup.turnData);

    // REMOVE
    syncGroup.locationData.toRemove.forEach(location => {
        let loc = locationStore.get(location.id);

        DB.deleteLocation(location.id);
        directoryStore.delete(loc.dirID);
        locationStore.deleted(loc.id);
    });
    syncGroup.tokenData.toRemove.forEach(token => {
        // locationStore.removeToken(token.id);
        // console.log(token);
    });
    syncGroup.soData.toRemove.forEach(so => {
        stateObjectStore.deleted(so.id);
        // console.log(so);
    });
    // event.syncGroup.dirIDs.toRemove.forEach(dirID => {
    //     console.log("Dir ID: ", dirID);

    //     console.log(directoryStore.getDirectory(dirID));
    //     directoryStore.delete(dirID);
    //     console.log(directoryStore.getDirectory(dirID));
    //     // console.log();
    // });
}

serverProxy.addHandler(EVENT_NAME.UNDONE, undone);