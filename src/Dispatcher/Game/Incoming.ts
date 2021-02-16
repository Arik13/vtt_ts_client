import { serverProxy} from '@/Stores/ServerProxy';
import { stateObjectStore } from '@/Stores/StateObjectStore';
import { StateObject } from '@shared/Assets/Asset';
// import {DIRECTORY_EVENT_NAME, DIRECTORY_EVENT_TYPE} from "@shared/Directories/Directory";
// import * as Dir from "@shared/Directories/Directory";
// import { directoryStore} from '@/Stores/DirectoryStore';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import { GAME_EVENT_NAME, GAME_EVENT_TYPE } from "@shared/Game/GameEvent"

export const actionDone = (event: GAME_EVENT_TYPE.ACTION_DONE) => {
    console.log("Incoming Action Result: ", event);

    event.sos.forEach((so: StateObject.Data) => {
        stateObjectStore.set(so);
    });
}

serverProxy.addHandler(GAME_EVENT_NAME.ACTION_DONE, actionDone);
// serverProxy.addHandler(DIRECTORY_EVENT_NAME.DIRECTORY_MOVED, directoryMoved);