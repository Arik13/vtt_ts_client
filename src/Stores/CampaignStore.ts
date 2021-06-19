/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

import { CampaignDBService, DB } from "@/DB/IndexedDB";
import * as Asset from "@shared/Assets/Asset";
import { eventBus, CLIENT_EVENT } from "./EventBus";

class CampaignStore {
    campaignID: string;
    name: string;
    activeLocationID: string;
    selectedTokenID: string;
    bindings: Asset.CampaignBindings.Data;
    constructor() {
        this.activeLocationID = null;
        this.campaignID = null;
        this.name = null;
        this.bindings = null;
    }
    setActiveLocation(locationID: string) {
        if (locationID == this.activeLocationID) return;
        this.activeLocationID = locationID;
        eventBus.dispatch(CLIENT_EVENT.ACTIVE_LOCATION_UPDATED, locationID);
    }
    setCampaign(campaignID: string, name: string, activeLocationID: string, campaignBindings: Asset.CampaignBindings.Data) {
        this.setActiveLocation(activeLocationID);
        this.campaignID = campaignID;
        this.name = name;
        this.bindings = campaignBindings;
        eventBus.dispatch(CLIENT_EVENT.INIT_NEW_CAMPAIGN);
    }
    async reset() {
        await CampaignDBService.deleteDB(this.campaignID);
        this.campaignID = null;
        this.name = null;
        this.activeLocationID = null;
        this.bindings = null;
        eventBus.dispatch(CLIENT_EVENT.CAMPAIGN_DELETED);
    }
    updateCampaignBindings(campaignBindings: Asset.CampaignBindings.Data) {
        this.bindings = campaignBindings;
        return this.bindings;
    }
    setSelectedToken(tokenID: string) {
        if (tokenID == this.selectedTokenID) return;
        this.selectedTokenID = tokenID;
        eventBus.dispatch(CLIENT_EVENT.SELECTED_TOKEN_UPDATED, tokenID);
    }
}

const campaignStore: CampaignStore = new CampaignStore();

export {
    campaignStore,
}