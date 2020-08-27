class CampaignData {
    campaignID: string;
    constructor(campaignID: string) {
        this.campaignID = campaignID;
    }
}

let campaignData: CampaignData = null;

const createCampaignData = (
    campaignID: string
) => {
    campaignData = new CampaignData(
        campaignID
    );
    return campaignData;
}

export {
    campaignData,
    createCampaignData,
}