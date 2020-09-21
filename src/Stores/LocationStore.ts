import {Asset} from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import {serverProxy} from "./ServerProxy";

export enum LOCATION_EVENT_NAME {
    TOKEN_ADDED = "TokenAdded",
}

export namespace LOCATION_EVENT {
    export interface LocationEvent {
        eventName: LOCATION_EVENT_NAME;
    }
    export interface TokenAddedEvent extends LocationEvent {
        tokenData: Asset.TokenData;
    }
}

class LocationStore extends AssetStore<Asset.LocationData> {
    constructor() {
        super("Location Store", serverProxy);
    }
}

const locationStore = new LocationStore();

export {
    locationStore,
    LocationStore
};