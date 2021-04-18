import * as Asset from "@shared/Assets/Asset";
import { CLIENT_EVENT, eventBus } from "./EventBus";

export abstract class AssetStore<T extends Asset.Asset> {
    assets: Map<string, T> = new Map();
    name: string;
    addedEventName: CLIENT_EVENT;
    updatedEventName: CLIENT_EVENT;
    deletedEventName: CLIENT_EVENT;
    constructor(
        name: string,
        addedEventName: CLIENT_EVENT,
        updatedEventName: CLIENT_EVENT,
        deletedEventName: CLIENT_EVENT,
    ) {
        this.name = name;
        this.addedEventName = addedEventName;
        this.updatedEventName = updatedEventName;
        this.deletedEventName = deletedEventName;
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
    }
    get(id: string): T {
        return this.assets.get(id);
    }
    add(asset: T): T {
        if (this.assets.get(asset.id)) return;
        this.assets.set(asset.id, asset);
        eventBus.dispatch(this.addedEventName, asset.id);
        return this.assets.get(asset.id);
    }
    set(asset: T) {
        this.assets.set(asset.id, asset);
    }
    update(newAsset: T) {
        let asset = this.assets.get(newAsset.id);
        for (let key in asset) {
            asset[key] = newAsset[key];
        }
        eventBus.dispatch(this.updatedEventName, asset.id);
    }
    deleted(id: string): void {
        const asset = this.assets.get(id);
        if (!asset) return;
        eventBus.dispatch(this.deletedEventName, asset.id);
        this.assets.delete(id);
    }
}