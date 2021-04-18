/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

import { CLIENT_EVENT, eventBus } from './EventBus';
import { serverProxy, ServerProxy } from './ServerProxy';

export type AuthData = {
    token: string;
    userID: string;
}

class UserStore {
    userID: string;
    username: string;
    authToken: AuthData;
    isLoggedIn: boolean;
    serverProxy: ServerProxy = serverProxy;
    constructor() {
        this.userID = null;
        this.username = null;
        this.authToken = null;
        this.isLoggedIn = false;
    }
    loginUser(userID: string, authToken: AuthData, username: string) {
        this.userID = userID;
        this.username = username;
        this.authToken = authToken;
        this.isLoggedIn = true;
        eventBus.dispatch(CLIENT_EVENT.LOGGED_IN);
    }
    logoutUser() {
        this.userID = null;
        this.username = null;
        this.authToken = null;
        this.isLoggedIn = false;
        eventBus.dispatch(CLIENT_EVENT.LOGGED_OUT);
    }
}

const userStore: UserStore = new UserStore();

export {
    userStore,
    UserStore,
}