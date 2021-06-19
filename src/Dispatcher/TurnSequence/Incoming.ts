import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { stateObjectStore } from '@/Stores/StateObjectStore';
import {turnViewInterface} from "@/views/TurnViewInterface";
import { CLIENT_EVENT, eventBus } from "@/Stores/EventBus";
import { handleActionDone } from "../Game/Incoming";

const turnSequenceCreated = async (event: EVENT_TYPE.TURN_SEQUENCE_CREATED) => {
    // turnViewInterface.startTurnSequence(event.turnData);
    handleActionDone(event);
}
const turnEnded = async (event: EVENT_TYPE.TURN_ENDED) => {
    // turnViewInterface.endTurn(event.turnData);
    handleActionDone(event);
}
const turnMoved = async (event: EVENT_TYPE.TURN_MOVED) => {
    handleActionDone(event);
}
const turnSequenceEnded = async (event: EVENT_TYPE.TURN_SEQUENCE_ENDED) => {
    turnViewInterface.endTurnSequence();
    handleActionDone(event);
}

serverProxy.addHandler(EVENT_NAME.TURN_SEQUENCE_CREATED, turnSequenceCreated);
serverProxy.addHandler(EVENT_NAME.TURN_ENDED, turnEnded);
serverProxy.addHandler(EVENT_NAME.TURN_MOVED, turnMoved);
serverProxy.addHandler(EVENT_NAME.TURN_SEQUENCE_ENDED, turnSequenceEnded);