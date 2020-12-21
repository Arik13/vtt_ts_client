import { campaignStore } from '@/Stores/CampaignStore';
import { imageStore } from '@/Stores/ImageStore';
import { serverProxy } from '@/Stores/ServerProxy';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import {DB} from "@/DB/IndexedDB";

export const createImage = (name: string, image: ArrayBuffer, directoryID: string) => {
    const event: EVENT_TYPE.CREATE_IMAGE = {
        campaignID: campaignStore.campaignID,
        name: name,
        fileBuffer: image,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.CREATE_IMAGE, event, (reply: any) => {});
}

export const deleteImage = async (imageID: string, directoryID: string) => {
    imageStore.deleted(imageID);
    await DB.deleteImage(imageID);
    const event: EVENT_TYPE.DELETE_IMAGE = {
        imageID,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_IMAGE, event, (reply: any) => {});
}