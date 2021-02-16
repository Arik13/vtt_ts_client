import * as Asset from "@shared/Assets/Asset";
import {Location} from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import { directoryStore } from '@/Stores/DirectoryStore';
import {locationCreated} from "./Incoming";

export const createLocation = async (location: Location.Data, parentID: string) => {
    if (!location.tokenIDs) {
        location.tokenIDs = [];
    }
    const event: EVENT_TYPE.CREATE_LOCATION = {
        location,
        parentID,
    }
    return new Promise<Asset.Location.Data>((resolve, reject) => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        serverProxy.emit(EVENT_NAME.CREATE_LOCATION, event, (payload: any) => {
            payload.success? resolve(locationCreated(payload.event)) : reject(null);
        });
    });
}
export const createToken = (locationID: string, token: Asset.Token.Data) => {
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
export const deleteToken = async(tokenID: string, locationID: string) => {
    // locationStore.deleted(id);
    const event: EVENT_TYPE.DELETE_TOKEN = {
        tokenID,
        locationID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    serverProxy.emit(EVENT_NAME.DELETE_TOKEN, event, (reply: any) => {});
}