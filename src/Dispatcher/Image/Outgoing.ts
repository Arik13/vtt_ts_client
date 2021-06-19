import { campaignStore } from '@/Stores/CampaignStore';
import { imageStore } from '@/Stores/ImageStore';
import { serverProxy } from '@/Stores/ServerProxy';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import {DB} from "@/DB/IndexedDB";
import * as Asset from "@shared/Assets/Asset";
import {imageCreated} from "./Incoming";

export const createImage = (name: string, buffer: ArrayBuffer, directoryID: string) => {
    let image: Asset.ImageInfo = {
        name,
        fileBuffer: buffer,
        dirID: directoryID,
        fileType: "",
    }
    const event: EVENT_TYPE.CREATE_IMAGE = {
        image,
        directoryID,
        // campaignID: campaignStore.campaignID,
        // name: name,
        // fileBuffer: image,
        // directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return new Promise<Asset.ImageInfo>((resolve, reject) => {
        serverProxy.emit(EVENT_NAME.CREATE_IMAGE, event, async (payload: any) => {
            resolve(imageCreated(payload));
        });
    })
    // serverProxy.emit(EVENT_NAME.CREATE_IMAGE, event, (reply: any) => {});
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