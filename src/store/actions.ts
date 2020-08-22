export enum ACTION {
    LOAD_CAMPAIGN = "loadCampaign",
    TRIGGER_EVENT = "triggerEvent",
    ACCESS_RESOURCE = "accessResource",
    LOGIN = "login",
    LOGOUT = "logout",
    TOGGLE_DRAWER_OPEN = "toggleDrawerOpen",
}

// {
//     method: "GET",
//     route: `users/${this.$store.state.userID}/campaigns`,
//     callback: (result: CampaignData[]) => {
//         this.campaigns = result;
//     }
// }

import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";

export namespace ACTION_ARG {
    export type TRIGGER_EVENT = {
        eventName: EVENT_NAME;
        event: EVENT_TYPE.EVENT_TYPE;
        callback: (res: any) => void;
    }

    export type ACCESS_RESOURCE = {
        method: string;
        route: string;
        callback: (result: any) => void;
    }
}

// export const ACTION_ARG_TYPES = {
//     LOAD_CAMPAIGN_ARGS: LOAD_CAMPAIGN_ARGS,
// }