import Vue from 'vue';
import Vuex, { Payload } from 'vuex';
import ax from 'axios';
import {CampaignDBService, createCampaignDBService, DB} from "../DB/IndexedDB";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {imageStore} from "../GameStores/ImageStore";
import {locationStore} from "../GameStores/LocationStore";
import {Asset} from "@shared/Assets/Asset";
import { ACTION_ARG, ACTION } from './actions';
import { ServerProxy } from '@/GameStores/ServerProxy';
import {arrayBufferToString} from "@/Util/arrayBufferToString";
import {createCampaignData} from "@/GameStores/CampaignData";

Vue.use(Vuex);

type AuthData = {
    token: string;
    userID: string;
}

const axios = ax.create({baseURL: "http://localhost:3000/api/"});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import {serverProxy} from "@/GameStores/ServerProxy"
// let serverProxy = new ServerProxy();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// STORE
export default new Vuex.Store({
    state: {
        authData: null as AuthData,
        authToken: null,
        userID: null,
        campaignID: null,
        loaded: false,
    },
    getters: {
        userID: state => {
            return state.userID;
        },
    },
    // Actions are asynchronous, and are called by vue objects using their dispatch method
    actions: {
        async loadCampaign({state}, payload) {
            createCampaignData(payload.id);
            await createCampaignDBService(payload.id);
            const keys = await DB.getSyncKeys() as EVENT_TYPE.LOAD_CAMPAIGN;
            serverProxy.emit(EVENT_NAME.LOAD_CAMPAIGN, keys, async (reply: ArrayBuffer[]) => {
                // Server replies with all uncached campaign assets. However, socket io can't mix json and binary in a single emit.
                // Therefore, the accompanying json data has to be encoded as binary to be sent in a single reply.
                // The json data will always be the last element in the array buffer. Need to convert it from binary first to use.
                const metaBinary: ArrayBuffer = reply.pop();
                const metaData: Asset.AssetSyncGroup = JSON.parse(arrayBufferToString(metaBinary));

                const imageBuffers: ArrayBuffer[] = reply;

                // Image data and buffer were decoupled for transmission. Need to reattach them so they can be put in the db together.
                const imageMetaData = metaData.imageData;
                for (let i = 0; i < imageMetaData.toAdd.length; i++) {
                    imageMetaData.toAdd[i].fileBuffer = imageBuffers[i];
                }

                // Sync assets from server with front end db
                await DB.syncAssets(metaData);

                const assets = await DB.getAssets();

                // Add assets to asset stores for fast recall
                imageStore.setAll(assets.imageStore);
                locationStore.setAll(assets.locationStore);

                // Notify load requester that loading is complete
                payload.callback();
            });
        },

        // Emits the given event to the server
        triggerEvent({state}, payload: ACTION_ARG.TRIGGER_EVENT) {
            console.log(payload);
            state;
            serverProxy.emit(payload.eventName, payload.event, (reply: any) => {
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

        // Sends a login request, then stores the auth data in local storage and vuex state
        login({dispatch, state}, payload: ACTION_ARG.LOGIN) {
            const httpRequest: ACTION_ARG.ACCESS_RESOURCE = {
                ...payload,
                method: "PUT",
                route: "/users",
                callback: (data: AuthData) => {
                    state.authToken = data.token;
                    state.userID = data.userID;
                    localStorage.setItem("authToken", data.token);
                    localStorage.setItem("userID", data.userID);
                    payload.callback();
                }
            };
            dispatch(ACTION.ACCESS_RESOURCE, httpRequest);
        },

        // Sends a logout request, then removes the auth data from local storage and vuex state
        logout({state}, payload: ACTION_ARG.LOGOUT) {
            state.authToken = null;
            state.userID = null;
            state.campaignID = null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("userID");
            payload.callback();
        },
    }
})
