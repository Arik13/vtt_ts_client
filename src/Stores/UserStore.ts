/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

import { serverProxy, ServerProxy } from './ServerProxy';
import {Subscriber} from "./Subscriber";

export enum CAMPAIGN_EVENT {
    ACTIVE_LOCATION_UPDATED = "ActiveLocationUpdated",
}

export interface CampaignSubscriber extends Subscriber {
    updated?(id: string, eventName: CAMPAIGN_EVENT): void;
}

type AuthData = {
    token: string;
    userID: string;
}
// const userStore = null;

let userStore: UserStore = null;

class UserStore {
    userID: string;
    username: string;
    authToken: AuthData;
    subscribers: Subscriber[] = [];
    serverProxy: ServerProxy = serverProxy;
    constructor(userID: string, authToken: AuthData, username: string) {
        this.userID = userID;
        this.username = username;
        this.authToken = authToken;
    }
    addSubscriber(subscriber: Subscriber) {
        this.subscribers.push(subscriber);
    }
    static isLoggedIn() {
        return (userStore && userStore.authToken);
    }
    logout() {
        this.userID = null;
        this.username = null;
        this.authToken = null;
    }
}
export const initUserStore = (userID: string, authToken: AuthData, username: string) => {
    userStore = new UserStore(userID, authToken, username);
}

export {
    userStore,
    UserStore,
}