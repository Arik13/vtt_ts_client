import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from 'idb';
// import {ImageFile} from "../GameStores/ImageStore";
import {Asset} from "@shared/Assets/Asset";

enum STORE {
    IMAGE_STORE = "imageStore",
    IMAGE_KEY_STORE = "imageKeyStore",
    LOCATION_STORE = "locationStore",
    LOCATION_KEY_STORE = "locationKeyStore",
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
        value: string;
    };
}

class CampaignDBService {
    db: IDBPDatabase<ClientDB>;
    campaignID: string;
    constructor(campaignID: string) {
        this.campaignID = campaignID;
    }
    async open() {
        await deleteDB(this.campaignID);
        this.db = await openDB(
            this.campaignID,
            1,
            {
                upgrade(db, oldVersion, newVersion, transaction) {
                    console.log(`Upgrading DB from version ${oldVersion} to version ${newVersion}`);
                    db.createObjectStore(STORE.IMAGE_STORE);
                    db.createObjectStore(STORE.IMAGE_KEY_STORE);
                    db.createObjectStore(STORE.LOCATION_STORE);
                    db.createObjectStore(STORE.LOCATION_KEY_STORE);
                },
            }
        );
        return true;
    }
    async getSyncKeys(): Promise<any> {
        const assetDependencies = {
            imageIDs: await this.db.getAll(STORE.IMAGE_KEY_STORE),
            locations: await this.db.getAll(STORE.LOCATION_KEY_STORE),
        }
        return assetDependencies;
    }
    async syncImages(toAdd: any[], toRemove: any) {
        // Add new images
        toAdd.forEach(async (value: any) => {
            const id = value._id;
            await this.db.put(STORE.IMAGE_KEY_STORE, id, id);
            await this.db.put(STORE.IMAGE_STORE, value, id);
        });

        // Remove extraneous images
        toRemove.forEach(async (value: any) => {
            await this.db.delete(STORE.IMAGE_KEY_STORE, value);
            await this.db.delete(STORE.IMAGE_STORE, value);
        });
    }
    async syncLocations(toAdd: any[], toRemove: any) {
        // Add new images
        toAdd.forEach(async (value: any) => {
            const id = value._id;
            await this.db.put(STORE.LOCATION_KEY_STORE, id, id);
            await this.db.put(STORE.LOCATION_STORE, value, id);
        });

        // Remove extraneous images
        toRemove.forEach(async (value: any) => {
            await this.db.delete(STORE.LOCATION_KEY_STORE, value);
            await this.db.delete(STORE.LOCATION_STORE, value);
        });
    }
    async syncAssets(assets: Asset.AssetSyncGroup) {
        // Add new images

        const queryList: Promise<any>[] = [];

        assets.imageData.toAdd.forEach(async (value: Asset.ImageInfo) => {
            const id = value._id;
            queryList.push(this.db.put(STORE.IMAGE_KEY_STORE, id, id));
            queryList.push(this.db.put(STORE.IMAGE_STORE, value, id));
        });

        // Remove extraneous images
        assets.imageData.toRemove.forEach(async (value: any) => {
            queryList.push(this.db.delete(STORE.IMAGE_KEY_STORE, value));
            queryList.push(this.db.delete(STORE.IMAGE_STORE, value));
        });

        assets.locationData.toAdd.forEach(async (value: any) => {
            const id = value.locationID;
            queryList.push(this.db.put(STORE.LOCATION_KEY_STORE, id, id));
            queryList.push(this.db.put(STORE.LOCATION_STORE, value, id));
        });

        // Remove extraneous images
        assets.locationData.toRemove.forEach(async (value: any) => {
            queryList.push(this.db.delete(STORE.LOCATION_KEY_STORE, value));
            queryList.push(this.db.delete(STORE.LOCATION_STORE, value));
        });

        await Promise.all(queryList);
    }

    async getAssets() {
        return {
            imageKeyStore: await this.db.getAll(STORE.IMAGE_KEY_STORE),
            imageStore: await this.db.getAll(STORE.IMAGE_STORE),
            locationKeyStore: await this.db.getAll(STORE.LOCATION_KEY_STORE),
            locationStore: await this.db.getAll(STORE.LOCATION_STORE),
        }
    }
}

export {CampaignDBService};