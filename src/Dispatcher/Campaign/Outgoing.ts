import { serverProxy } from '@/Stores/ServerProxy';
import { createCampaignDBService } from '@/DB/IndexedDB';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';

import {DB} from "@/DB/IndexedDB";
import * as Asset from "@shared/Assets/Asset";
import {imageStore} from "@/Stores/ImageStore";
import {locationStore} from "@/Stores/LocationStore";
import {tokenStore} from "@/Stores/TokenStore";
import {directoryStore} from "@/Stores/DirectoryStore";
import { campaignStore } from '@/Stores/CampaignStore';
import {arrayBufferToString} from "@/Util/arrayBufferToString";
import { Directory } from '@shared/Directories/Directory';
import * as Flatted from 'flatted';
import { scriptStore } from '@/Stores/ScriptStore';
import { userStore } from '@/Stores/UserStore';
import { dcStore } from '@/Stores/DynamicComponentStore';
import { stateObjectStore } from '@/Stores/StateObjectStore';
import {clientConfigUpdated} from "./Incoming";
import { rollStore } from '@/Stores/RollStore';

export const join = async (campaignID: string, userID: string, callback?: () => void) => {
    const event: EVENT_TYPE.JOIN = {
        campaignID,
        userID
    };
    await serverProxy.emit(EVENT_NAME.JOIN, event, callback);
}

export const loadCampaign = async (campaignID: string, callback?: () => void) => {
    await createCampaignDBService(campaignID);
    const loadCampaignEvent: EVENT_TYPE.LOAD_CAMPAIGN = {
        syncGroup: await DB.getSyncKeys()
    }
    return new Promise<void>(resolve => {
        serverProxy.emit(EVENT_NAME.LOAD_CAMPAIGN, loadCampaignEvent, async (reply: ArrayBuffer[]) => {
            // Server replies with all uncached campaign assets. However, socket io can't mix json and binary in a single emit.
            // Therefore, the accompanying json data has to be encoded as binary to be sent in a single reply.
            // The json data will always be the last element in the array buffer. Need to convert it from binary first to use.
            const binarySyncGroup: ArrayBuffer = reply.pop();
            const syncGroup: Asset.SyncGroup = Flatted.parse(arrayBufferToString(binarySyncGroup));

            const imageBuffers: ArrayBuffer[] = reply;

            // Image data and buffers were decoupled for transmission. Need to reattach them so they can be put in the db together.
            const imageMetaData = syncGroup.imageData;
            for (let i = 0; i < imageMetaData.toAdd.length; i++) {
                imageMetaData.toAdd[i].fileBuffer = imageBuffers[i];
            }
            // Sync assets from server with front end db
            console.log("Deserialized Sync Group: ", syncGroup);

            await DB.syncAssets(syncGroup);
            campaignStore.setCampaign(campaignID, syncGroup.campaignData.name, syncGroup.campaignData.activeLocationID, syncGroup.clientConfig);

            const assets = await DB.getAssets();

            // Add assets to asset stores for fast recall
            imageStore.setAll(assets.imageStore);
            locationStore.setAll(assets.locationStore);
            tokenStore.setAll(assets.tokenStore);
            scriptStore.setAll(assets.scriptStore);
            dcStore.setAll(assets.dynamicComponentStore);
            stateObjectStore.setAll(assets.stateObjectStore);
            rollStore.setAll(assets.rollStore);
            const setIsOpen = (directory: Directory) => {
                if (directory.itemID) return;
                directory.isOpen = true;
                if (directory.children) {
                    directory.children.forEach(subDirectory => {
                        setIsOpen(subDirectory);
                    })
                }
            }
            const rootDir = syncGroup.directory;
            setIsOpen(rootDir);
            directoryStore.setRoot(rootDir);
            console.log(`${syncGroup.campaignData.name} loaded`);

            if (callback) {
                callback();
            }
            resolve();
        });
    });
}

export const setActiveLocation = (locationID: string) => {
    const event: EVENT_TYPE.UPDATE_ACTIVE_LOCATION = {
        locationID
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.UPDATE_ACTIVE_LOCATION, event, (reply: any) => {
        console.log("Updating Active Location: ", reply);
    });
    campaignStore.setActiveLocation(locationID);
}
export const getCampaigns = async (callback?: (result: any) => void) => {
    let result = await serverProxy.request({
        method: "GET",
        route: `users/${userStore.userID}/campaigns`,
        data: null,
    }, callback);
    return result;
}
export const deleteCampaign = (campaignID: string, callback: () => void) => {
    serverProxy.request({
        method: "DELETE",
        route: `campaigns/${campaignID}`,
        data: null,
    }, callback);
    if (campaignStore.campaignID == campaignID) {
        campaignStore.reset();
    }
}
export const updateClientConfig = async (clientConfig: Asset.ClientConfig.Data, callback?: () => void) => {
    const event: EVENT_TYPE.UPDATE_CLIENT_CONFIG = {clientConfig};
    return new Promise<Asset.ClientConfig.Data>((resolve, reject) => {
        // serverProxy.emit(EVENT_NAME.UPDATE_CLIENT_CONFIG, event, callback)
        serverProxy.emit(EVENT_NAME.UPDATE_CLIENT_CONFIG, event, async (payload: any) => {
            if (callback) {
                callback();
                resolve(null);
            }
            else {
                payload.success? resolve(clientConfigUpdated(payload.event)) : reject();
            }
        });
    })
}