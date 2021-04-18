import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import { imageStore } from "@/Stores/ImageStore";
import {arrayBufferToString} from "@/Util/functions"
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import * as Asset from "@shared/Assets/Asset";
import {DB} from "@/DB/IndexedDB";

export const imageCreated = async (payload: ArrayBuffer[]) => {
    const eventBinary: ArrayBuffer = payload.pop();
    const event: EVENT_TYPE.IMAGE_CREATED = JSON.parse(arrayBufferToString(eventBinary));

    const imageData: Asset.ImageInfo = {
        id: event.id,
        name: event.name,
        fileType: event.fileType,
        fileBuffer: payload[0],
    }
    await DB.addImage(imageData);
    directoryStore.attachChild(event.directory);
    return imageStore.add(imageData);
}
export const imageDeleted = async (payload: EVENT_TYPE.IMAGE_DELETED) => {
    await DB.deleteImage(payload.imageID);
    imageStore.deleted(payload.imageID);
    directoryStore.delete(payload.directoryID);
}

serverProxy.addHandler(EVENT_NAME.IMAGE_CREATED, imageCreated);
serverProxy.addHandler(EVENT_NAME.IMAGE_DELETED, imageDeleted);
