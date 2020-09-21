import { campaignStore } from '@/Stores/CampaignStore';
import { imageStore } from '@/Stores/ImageStore';
import { serverProxy } from '@/Stores/ServerProxy';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import {DB} from "@/DB/IndexedDB";

export const createImage = (name: string, image: ArrayBuffer, directoryID: string) => {
    const event: EVENT_TYPE.UPLOAD_IMAGE = {
        campaignID: campaignStore.campaignID,
        name: name,
        fileBuffer: image,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.UPLOAD_IMAGE, event, (reply: any) => {
        if (reply.success) {
            console.log("Image Uploaded");
        }
    });
}

export const deleteImage = async (imageID: string, directoryID: string) => {
    console.log(imageID);
    imageStore.deleted(imageID);
    await DB.deleteImage(imageID);
    const event: EVENT_TYPE.DELETE_IMAGE = {
        imageID,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_IMAGE, event, (reply: any) => {
        console.log(reply)
    });
}