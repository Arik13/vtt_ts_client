import { serverProxy} from '@/Stores/ServerProxy';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import { GAME_EVENT_NAME, GAME_EVENT_TYPE } from "@shared/Game/GameEvent"

export const sendGameEvent = async (eventPayload: GAME_EVENT_TYPE.GAME_EVENT_TYPE, eventName: GAME_EVENT_NAME) => {

    const event = {
        name: eventName,
        event: eventPayload,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.SEND_GAME_EVENT, event);
}
export const doAction = (actionName: string, actionArgs: any, callback?: (event: GAME_EVENT_TYPE.ACTION_DONE) => void) => {
    const event: GAME_EVENT_TYPE.DO_ACTION = {
        name: actionName,
        args: actionArgs,
        // targetIDs,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DO_ACTION, event, callback);
}