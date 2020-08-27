import {Asset} from "@shared/Assets/Asset";
import {Store} from "./Store";
import {serverProxy, ServerProxy} from "./ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";

class LocationStore extends Store<Asset.LocationData> {
    serverProxy: ServerProxy = serverProxy;
    constructor() {
        super("Location Store");
        this.serverProxy.addHandler(EVENT_NAME.LOCATION_DOWNLOADED, this.locationDownloaded);
        this.serverProxy.addHandler(EVENT_NAME.LOCATION_DELETED, this.locationDeleted);
    }
    create(location: Asset.LocationData) {
        const event: EVENT_TYPE.CREATE_LOCATION = {
            location: location,
        }
        this.serverProxy.emit(EVENT_NAME.CREATE_LOCATION, event, (reply: any) => {
            if (reply.success) {
                console.log("Location Created");
            }
        });
    }
    async delete(id: string) {
        this.deleted(id);
        await DB.deleteImage(id);
        const event: EVENT_TYPE.LOCATION_DELETED = {
            locationID: id
        }
        this.serverProxy.emit(EVENT_NAME.DELETE_LOCATION, event, (reply: any) => {
            console.log(reply)
        });
    }
    private locationDownloaded = async (location: Asset.LocationData) => {
        console.log("Location Downloaded", location);
        await DB.addLocation(location);
        this.add(location);
    }
    private locationDeleted = async (payload: EVENT_TYPE.LOCATION_DELETED) => {
        console.log("Location deleted", payload.locationID);
        this.deleted(payload.locationID);
    }
}

const locationStore = new LocationStore();

export {
    locationStore,
    LocationStore
};