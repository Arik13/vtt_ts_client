import {
    openDB,
    IDBPDatabase,
    DBSchema,
    deleteDB,
    // wrap,
    // unwrap,
} from 'idb';
import * as Asset from "@shared/Assets/Asset";

export enum STORE {
    IMAGE_STORE = "imageStore",
    IMAGE_KEY_STORE = "imageKeyStore",
    LOCATION_STORE = "locationStore",
    LOCATION_KEY_STORE = "locationKeyStore",
    TOKEN_STORE = "tokenStore",
    TOKEN_KEY_STORE = "tokenKeyStore",
    SCRIPT_STORE = "scriptStore",
    SCRIPT_KEY_STORE = "scriptKeyStore",
    DYNAMIC_COMPONENT_STORE = "dynamicComponentStore",
    DYNAMIC_COMPONENT_KEY_STORE = "dynamicComponentKeyStore",
    STATE_OBJECT_STORE = "stateObjectStore",
    STATE_OBJECT_KEY_STORE = "stateObjectKeyStore",
}

interface ClientDB extends DBSchema {
    // Asset Stores
    imageStore:                 {key: string; value: Asset.ImageInfo};
    locationStore:              {key: string; value: Asset.Location.Data};
    tokenStore:                 {key: string; value: Asset.Token.Data};
    scriptStore:                {key: string; value: Asset.Script.Data};
    dynamicComponentStore:      {key: string; value: Asset.DynamicComponent.Data};
    stateObjectStore:           {key: string; value: Asset.StateObject.Data};

    // Key Stores
    imageKeyStore:              {key: string; value: string};
    locationKeyStore:           {key: string; value: Asset.Key};
    tokenKeyStore:              {key: string; value: Asset.Key};
    scriptKeyStore:             {key: string; value: Asset.Key};
    dynamicComponentKeyStore:   {key: string; value: Asset.Key};
    stateObjectKeyStore:        {key: string; value: Asset.Key};
}

const DB_VERSION = 1;

class CampaignDBService {
    db: IDBPDatabase<ClientDB>;
    campaignID: string;
    constructor(campaignID: string) {
        console.log("Constructing DB Service for campaign: ", campaignID);
        this.campaignID = campaignID;
    }
    async open() {
        // Delete for debugging purposes
        await deleteDB(this.campaignID);
        this.db = await openDB(
            this.campaignID,
            DB_VERSION,
            {
                upgrade(db, oldVersion, newVersion, transaction) {
                    transaction;
                    console.log(`Upgrading DB from version ${oldVersion} to version ${newVersion}`);

                    // Asset Stores
                    db.createObjectStore(STORE.IMAGE_STORE);
                    db.createObjectStore(STORE.LOCATION_STORE);
                    db.createObjectStore(STORE.TOKEN_STORE);
                    db.createObjectStore(STORE.SCRIPT_STORE);
                    db.createObjectStore(STORE.DYNAMIC_COMPONENT_STORE);
                    db.createObjectStore(STORE.STATE_OBJECT_STORE);

                    // Key Stores
                    db.createObjectStore(STORE.IMAGE_KEY_STORE);
                    db.createObjectStore(STORE.LOCATION_KEY_STORE);
                    db.createObjectStore(STORE.TOKEN_KEY_STORE);
                    db.createObjectStore(STORE.SCRIPT_KEY_STORE);
                    db.createObjectStore(STORE.DYNAMIC_COMPONENT_KEY_STORE);
                    db.createObjectStore(STORE.STATE_OBJECT_KEY_STORE);
                },
            }
        );
        return true;
    }
    async getSyncKeys(): Promise<Asset.SyncKeys> {
        const assetDependencies: Asset.SyncKeys = {
            imageKeys: await this.db.getAll(STORE.IMAGE_KEY_STORE),
            locationKeys: await this.db.getAll(STORE.LOCATION_KEY_STORE),
            tokenKeys: await this.db.getAll(STORE.TOKEN_KEY_STORE),
            scriptKeys: await this.db.getAll(STORE.SCRIPT_KEY_STORE),
            dynamicComponentKeys: await this.db.getAll(STORE.DYNAMIC_COMPONENT_KEY_STORE),
            soKeys: await this.db.getAll(STORE.STATE_OBJECT_KEY_STORE),
        }
        return assetDependencies;
    }
    private async syncAsset(assetStore: STORE, keyStore: STORE, data: {toAdd: any[]; toRemove: Asset.Key[]}, queryList: Promise<any>[]) {
        // Add new assets
        data.toAdd.forEach(async (keyVal: any) => {
            queryList.push(this.db.put(keyStore, keyVal.key, keyVal.key.id));
            queryList.push(this.db.put(assetStore, keyVal.value, keyVal.key.id));
        });
        // Remove extraneous assets
        data.toRemove.forEach(async (key: Asset.Key) => {
            queryList.push(this.db.delete(STORE.LOCATION_KEY_STORE, key.id));
            queryList.push(this.db.delete(STORE.LOCATION_STORE, key.id));
        });
    }
    async syncAssets(assets: Asset.SyncGroup) {
        const queryList: Promise<string | void>[] = [];

        // Add new images
        assets.imageData.toAdd.forEach(async (value: Asset.ImageInfo) => {
            const id = value.id;
            queryList.push(this.db.put(STORE.IMAGE_KEY_STORE, id, id));
            queryList.push(this.db.put(STORE.IMAGE_STORE, value, id))
        });

        // Remove extraneous images
        assets.imageData.toRemove.forEach(async (value: string) => {
            queryList.push(this.db.delete(STORE.IMAGE_KEY_STORE, value));
            queryList.push(this.db.delete(STORE.IMAGE_STORE, value));
        });

        this.syncAsset(STORE.LOCATION_STORE, STORE.LOCATION_KEY_STORE, assets.locationData, queryList);
        this.syncAsset(STORE.TOKEN_STORE, STORE.TOKEN_KEY_STORE, assets.tokenData, queryList);
        this.syncAsset(STORE.SCRIPT_STORE, STORE.SCRIPT_KEY_STORE, assets.scriptData, queryList);
        this.syncAsset(STORE.DYNAMIC_COMPONENT_STORE, STORE.DYNAMIC_COMPONENT_KEY_STORE, assets.dcData, queryList);
        this.syncAsset(STORE.STATE_OBJECT_STORE, STORE.STATE_OBJECT_KEY_STORE, assets.soData, queryList);
        await Promise.all(queryList);
    }

