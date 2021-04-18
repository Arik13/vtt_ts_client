import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { scriptStore } from '@/Stores/ScriptStore';
import { stateObjectStore } from "@/Stores/StateObjectStore";

export const createTurnSequence = () => {
    const event: EVENT_TYPE.CREATE_TURN_SEQUENCE = {

    }
    serverProxy.emit(EVENT_NAME.CREATE_TURN_SEQUENCE, event);
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