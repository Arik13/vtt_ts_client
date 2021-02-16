import {serverProxy} from "@/Stores/ServerProxy";
import { rollStore } from '@/Stores/RollStore';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {Asset} from "@shared/Assets/Asset";
import {DB} from "@/DB/IndexedDB";

export const rollCreated = async (event: EVENT_TYPE.ROLL_CREATED) => {
    await DB.addRoll(event.keyValue);
    return rollStore.add(event.keyValue.value);
}

export const rollUpdated = async (event: EVENT_TYPE.ROLL_UPDATED) => {
    let roll = rollStore.get(event.roll.id);
    roll = event.roll;
}

export const rollDeleted = async (event: EVENT_TYPE.ROLL_DELETED) => {
    await DB.deleteRoll(event.id);
    rollStore.deleted(event.id);
}

serverProxy.addHandler(EVENT_NAME.ROLL_CREATED, rollCreated);
serverProxy.addHandler(EVENT_NAME.ROLL_UPDATED, rollUpdated);
serverProxy.addHandler(EVENT_NAME.ROLL_DELETED, rollDeleted);