import { serverProxy } from '@/Stores/ServerProxy';
import { createCampaignDBService } from '@/DB/IndexedDB';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';

import {DB} from "@/DB/IndexedDB";
import { Asset } from '@shared/Assets/Asset';
import {imageStore} from "@/Stores/ImageStore";
import {locationStore} from "@/Stores/LocationStore";
import {tokenStore} from "@/Stores/TokenStore";
import {directoryStore} from "@/Stores/DirectoryStore";
import { campaignStore, initCampaignStore } from '@/Stores/CampaignStore';
import {arrayBufferToString} from "@/Util/arrayBufferToString";
import { Directory } from '@shared/Directories/Directory';
import * as Flatted from 'flatted';

export const join = async (campaignID: string, userID: string, callback: () => void) => {

    const event: EVENT_TYPE.JOIN = {
        campaignID,
        userID
    };
    await serverProxy.emit(EVENT_NAME.JOIN, event, callback);

    // const payload: ACTION_ARG.TRIGGER_EVENT = {
    //     eventName: EVENT_NAME.JOIN,
    //     event: event,
    //     callback: (res: any) => {
            // dispatcher.loadCampaign(campaignID, () => {
            //     this.$store.state.campaignID = campaignID;
            //         this.$router.push({ path: `/campaigneditor/${campaignID}` });
            // });
    //     }
    // };
    // this.$store.dispatch(ACTION.TRIGGER_EVENT, payload);
}

export const loadCampaign = async(campaignID: string, callback: () => void) => {
    await createCampaignDBService(campaignID);
    const loadCampaignEvent: EVENT_TYPE.LOAD_CAMPAIGN = {
        syncGroup: await DB.getSyncKeys()
    }
    serverProxy.emit(EVENT_NAME.LOAD_CAMPAIGN, loadCampaignEvent, async (reply: ArrayBuffer[]) => {
        // Server replies with all uncached campaign assets. However, socket io can't mix json and binary in a single emit.
        // Therefore, the accompanying json data has to be encoded as binary to be sent in a single reply.
        // The json data will always be the last element in the array buffer. Need to convert it from binary first to use.
        const metaBinary: ArrayBuffer = reply.pop();
        const metaData: Asset.AssetSyncGroup = Flatted.parse(arrayBufferToString(metaBinary));
        // console.log("MetaData: ", metaData)

        const imageBuffers: ArrayBuffer[] = reply;

        // Image data and buffers were decoupled for transmission. Need to reattach them so they can be put in the db together.
        const imageMetaData = metaData.imageData;
        for (let i = 0; i < imageMetaData.toAdd.length; i++) {
            imageMetaData.toAdd[i].fileBuffer = imageBuffers[i];
        }
        // Sync assets from server with front end db
        await DB.syncAssets(metaData);
        initCampaignStore(campaignID, metaData.campaignData.name, metaData.campaignData.activeLocationID);

        const assets = await DB.getAssets();

        // Add assets to asset stores for fast recall
        imageStore.setAll(assets.imageStore);
        locationStore.setAll(assets.locationStore);
        tokenStore.setAll(assets.tokenStore);
        const setIsOpen = (directory: Directory) => {
            if (directory.itemID) return;
            directory.isOpen = true;
            if (directory.children) {
                directory.children.forEach(subDirectory => {
                    setIsOpen(subDirectory);
                })
            }
        }
        const rootDir = metaData.directory
        setIsOpen(rootDir);
        directoryStore.setRoot(rootDir);
        callback();
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