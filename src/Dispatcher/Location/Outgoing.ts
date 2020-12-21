import * as Asset from "@shared/Assets/Asset";
import {Location} from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { directoryStore } from '@/Stores/DirectoryStore';

export const createLocation = (location: Location.Data, parentID: string) => {
    if (!location.tokenIDs) {
        location.tokenIDs = [];
    }
    const event: EVENT_TYPE.CREATE_LOCATION = {
        location,
        parentID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.CREATE_LOCATION, event, (reply: any) => {});
}
export const addToken = (locationID: string, token: Asset.Token.Data) => {
    const event: EVENT_TYPE.CREATE_TOKEN = {
        locationID: locationID,
        token: token,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.CREATE_TOKEN, event, (reply: any) => {});
}
export const updateToken = (locationID: string, token: Asset.Token.Data) => {
    const event: EVENT_TYPE.UPDATE_TOKEN = {
        locationID: locationID,
        token: token,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.UPDATE_TOKEN, event, (reply: any) => {});
}
export const deleteLocation = async(id: string, dirID: string) => {
    // locationStore.deleted(id);
    const event: EVENT_TYPE.DELETE_LOCATION = {
        locationID: id,
        directoryID: dirID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_LOCATION, event, (reply: any) => {});
}