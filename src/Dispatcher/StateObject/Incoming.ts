import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { stateObjectStore } from '@/Stores/StateObjectStore';

const stateObjectCreated = async (event: EVENT_TYPE.STATE_OBJECT_CREATED) => {
    await DB.addStateObject(event.keyValue);
    stateObjectStore.add(event.keyValue.value);
    directoryStore.attachChild(event.directory);
}

const stateObjectUpdated = async (event: EVENT_TYPE.STATE_OBJECT_UPDATED) => {
    directoryStore.updateName(event.directoryID, event.stateObject.id);
    stateObjectStore.update(event.stateObject);
}

const stateObjectDeleted = async (event: EVENT_TYPE.STATE_OBJECT_DELETED) => {
    await DB.deleteStateObject(event.soID);
    stateObjectStore.deleted(event.soID);
    directoryStore.delete(event.directoryID);
}

serverProxy.addHandler(EVENT_NAME.STATE_OBJECT_CREATED, stateObjectCreated);
serverProxy.addHandler(EVENT_NAME.STATE_OBJECT_UPDATED, stateObjectUpdated);
serverProxy.addHandler(EVENT_NAME.STATE_OBJECT_DELETED, stateObjectDeleted);