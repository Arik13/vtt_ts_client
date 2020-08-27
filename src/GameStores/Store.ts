import {Asset} from "@shared/Assets/Asset";
import {Subscriber} from "./Subscriber";
import {AssetManager} from "./AssetManager";

export abstract class Store<T extends Asset.Asset> {
    subscribers: Subscriber[] = [];
    assets: Map<string, T> = new Map();
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    subscribe(subscriber: Subscriber) {
        this.subscribers.push(subscriber)
    }
    setAll(assets: T[]) {
        this.assets.clear();
        for (const key in assets) {
            const asset = assets[key];
            this.assets.set(asset.id, asset);
        }
    }
    forEach(handler: (value: T) => void) {
        this.assets.forEach(handler);
    }
    reset() {
        this.assets.clear();
        this.subscribers = [];
    }

///////////////////////////////////////////////////////////
// C.R.U.D. Operations (Create, Read, Update, Delete)

    // Create
    abstract create(...args: any[]): void;

    // Read
    get(id: string): T {
        return this.assets.get(id);
    }
    add(asset: T): void {
        if (this.assets.get(asset.id)) return;
        this.assets.set(asset.id, asset);
        this.subscribers.forEach((subscriber) => {
            subscriber.added(asset.id);
        });
    }

    // Update methods defined by sub class

    // Delete
    abstract delete(id: string): void;
    deleted(id: string): void {
        const asset = this.assets.get(id);
        if (!asset) return;
        this.subscribers.forEach((subscriber) => {
            subscriber.deleted(asset.id);
        });
        this.assets.delete(id);
    }
///////////////////////////////////////////////////////////
    // abstract addHandler(): void;
    // abstract createHandler(): void;
    // abstract deleteHandler(): void;
    // abstract addHandler(): void;

}


/*
    _CREATE_
    Create is called
    Arguments are processed into payload
    Payload is sent to server
    Server creates assets
    Server broadcasts new asset


    Trying to avoid the asset manager having to make multiple calls to create or delete an asset
    To do that, there needs to be a single object that deals with indexedDB, the stores and calling the server
    The question is, should it be the store?

*/