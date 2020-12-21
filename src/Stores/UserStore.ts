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

export type AuthData = {
    token: string;
    userID: string;
}
// const userStore = null;



class UserStore {
    userID: string;
    username: string;
    authToken: AuthData;
    isLoggedIn: boolean;
    subscribers: Subscriber[] = [];
    serverProxy: ServerProxy = serverProxy;
    LOGGED_IN: "loggedIn"
    LOGGED_OUT: "loggedOut"
    constructor() {
        this.userID = null;
        this.username = null;
        this.authToken = null;
        this.isLoggedIn = false;
    }
    subscribe(subscriber: Subscriber) {
        this.subscribers.push(subscriber);
    }
    // static isLoggedIn() {
    //     return !!(userStore && userStore.authToken);
    // }
    loginUser(userID: string, authToken: AuthData, username: string) {
        this.userID = userID;
        this.username = username;
        this.authToken = authToken;
        this.isLoggedIn = true;
        this.subscribers.forEach((subscriber: Subscriber) => {
            subscriber.notify(this.LOGGED_IN, null)
        })
    }
    logoutUser() {
        this.userID = null;
        this.username = null;
        this.authToken = null;
        this.isLoggedIn = false;
        this.subscribers.forEach((subscriber: Subscriber) => {
            subscriber.notify(this.LOGGED_OUT, null)
        })
    }
}

const userStore: UserStore = new UserStore();
// export const initUserStore = (userID: string, authToken: AuthData, username: string) => {
//     userStore = new UserStore(userID, authToken, username);
// }


export {
    userStore,
    UserStore,
}