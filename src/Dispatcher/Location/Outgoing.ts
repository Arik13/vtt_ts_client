import {Asset} from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";

export const createLocation = (location: Asset.LocationData) => {
    if (!location.tokenIDs) {
        location.tokenIDs = [];
    }
    const event: EVENT_TYPE.CREATE_LOCATION = {
        location: location,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.CREATE_LOCATION, event, (reply: any) => {
        if (reply.success) {
            console.log("Location Created");
        }
    });
}
export const addToken = (locationID: string, token: Asset.TokenData) => {
    const event: EVENT_TYPE.CREATE_TOKEN = {
        locationID: locationID,
        token: token,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.CREATE_TOKEN, event, (reply: any) => {
        console.log(reply)
    });
}
export const deleteLocation = async(id: string) => {
    locationStore.deleted(id);
    await DB.deleteImage(id);
    const event: EVENT_TYPE.LOCATION_DELETED = {
        locationID: id
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_LOCATION, event, (reply: any) => {
        console.log(reply)
    });
}