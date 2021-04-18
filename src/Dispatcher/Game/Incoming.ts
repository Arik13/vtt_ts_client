import { CLIENT_EVENT, eventBus } from '@/Stores/EventBus';
import { serverProxy} from '@/Stores/ServerProxy';
import { stateObjectStore } from '@/Stores/StateObjectStore';
import { StateObject } from '@shared/Assets/Asset';
import { GAME_EVENT_NAME, GAME_EVENT_TYPE } from "@shared/Game/GameEvent"

export const actionDone = (event: GAME_EVENT_TYPE.ACTION_DONE) => {
    if (!event.sos) return;
    event.sos.forEach((so: StateObject.Data) => {
        stateObjectStore.set(so);
        eventBus.dispatch(CLIENT_EVENT.STATE_OBJECT_UPDATED, so.id);
    });
    if (event.out.client) {
        let clientEv = event.out.client;
        if (clientEv.pointLights) {
            clientEv.pointLights.forEach((point: any) => eventBus.dispatch(CLIENT_EVENT.CREATE_LIGHT, point));
        }
        if (clientEv.actionLogs) {
            eventBus.dispatch(CLIENT_EVENT.ACTION_LOG_STATEMENT_ADDED, clientEv.actionLogs);
        }
    }
}

serverProxy.addHandler(GAME_EVENT_NAME.ACTION_DONE, actionDone);