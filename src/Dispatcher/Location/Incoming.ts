import {locationStore} from "@/Stores/LocationStore";
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

export const locationDownloaded = async (event: EVENT_TYPE.LOCATION_DOWNLOADED) => {
    const locationKeyValue = event.locationKeyValue;
    await DB.addLocation(locationKeyValue);
    locationStore.add(event.locationKeyValue.value);
}

export const locationDeleted = async (payload: EVENT_TYPE.LOCATION_DELETED) => {
    locationStore.deleted(payload.locationID);
}

export const tokenAdded = async (event: EVENT_TYPE.LOCATION_UPDATED_NEW_TOKEN) => {
    const location = locationStore.get(event.locationID);
    const tokenKey = event.tokenKeyValue.key;
    const token = event.tokenKeyValue.value;

    location.tokenIDs.push(tokenKey.tokenID);
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

serverProxy.addHandler(EVENT_NAME.LOCATION_DOWNLOADED, locationDownloaded);
serverProxy.addHandler(EVENT_NAME.LOCATION_DELETED, locationDeleted);
serverProxy.addHandler(EVENT_NAME.LOCATION_UPDATED_NEW_TOKEN, tokenAdded);