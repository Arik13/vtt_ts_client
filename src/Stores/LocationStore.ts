import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";


class LocationStore extends AssetStore<Asset.Location.Data> {
    constructor() {
        super(
            "Location Store",
            CLIENT_EVENT.LOCATION_ADDED,
            CLIENT_EVENT.LOCATION_UPDATED,
            CLIENT_EVENT.LOCATION_DELETED,
        );
    }
    removeToken(locationID: string, tokenID: string) {
        let location = this.assets.get(locationID);
        let index = location.tokenIDs.findIndex(tID => tID == tokenID);
        location.tokenIDs.splice(index, 1);
    }
}

const locationStore = new LocationStore();

export {
    locationStore,
    LocationStore
};