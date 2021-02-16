import {locationStore} from "@/Stores/LocationStore";
import {directoryStore} from "@/Stores/DirectoryStore";
import {tokenStore} from "@/Stores/TokenStore";
import {Subscriber} from "@/Stores/Subscriber";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import {LOCATION_EVENT, LOCATION_EVENT_NAME} from "@/Stores/LocationStore"

export const locationCreated = async (event: EVENT_TYPE.LOCATION_CREATED) => {
    directoryStore.attachChild(event.directory, event.parentID);
    const locationKeyValue = event.keyValue;
    await DB.addLocation(locationKeyValue);
    return locationStore.add(locationKeyValue.value);
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

    const locationEvent: LOCATION_EVENT.TokenAddedEvent = {
        eventName: LOCATION_EVENT_NAME.TOKEN_ADDED,
        tokenData: token,
    }

    locationStore.subscribers.forEach((subscriber: Subscriber) => {
        if (subscriber.updated) {
            subscriber.updated(event.locationID, locationEvent);
        }
    });
}
export const tokenUpdated = async (event: EVENT_TYPE.TOKEN_UPDATED) => {
    const locationEvent: LOCATION_EVENT.TokenUpdatedEvent = {
        eventName: LOCATION_EVENT_NAME.TOKEN_UPDATED,
        tokenData: event.token,
    }

    locationStore.subscribers.forEach((subscriber: Subscriber) => {
        if (subscriber.updated) {
            subscriber.updated(event.locationID, locationEvent);
        }
    });
}
export const tokenDeleted = async (event: EVENT_TYPE.TOKEN_DELETED) => {
    const locationEvent: LOCATION_EVENT.TokenDeleteEvent = {
        eventName: LOCATION_EVENT_NAME.TOKEN_DELETED,
        tokenID: event.tokenID,
    }

    locationStore.deleted(event.tokenID);
    await DB.deleteToken(event.tokenID);

    locationStore.subscribers.forEach((subscriber: Subscriber) => {
        if (subscriber.updated) {
            subscriber.updated(event.locationID, locationEvent);
        }
    });
}

serverProxy.addHandler(EVENT_NAME.LOCATION_CREATED, locationCreated);
serverProxy.addHandler(EVENT_NAME.LOCATION_DELETED, locationDeleted);
serverProxy.addHandler(EVENT_NAME.TOKEN_CREATED, tokenCreated);
serverProxy.addHandler(EVENT_NAME.TOKEN_UPDATED, tokenUpdated);
serverProxy.addHandler(EVENT_NAME.TOKEN_DELETED, tokenDeleted);