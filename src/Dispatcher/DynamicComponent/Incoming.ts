import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import { scriptStore } from "@/Stores/ScriptStore";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {arrayBufferToString} from "@/Util/arrayBufferToString";
import {Asset} from "@shared/Assets/Asset";
import {DB} from "@/DB/IndexedDB";
import { dcStore } from '@/Stores/DynamicComponentStore';

export const dynamicComponentCreated = async (event: EVENT_TYPE.DYNAMIC_COMPONENT_CREATED) => {
    await DB.addDynamicComponent(event.keyValue);
    directoryStore.attachChild(event.directory, event.parentID);
    return dcStore.add(event.keyValue.value);
}

export const dynamicComponentUpdated = async (event: EVENT_TYPE.DYNAMIC_COMPONENT_UPDATED) => {
    const dir = directoryStore.getDirectory(event.directoryID);
    let dc = dcStore.get(event.dynamicComponent.id);
    dc = event.dynamicComponent;
    dir.name = event.dynamicComponent.name;
}

export const dynamicComponentDeleted = async (event: EVENT_TYPE.DYNAMIC_COMPONENT_DELETED) => {
    await DB.deleteDynamicComponent(event.dcID);
    dcStore.deleted(event.dcID);
    directoryStore.delete(event.directoryID);
}

serverProxy.addHandler(EVENT_NAME.DYNAMIC_COMPONENT_CREATED, dynamicComponentCreated);
serverProxy.addHandler(EVENT_NAME.DYNAMIC_COMPONENT_UPDATED, dynamicComponentUpdated);
serverProxy.addHandler(EVENT_NAME.DYNAMIC_COMPONENT_DELETED, dynamicComponentDeleted);