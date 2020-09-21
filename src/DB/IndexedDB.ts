import {
    openDB,
    IDBPDatabase,
    DBSchema,
    // deleteDB,
    // wrap,
    // unwrap,
} from 'idb';
import {Asset} from "@shared/Assets/Asset";

export enum STORE {
    IMAGE_STORE = "imageStore",
    IMAGE_KEY_STORE = "imageKeyStore",
    LOCATION_STORE = "locationStore",
    LOCATION_KEY_STORE = "locationKeyStore",
    TOKEN_STORE = "tokenStore",
    TOKEN_KEY_STORE = "tokenKeyStore",
}

interface ClientDB extends DBSchema {
    imageStore: {
        key: string;
        value: Asset.ImageInfo;
    };
    imageKeyStore: {
        key: string;
        value: string;
    };
    locationStore: {
        key: string;
        value: Asset.LocationData;
    };
    locationKeyStore: {
        key: string;
        value: Asset.LocationKey;
    };
    tokenStore: {
        key: string;
        value: Asset.TokenData;
    };
    tokenKeyStore: {
        key: string;
        value: Asset.TokenKey;
    };
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
        // await deleteDB(this.campaignID);
        this.db = await openDB(
            this.campaignID,
            DB_VERSION,
            {
                upgrade(db, oldVersion, newVersion, transaction) {
                    transaction;
                    console.log(`Upgrading DB from version ${oldVersion} to version ${newVersion}`);
                    db.createObjectStore(STORE.IMAGE_STORE);
                    db.createObjectStore(STORE.IMAGE_KEY_STORE);
                    db.createObjectStore(STORE.LOCATION_STORE);
                    db.createObjectStore(STORE.LOCATION_KEY_STORE);
                    db.createObjectStore(STORE.TOKEN_STORE);
                    db.createObjectStore(STORE.TOKEN_KEY_STORE);
                },
            }
        );
        return true;
    }
    async getSyncKeys(): Promise<Asset.AssetSyncKeys> {
        const assetDependencies: Asset.AssetSyncKeys = {
            imageKeys: await this.db.getAll(STORE.IMAGE_KEY_STORE),
            locationKeys: await this.db.getAll(STORE.LOCATION_KEY_STORE),
            tokenKeys: await this.db.getAll(STORE.TOKEN_KEY_STORE),
        }
        return assetDependencies;
    }
    async syncAssets(assets: Asset.AssetSyncGroup) {
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

        // Add new locations
        // console.log("Sync Location Data: ", assets.locationData);
        assets.locationData.toAdd.forEach(async (locationKeyValue: Asset.LocationKeyValue) => {
            const id = locationKeyValue.key.locationID;
            const key = locationKeyValue.key;
            const location = locationKeyValue.value;
            queryList.push(this.db.put(STORE.LOCATION_KEY_STORE, key, id));
            queryList.push(this.db.put(STORE.LOCATION_STORE, location, id));
        });

        // Remove extraneous locations
        assets.locationData.toRemove.forEach(async (value: Asset.LocationKey) => {
            queryList.push(this.db.delete(STORE.LOCATION_KEY_STORE, value.locationID));
            queryList.push(this.db.delete(STORE.LOCATION_STORE, value.locationID));
        });

        assets.tokenData.toAdd.forEach(async (tokenKeyValue: Asset.TokenKeyValue) => {
            const id = tokenKeyValue.key.tokenID;
            const key = tokenKeyValue.key;
            const token = tokenKeyValue.value;
            queryList.push(this.db.put(STORE.TOKEN_KEY_STORE, key, id));
            queryList.push(this.db.put(STORE.TOKEN_STORE, token, id));
        });

        // Remove extraneous tokens
        assets.tokenData.toRemove.forEach(async (value: Asset.TokenKey) => {
            queryList.push(this.db.delete(STORE.TOKEN_KEY_STORE, value.tokenID));
            queryList.push(this.db.delete(STORE.TOKEN_STORE, value.tokenID));
        });

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
        }
    }
    async addImage(image: Asset.ImageInfo) {
        await this.db.put(STORE.IMAGE_KEY_STORE, image.id, image.id);
        await this.db.put(STORE.IMAGE_STORE, image, image.id);
    }
    async deleteImage(imageID: string) {
        await this.db.delete(STORE.IMAGE_KEY_STORE, imageID);
        await this.db.delete(STORE.IMAGE_STORE, imageID);
    }
    async addLocation(locationKeyValue: Asset.LocationKeyValue) {
        const id = locationKeyValue.key.locationID;
        const key = locationKeyValue.key;
        const location = locationKeyValue.value;
        await this.db.put(STORE.LOCATION_KEY_STORE, key, id);
        await this.db.put(STORE.LOCATION_STORE, location, id);
    }
    async deleteLocation(locationID: string) {
        await this.db.delete(STORE.LOCATION_KEY_STORE, locationID);
        await this.db.delete(STORE.LOCATION_STORE, locationID);
    }
    async addToken(tokenKeyValue: Asset.TokenKeyValue) {
        const id = tokenKeyValue.key.tokenID;
        const key = tokenKeyValue.key;
        const token = tokenKeyValue.value;
        await this.db.put(STORE.TOKEN_KEY_STORE, key, id);
        await this.db.put(STORE.TOKEN_STORE, token, id);
    }
    async deleteToken(tokenID: string) {
        await this.db.delete(STORE.TOKEN_KEY_STORE, tokenID);
        await this.db.delete(STORE.TOKEN_STORE, tokenID);
    }
}
let DB: CampaignDBService = null;

const createCampaignDBService = async (campaignID: string) => {
    DB = new CampaignDBService(campaignID);
    await DB.open();
}
export {CampaignDBService, createCampaignDBService, DB};