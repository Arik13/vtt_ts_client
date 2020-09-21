import Vue from 'vue';
import Vuex from 'vuex';
import ax from 'axios';
import { ACTION_ARG } from './actions';
import {serverProxy} from "@/Stores/ServerProxy";

Vue.use(Vuex);

type AuthData = {
    token: string;
    userID: string;
}

const axios = ax.create({baseURL: "http://localhost:3000/api/"});

// STORE
export default new Vuex.Store({
    state: {
        authData: null as AuthData,
        authToken: null,
        userID: null,
        isLoggedIn: false,
        campaignID: null,
        loaded: false,
    },
    getters: {
        userID: state => {
            return state.userID;
        },
    },
    actions: {
        // Emits the given event to the server
        triggerEvent({state}, payload: ACTION_ARG.TRIGGER_EVENT) {
            state;
            serverProxy.emit(payload.eventName, payload.event, (reply: void) => {
                payload.callback(reply);
            });
        },

        // Sends a http request to the server
        async accessResource({state}, payload) {
            const finalPayload = {
                method: payload.method,
                url: payload.route,
                data: payload.data,
                headers: {Authorization: "Bearer " + state.authToken}
            }
            // Copy user headers into payload
            Object.assign(finalPayload.headers, payload.headers);

            // Send http request then call callback
            const res = await axios(finalPayload)
            if (payload.callback) {
                payload.callback(res.data);
            }
        },

        // // Sends a login request, then stores the auth data in local storage and vuex state
        // login({dispatch, state}, payload: ACTION_ARG.LOGIN) {
        //     const httpRequest: ACTION_ARG.ACCESS_RESOURCE = {
        //         ...payload,
        //         method: "PUT",
        //         route: "/users",
        //         callback: (data: AuthData) => {
        //             state.authToken = data.token;
        //             state.userID = data.userID;
        //             localStorage.setItem("authToken", data.token);
        //             localStorage.setItem("userID", data.userID);
        //             payload.callback();
        //         }
        //     };
        //     dispatch(ACTION.ACCESS_RESOURCE, httpRequest);
        // },

        // // Sends a logout request, then removes the auth data from local storage and vuex state
        // logout({state}, payload: ACTION_ARG.LOGOUT) {
        //     state.authToken = null;
        //     state.userID = null;
        //     state.campaignID = null;
        //     localStorage.removeItem("authToken");
        //     localStorage.removeItem("userID");
        //     payload.callback();
        // },
    }
})
