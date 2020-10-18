import {serverProxy} from "@/Stores/ServerProxy";
import { directoryStore } from '@/Stores/DirectoryStore';
import { imageStore } from "@/Stores/ImageStore";
import {arrayBufferToString} from "@/Util/arrayBufferToString"
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {Asset} from "@shared/Assets/Asset";
import {DB} from "@/DB/IndexedDB";

const imageDownloaded = async (payload: ArrayBuffer[]) => {
    console.log("Image Downloaded");

    const eventBinary: ArrayBuffer = payload.pop();
    const event: EVENT_TYPE.DOWNLOAD_IMAGE = JSON.parse(arrayBufferToString(eventBinary));

    const imageData: Asset.ImageInfo = {
        id: event.id,
        name: event.name,
        fileType: event.fileType,
        fileBuffer: payload[0],
    }
    await DB.addImage(imageData);
    imageStore.add(imageData);
    directoryStore.attachChild(event.directory, event.parentID);
}
const imageDeleted = async (payload: EVENT_TYPE.IMAGE_DELETED) => {
    imageStore.deleted(payload.imageID);
    directoryStore.delete(payload.directoryID);
}


serverProxy.addHandler(EVENT_NAME.IMAGE_DOWNLOADED, imageDownloaded);
serverProxy.addHandler(EVENT_NAME.IMAGE_DELETED, imageDeleted);