import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

export enum LOCATION_EVENT_NAME {
    TOKEN_ADDED = "TokenAdded",
    TOKEN_UPDATED = "TokenUpdated",
    TOKEN_DELETED = "TokenDeleted",
}

export namespace LOCATION_EVENT {
    export interface LocationEvent {
        eventName: LOCATION_EVENT_NAME;
    }
    export interface TokenAddedEvent extends LocationEvent {
        tokenData: Asset.Token.Data;
    }
    export interface TokenUpdatedEvent extends LocationEvent {
        tokenData: Asset.Token.Data;
    }
    export interface TokenDeleteEvent extends LocationEvent {
        tokenID: string;
    }
}

class LocationStore extends AssetStore<Asset.Location.Data> {
    constructor() {
        super("Location Store");
    }
}

const locationStore = new LocationStore();

export {
    locationStore,
    LocationStore
};