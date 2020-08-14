import Vue from 'vue';
import Vuex, { Payload } from 'vuex';
import ax from 'axios';
import {CampaignDBService} from "../DB/IndexedDB";
import io from 'socket.io-client';
import {EVENT_NAME, EVENT_TYPE} from "@shared/events/events";
const socket = io('http://localhost:3001');
const axios = ax.create({baseURL: "http://localhost:3000/api/"});
import {imageStore} from "../GameStores/ImageStore";

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

// function blobToFile(theBlob: Blob, fileName:string): File {
//     var b: any = theBlob;
//     //A Blob() is almost a File() - it's just missing the two properties below which we will add
//     b.lastModifiedDate = new Date();
//     b.name = fileName;

//     //Cast to a File() type
//     return <File>theBlob;
// }

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
    },
    actions: {
        async loadCampaign({state}, payload) {
            const DB = new CampaignDBService(payload.id);
            await DB.open();
            const keys = await DB.getSyncKeys() as EVENT_TYPE.LOAD_CAMPAIGN;
            socket.emit(EVENT_NAME.LOAD_CAMPAIGN, keys, async (reply: any) => {
                /*
                    Socket io can't mix json and binary. Have to convert image meta data to binary to keep
                    the reply binary only. Need to do a bit of shuffling to group things together again.
                */
                const metaBinary: ArrayBuffer = reply.pop();
                const metaData = JSON.parse(arrayBufferToString(metaBinary));
                const imageBuffers: ArrayBuffer[] = reply;

                const toAdd = [];
                for (let i = 0; i < metaData.toAdd.length; i++) {
                    toAdd.push(metaData.toAdd[i]);
                    toAdd[i].fileBuffer = imageBuffers[i];
                }

                //
                await DB.sync(toAdd, metaData.toRemove);
                const assets = await DB.getAssets();
                // state.assets = assets;
                // console.log(imageStore);
                imageStore.setImages(assets.assetStore)
                // console.log(imageStore);
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
