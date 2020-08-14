import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from 'idb';
import {ImageFile} from "../GameStores/ImageStore";

enum STORE {
    IMAGE_STORE = "imageStore",
    IMAGE_KEY_STORE = "imageKeyStore",
    LOCATION_STORE = "locationStore",
    LOCATION_KEY_STORE = "locationKeyStore",
}

interface ClientDB extends DBSchema {
    imageStore: {
        key: string;
        value: ImageFile;
    };
    imageKeyStore: {
        key: string;
        value: string;
    };
    locationStore: {
        key: string;
        value: {};
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
    async sync(toAdd: any[], toRemove: any) {
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
    async getAssets() {
        return {
            assetKeyStore: await this.db.getAll(STORE.IMAGE_KEY_STORE),
            assetStore: await this.db.getAll(STORE.IMAGE_STORE),
        }
    }
}

export {CampaignDBService};