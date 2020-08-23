import Vue from 'vue';
import Vuex, { Payload } from 'vuex';
import ax from 'axios';
import {CampaignDBService} from "../DB/IndexedDB";
import io from 'socket.io-client';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
const socket = io('http://localhost:3001');
let DB: CampaignDBService = null;

const axios = ax.create({baseURL: "http://localhost:3000/api/"});
import {imageStore} from "../GameStores/ImageStore";
import {locationStore} from "../GameStores/LocationStore";
import {Asset} from "@shared/Assets/Asset";

type AuthData = {
    token: string;
    userID: string;
}

Vue.use(Vuex);

function arrayBufferToString(buffer: ArrayBuffer){
    const arr = new Uint8Array(buffer);
    // @ts-ignore
    const str = String.fromCharCode(...arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}

socket.on(EVENT_NAME.DOWNLOAD_IMAGE, async (payload: any) => {
    const imageDataBinary: ArrayBuffer = payload.pop();
    const imageData: Asset.ImageInfo = JSON.parse(arrayBufferToString(imageDataBinary));
    imageData.fileBuffer = payload[0];
    await DB.addImage(imageData);
    imageStore.addImage(imageData);
})

export default new Vuex.Store({
    state: {
        authData: null,
        authToken: null,
        userID: null,
        isDrawerOpen: true,
        campaignID: null,
        images: [],
        assets: null,
        loaded: false,
    },
    getters: {
        userID: state => {
            return state.userID;
        },
    },
    mutations: {
        toggleDrawerOpen(state) {
            state.isDrawerOpen = !state.isDrawerOpen;
        },
        test(state) {
            console.log("test mutation");
        }
    },
    actions: {
        async loadCampaign({state}, payload) {
            DB = new CampaignDBService(payload.id);
            await DB.open();
            const keys = await DB.getSyncKeys() as EVENT_TYPE.LOAD_CAMPAIGN;
            socket.emit(EVENT_NAME.LOAD_CAMPAIGN, keys, async (reply: any) => {
                /*
                    Socket io can't mix json and binary. Have to convert image meta data to binary to keep
                    the reply binary only. Need to do a bit of shuffling to group things together again.
                */
                const metaBinary: ArrayBuffer = reply.pop();
                const metaData: Asset.AssetSyncGroup = JSON.parse(arrayBufferToString(metaBinary));

                console.log("Sync Data: ", metaData);

                const imageBuffers: ArrayBuffer[] = reply;

                // Sync Images
                const toAdd = [];
                const imageMetaData = metaData.imageData;
                for (let i = 0; i < imageMetaData.toAdd.length; i++) {
                    toAdd.push(imageMetaData.toAdd[i]);
                    toAdd[i].fileBuffer = imageBuffers[i];
                }
                await DB.syncAssets(metaData);
                const assets = await DB.getAssets();

                console.log("Loaded Assets: ", assets);

                imageStore.setImages(assets.imageStore)
                locationStore.setLocations(assets.locationStore)
                payload.callback();
            });
        },
        triggerEvent({state}, payload) {
            console.log("Trigger Event: ", payload);
            state;
            socket.emit(payload.eventName, payload.event, (reply: any) => {
                payload.callback(reply);
            });
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
            state.campaignID = null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("userID");
            localStorage.removeItem("campaignID");
            payload.reroute();
        },
        toggleDrawerOpen({commit}) {
            commit("toggleDrawerOpen");
        },
    }
})
