import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import { scriptStore } from "@/Stores/ScriptStore";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {arrayBufferToString} from "@/Util/arrayBufferToString";
import {Asset} from "@shared/Assets/Asset";
import {DB} from "@/DB/IndexedDB";

const scriptDownloaded = async (event: EVENT_TYPE.SCRIPT_CREATED) => {
    await DB.addScript(event.keyValue);
    scriptStore.add(event.keyValue.value);
    directoryStore.attachChild(event.directory, event.parentID);
}
const scriptUpdated = async (event: EVENT_TYPE.SCRIPT_UPDATED) => {
    const dir = directoryStore.getDirectory(event.directoryID);
    const script = scriptStore.get(event.script.id);

    script.name = event.script.name;
    script.script = event.script.script;
    script.type = event.script.type;
    script.isActive = event.script.isActive;
    dir.name = event.script.name;
}
const scriptDeleted = async (event: EVENT_TYPE.SCRIPT_DELETED) => {
    scriptStore.deleted(event.scriptID);
    await DB.deleteScript(event.scriptID);
    directoryStore.delete(event.directoryID);
}

serverProxy.addHandler(EVENT_NAME.SCRIPT_CREATED, scriptDownloaded);
serverProxy.addHandler(EVENT_NAME.SCRIPT_UPDATED, scriptUpdated);
serverProxy.addHandler(EVENT_NAME.SCRIPT_DELETED, scriptDeleted);