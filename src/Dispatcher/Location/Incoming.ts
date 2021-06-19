import {locationStore} from "@/Stores/LocationStore";
import {directoryStore} from "@/Stores/DirectoryStore";
import {tokenStore} from "@/Stores/TokenStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";

export const locationCreated = async (event: EVENT_TYPE.LOCATION_CREATED) => {
    await DB.addLocation(event.keyValue);
    directoryStore.add(event.directory);
    return locationStore.add(event.keyValue.value);
}

export const locationDeleted = async (payload: EVENT_TYPE.LOCATION_DELETED) => {
    await DB.deleteLocation(payload.locationID);
    directoryStore.delete(payload.directoryID);
    locationStore.deleted(payload.locationID);
}

export const tokenCreated = async (event: EVENT_TYPE.TOKEN_CREATED) => {
    const location = locationStore.get(event.locationID);
    const tokenKey = event.keyValue.key;
    const token = event.keyValue.value;

    location.tokenIDs.push(tokenKey.id);
    tokenStore.add(token);
}
export const tokenUpdated = async (event: EVENT_TYPE.TOKEN_UPDATED) => {
    tokenStore.update(event.token);
}
export const tokenDeleted = async (event: EVENT_TYPE.TOKEN_DELETED) => {
    locationStore.removeToken(event.locationID, event.tokenID);
    tokenStore.deleted(event.tokenID);
    await DB.deleteToken(event.tokenID);
}

serverProxy.addHandler(EVENT_NAME.LOCATION_CREATED, locationCreated);
serverProxy.addHandler(EVENT_NAME.LOCATION_DELETED, locationDeleted);
serverProxy.addHandler(EVENT_NAME.TOKEN_CREATED, tokenCreated);
serverProxy.addHandler(EVENT_NAME.TOKEN_UPDATED, tokenUpdated);
serverProxy.addHandler(EVENT_NAME.TOKEN_DELETED, tokenDeleted);