    async getAssets() {
        return {
            imageStore: await this.db.getAll(STORE.IMAGE_STORE),
            imageKeyStore: await this.db.getAll(STORE.IMAGE_KEY_STORE),
            locationStore: await this.db.getAll(STORE.LOCATION_STORE),
            locationKeyStore: await this.db.getAll(STORE.LOCATION_KEY_STORE),
            tokenStore: await this.db.getAll(STORE.TOKEN_STORE),
            tokenKeyStore: await this.db.getAll(STORE.TOKEN_KEY_STORE),
            scriptStore: await this.db.getAll(STORE.SCRIPT_STORE),
            scriptKeyStore: await this.db.getAll(STORE.SCRIPT_KEY_STORE),
            dynamicComponentStore: await this.db.getAll(STORE.DYNAMIC_COMPONENT_STORE),
            dynamicComponentKeyStore: await this.db.getAll(STORE.DYNAMIC_COMPONENT_KEY_STORE),
            stateObjectStore: await this.db.getAll(STORE.STATE_OBJECT_STORE),
            stateObjectKeyStore: await this.db.getAll(STORE.STATE_OBJECT_KEY_STORE),
        }
    }
    private async putAsset(assetStore: STORE, keyStore: STORE, key: Asset.Key, asset: any) {
        await Promise.all([
            this.db.put(keyStore, key, key.id),
            this.db.put(assetStore, asset, key.id),
        ]);
    }
    async addImage(image: Asset.ImageInfo) {
        await Promise.all([
            this.db.put(STORE.IMAGE_KEY_STORE, image.id, image.id),
            this.db.put(STORE.IMAGE_STORE, image, image.id),
        ]);
    }
    async addLocation(keyVal: Asset.Location.KeyValue) {
        await this.putAsset(STORE.LOCATION_STORE, STORE.LOCATION_KEY_STORE, keyVal.key, keyVal.value);
    }
    async addToken(keyVal: Asset.Token.KeyValue) {
        await this.putAsset(STORE.TOKEN_STORE, STORE.TOKEN_KEY_STORE, keyVal.key, keyVal.value);
    }
    async addScript(keyVal: Asset.Script.KeyValue) {
        await this.putAsset(STORE.SCRIPT_STORE, STORE.SCRIPT_KEY_STORE, keyVal.key, keyVal.value);
    }
    async addDynamicComponent(keyVal: Asset.DynamicComponent.KeyValue) {
        await this.putAsset(STORE.DYNAMIC_COMPONENT_STORE, STORE.DYNAMIC_COMPONENT_KEY_STORE, keyVal.key, keyVal.value);
    }
    async addStateObject(keyVal: Asset.StateObject.KeyValue) {
        await this.putAsset(STORE.STATE_OBJECT_STORE, STORE.STATE_OBJECT_KEY_STORE, keyVal.key, keyVal.value);
    }

    async deleteImage(id: string) {
        await this.db.delete(STORE.IMAGE_KEY_STORE, id);
        await this.db.delete(STORE.IMAGE_STORE, id);
    }
    async deleteLocation(id: string) {
        await this.db.delete(STORE.LOCATION_KEY_STORE, id);
        await this.db.delete(STORE.LOCATION_STORE, id);
    }
    async deleteToken(id: string) {
        await this.db.delete(STORE.TOKEN_KEY_STORE, id);
        await this.db.delete(STORE.TOKEN_STORE, id);
    }
    async deleteScript(id: string) {
        await this.db.delete(STORE.SCRIPT_KEY_STORE, id);
        await this.db.delete(STORE.SCRIPT_STORE, id);
    }
    async deleteDynamicComponent(id: string) {
        await this.db.delete(STORE.DYNAMIC_COMPONENT_KEY_STORE, id);
        await this.db.delete(STORE.DYNAMIC_COMPONENT_STORE, id);
    }
    async deleteStateObject(id: string) {
        await this.db.delete(STORE.DYNAMIC_COMPONENT_KEY_STORE, id);
        await this.db.delete(STORE.DYNAMIC_COMPONENT_STORE, id);
    }
}
let DB: CampaignDBService = null;

const createCampaignDBService = async (campaignID: string) => {
    DB = new CampaignDBService(campaignID);
    await DB.open();
}
export {CampaignDBService, createCampaignDBService, DB};