import Vue from 'vue';
import Vuex from 'vuex';
import ax from 'axios';
const axios = ax.create({baseURL: "http://localhost:3000/api/"});
// import { RootState } from './types';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

interface AuthData {
    token: string;
    userID: string;
}

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        authData: null,
        authToken: null,
        userID: null,
        isDrawerOpen: true,
        // campaignObject: null,
        campaignID: null,
    },
    getters: {
        userID: state => {
            return state.userID;
        },
    },
    mutations: {
        toggleDrawerOpen(state) {
            state.isDrawerOpen = !state.isDrawerOpen;
        }
    },
    actions: {
        triggerEvent({state}, payload) {
            state;
            socket.emit(payload.eventType, payload.event);
            // socket.send(payload);
        },
        accessResource({state}, payload) {
            const finalPayload = {
                method: payload.method,
                url: payload.route,
                data: payload.data,
                headers: {Authorization: "Bearer " + state.authToken}
            }
            // Concatenate headers
            Object.assign(finalPayload.headers, payload.headers);
            axios(finalPayload)
                .then(res => {
                    if (payload.callback) {
                        payload.callback(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        login({dispatch, state}, payload) {
            payload.method = "PUT";
            payload.route = "/users";
            payload.callback = (data: AuthData) => {
                state.authToken = data.token;
                state.userID = data.userID;
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userID", data.userID);
                payload.reroute();
            }
            dispatch("accessResource", payload);
        },
        logout({state}, payload) {
            state.authToken = null;
            state.userID = null;
            // state.campaignObject = null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("userID");
            // localStorage.removeItem("campaignObject");
            payload.reroute();
        },
        toggleDrawerOpen({commit}) {
            commit("toggleDrawerOpen");
        },
    }
})
