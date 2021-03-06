import io from 'socket.io-client';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {CHAT_EVENT_NAME} from "@shared/Chat/Names";
import { GAME_EVENT_NAME } from '@shared/Game/Names';
import {DIRECTORY_EVENT_NAME} from "@shared/Directories/Directory";
import ax, { AxiosRequestConfig, Method } from 'axios';
import { userStore } from './UserStore';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type EventHandler = (payload: any) => void;
type EventName = EVENT_NAME | CHAT_EVENT_NAME | DIRECTORY_EVENT_NAME | GAME_EVENT_NAME;

export const serverURL = (process.env.NODE_ENV == "development")? "http://localhost:3000": "https://api.rollhub.org";
// export const serverURL = "http://localhost";
// export const port = ":3000";
// export const serverURL = "https://api.rollhub.org";
// export const port = "";

interface Request {
    method: Method;
    route: string;
    data: any;
    headers?: any;
}

export class ServerProxy {
    // socket = io(`${serverURL}${port}${socketRoute}`, {secure: true});
    socket = io(serverURL);
    axios = ax.create({baseURL: serverURL});
    handlerMap: Map<EventName, EventHandler> = new Map();
    // Handlers for events coming from server
    // TODO: refactor into a server proxy object
    async emit(eventName: EventName, event: EVENT_TYPE.EVENT_TYPE, callback?: EventHandler) {
        console.info(`Emitting ${eventName} event: `, event);
        return new Promise<void>(resolve => {
            this.socket.emit(eventName, event, (payload: any) => {
                if (callback) {
                    callback(payload);
                }
                resolve(payload);
            });
        });
    }
    // async get() {

    // }
    // async update() {

    // }
    // async post() {

    // }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    async put(route: string, payload: any) {
        return this.axios.put(route, payload);
    }
    async request(payload: Request, callback?: any) {
        const finalPayload = {
            method: payload.method,
            url: payload.route,
            data: payload.data,
            headers: {Authorization: "Bearer " + userStore.authToken}
        }

        // Copy user headers into payload
        Object.assign(finalPayload.headers, payload.headers);
        console.info(`Sending ${finalPayload.method} request to ${finalPayload.url}: `, finalPayload);

        // Send http request then call callback
        const res = await this.axios(finalPayload);
        if (callback) {
            callback(res.data);
        }
        else {
            return res.data;
        }
    }
    async requestNoAuth(payload: any, callback: any) {
        const finalPayload = {
            method: payload.method,
            url: payload.route,
            data: payload.data,
        }
        console.info(`Sending ${finalPayload.method} request to ${finalPayload.url}: `, finalPayload);
        const res = await this.axios(finalPayload)
        if (callback) {
            callback(res);
        }
    }
    addHandler(eventName: EventName, handle: EventHandler) {
        this.handlerMap.set(eventName, handle);
        this.socket.on(eventName, (payload: any) => {
            console.info(`Received ${eventName} event`, payload);
            handle(payload)
        });
    }
}

const serverProxy = new ServerProxy();
export {serverProxy}