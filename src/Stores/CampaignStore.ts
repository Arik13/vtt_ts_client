/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

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
    constructor(campaignID: string, name: string, activeLocationID: string) {
        this.activeLocationID = activeLocationID;
        this.campaignID = campaignID;
        this.name = name;
    }
    addSubscriber(subscriber: Subscriber) {
        this.subscribers.push(subscriber);
    }
    setActiveLocation(locationID: string) {
        if (locationID == this.activeLocationID) return;
        this.activeLocationID = locationID;
        this.subscribers.forEach((subscriber: Subscriber) => {
            subscriber.updated(locationID, CAMPAIGN_EVENT.ACTIVE_LOCATION_UPDATED);
        })
    }
}

let campaignStore: CampaignStore = null;

const initCampaignStore = (
    campaignID: string,
    name: string,
    activeLocationID: string,
) => {
    campaignStore = new CampaignStore(
        campaignID,
        name,
        activeLocationID,
    );
    return campaignStore;
}

export {
    campaignStore,
    initCampaignStore,
}