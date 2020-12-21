import { serverProxy } from '@/Stores/ServerProxy';
import { EVENT_TYPE, EVENT_NAME } from '@shared/Events/Events';
import { campaignStore } from '@/Stores/CampaignStore';

const activeLocationChanged = async (payload: EVENT_TYPE.ACTIVE_LOCATION_UPDATED) => {
    campaignStore.setActiveLocation(payload.locationID);
}
const clientConfigUpdated = async (payload: EVENT_TYPE.CLIENT_CONFIG_UPDATED) => {
    campaignStore.updateClientConfig(payload.clientConfig);
}

serverProxy.addHandler(EVENT_NAME.ACTIVE_LOCATION_UPDATED, activeLocationChanged);
serverProxy.addHandler(EVENT_NAME.CLIENT_CONFIG_UPDATED, clientConfigUpdated);