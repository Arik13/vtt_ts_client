import io from 'socket.io-client';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {CHAT_EVENT_NAME} from "@shared/Chat/Names";
import {DIRECTORY_EVENT_NAME} from "@shared/Directories/Directory";
import ax from 'axios';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type EventHandler = (payload: any) => void;
type EventName = EVENT_NAME | CHAT_EVENT_NAME | DIRECTORY_EVENT_NAME;

export class ServerProxy {
    socket = io('http://localhost:3001');
    axios = ax.create({baseURL: "http://localhost:3000/api/"});
    handlerMap: Map<EventName, EventHandler> = new Map();
    // Handlers for events coming from server
    // TODO: refactor into a server proxy object
    async emit(eventName: EventName, event: EVENT_TYPE.EVENT_TYPE, callback: EventHandler) {
        this.socket.emit(eventName, event, callback);
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
    addHandler(eventName: EventName, handle: EventHandler) {
        this.handlerMap.set(eventName, handle);
        this.socket.on(eventName, handle);
    }
}

const serverProxy = new ServerProxy();
export {serverProxy}