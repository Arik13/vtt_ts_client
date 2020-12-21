/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

import * as Asset from "@shared/Assets/Asset";
import {Subscriber} from "./Subscriber";

export enum CAMPAIGN_EVENT {
    ACTIVE_LOCATION_UPDATED = "ActiveLocationUpdated",
}
export interface CampaignSubscriber extends Subscriber {
    updated?(id: string, eventName: CAMPAIGN_EVENT): void;
}

class CampaignStore {
    campaignID: string;
    name: string;
    subscribers: Subscriber[] = [];
    activeLocationID: string;
    INITIALIZED = "INITIALIZED";
    REMOVED = "REMOVED";
    clientConfig: Asset.ClientConfig.Data;
    constructor() {
        this.activeLocationID = null;
        this.campaignID = null;
        this.name = null;
        this.clientConfig = null;
    }
    subscribe(subscriber: Subscriber) {
        this.subscribers.push(subscriber);
    }
    setActiveLocation(locationID: string) {
        if (locationID == this.activeLocationID) return;
        this.activeLocationID = locationID;
        this.subscribers.forEach((subscriber: Subscriber) => {
            subscriber.updated(locationID, CAMPAIGN_EVENT.ACTIVE_LOCATION_UPDATED);
        })
    }
    setCampaign(campaignID: string, name: string, activeLocationID: string, clientConfig: Asset.ClientConfig.Data) {
        this.activeLocationID = activeLocationID;
        this.campaignID = campaignID;
        this.name = name;
        this.clientConfig = clientConfig;
        this.subscribers.forEach((subscriber: Subscriber) => {
            subscriber.notify(this.INITIALIZED, null);
        });
    }
    reset() {
        this.campaignID = null;
        this.name = null;
        this.activeLocationID = null;
        this.clientConfig = null;
        this.subscribers.forEach((subscriber: Subscriber) => {
            subscriber.notify(this.REMOVED, null);
        });
    }
    updateClientConfig(clientConfig: Asset.ClientConfig.Data) {
        this.clientConfig = clientConfig;
    }
}

const campaignStore: CampaignStore = new CampaignStore();

// const initCampaignStore = (
//     campaignID: string,
//     name: string,
//     activeLocationID: string,
// ) => {
//     campaignStore = new CampaignStore(
//         campaignID,
//         name,
//         activeLocationID,
//     );
//     return campaignStore;
// }

export {
    campaignStore,
    // initCampaignStore,
}