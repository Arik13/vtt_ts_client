import {locationStore} from "@/Stores/LocationStore";
import {directoryStore} from "@/Stores/DirectoryStore";
import {tokenStore} from "@/Stores/TokenStore";
import {Subscriber} from "@/Stores/Subscriber";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import {LOCATION_EVENT, LOCATION_EVENT_NAME} from "@/Stores/LocationStore"

// export enum LOCATION_EVENT_NAME {
//     TOKEN_ADDED = "TokenAdded",
// }

// export namespace LOCATION_EVENT_TYPE {
//     export interface LOCATION_EVENT_TYPE {
//         eventName: LOCATION_EVENT_NAME;
//     }
//     export interface TOKEN_ADDED extends LOCATION_EVENT_TYPE {
//         tokenData: Asset.TokenData;
//     }
// }

export const locationDownloaded = async (event: EVENT_TYPE.LOCATION_CREATED) => {
    directoryStore.attachChild(event.directory, event.parentID);
    const locationKeyValue = event.keyValue;
    await DB.addLocation(locationKeyValue);
    locationStore.add(locationKeyValue.value);
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

serverProxy.addHandler(EVENT_NAME.LOCATION_CREATED, locationDownloaded);
serverProxy.addHandler(EVENT_NAME.LOCATION_DELETED, locationDeleted);
serverProxy.addHandler(EVENT_NAME.TOKEN_CREATED, tokenCreated);
serverProxy.addHandler(EVENT_NAME.TOKEN_UPDATED, tokenUpdated);