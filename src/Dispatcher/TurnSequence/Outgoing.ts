import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { scriptStore } from '@/Stores/ScriptStore';
import { stateObjectStore } from "@/Stores/StateObjectStore";
import { campaignStore } from "@/Stores/CampaignStore";
import { GAME_EVENT_NAME, GAME_EVENT_TYPE } from "@shared/Game/GameEvent";

export const createTurnSequence = () => {
    const event: GAME_EVENT_TYPE.DO_ACTION = {
        name: campaignStore.bindings.initTurnSequenceScript,
        args: {}
    }
    serverProxy.emit(EVENT_NAME.DO_ACTION, event)
    // serverProxy.emit(EVENT_NAME.CREATE_TURN_SEQUENCE, event);
}
export const endTurn = () => {
    const event: EVENT_TYPE.END_TURN = {

    }
    serverProxy.emit(EVENT_NAME.END_TURN, event);
}
export const moveTurn = () => {

}
export const endTurnSequence = () => {
    const event: EVENT_TYPE.END_TURN_SEQUENCE = {

    }
    serverProxy.emit(EVENT_NAME.END_TURN_SEQUENCE, event);
}