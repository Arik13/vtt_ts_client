import { serverProxy } from '@/Stores/ServerProxy';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import { campaignStore } from '@/Stores/CampaignStore';

export const activeLocationChanged = async (payload: EVENT_TYPE.ACTIVE_LOCATION_UPDATED) => {
    campaignStore.setActiveLocation(payload.locationID);
}
export const campaignBindingsUpdated = async (payload: EVENT_TYPE.CAMPAIGN_BINDINGS_UPDATED) => {
    return campaignStore.updateCampaignBindings(payload.campaignBindings);
}

serverProxy.addHandler(EVENT_NAME.ACTIVE_LOCATION_UPDATED, activeLocationChanged);
serverProxy.addHandler(EVENT_NAME.CAMPAIGN_BINDINGS_UPDATED, campaignBindingsUpdated);