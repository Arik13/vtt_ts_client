import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import { scriptStore } from "@/Stores/ScriptStore";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";

const scriptDownloaded = async (event: EVENT_TYPE.SCRIPT_CREATED) => {
    await DB.addScript(event.keyValue);
    scriptStore.add(event.keyValue.value);
    directoryStore.add(event.directory);
}
const scriptUpdated = async (event: EVENT_TYPE.SCRIPT_UPDATED) => {
    let ext = (event.script.type == "ACTION")? ".act" : "mdf";
    directoryStore.rename(event.directoryID, event.script.name + ext);
    scriptStore.update(event.script);
}
const scriptDeleted = async (event: EVENT_TYPE.SCRIPT_DELETED) => {
    await DB.deleteScript(event.scriptID);
    directoryStore.delete(event.directoryID);
    scriptStore.deleted(event.scriptID);
}

serverProxy.addHandler(EVENT_NAME.SCRIPT_CREATED, scriptDownloaded);
serverProxy.addHandler(EVENT_NAME.SCRIPT_UPDATED, scriptUpdated);
serverProxy.addHandler(EVENT_NAME.SCRIPT_DELETED, scriptDeleted);