/*
    Actions in the VueX store have no type safety. By always declaring the payload passed to dispatch
    as an ACTION_ARG, some modicum of type safety is assured.
*/

import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";

export enum ACTION {
    LOAD_CAMPAIGN = "loadCampaign",
    TRIGGER_EVENT = "triggerEvent",
    ACCESS_RESOURCE = "accessResource",
    LOGIN = "login",
    LOGOUT = "logout",
    RECONNECT = "reconnect",
}

export namespace ACTION_ARG {
    export type TRIGGER_EVENT = {
        eventName: EVENT_NAME;
        event: EVENT_TYPE.EVENT_TYPE;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        callback: (res: any) => void;
    }

    export type ACCESS_RESOURCE = {
        method: string;
        route: string;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        data?: any;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        callback: (result: any) => void;
    }

    export type LOGIN = {
        data: {
            email: string;
            password: string;
        };
        callback: () => void;
    }
    export type LOGOUT = {
        callback: () => void;
    }

    export type RECONNECT = {
        callback: () => void;
    }
}