import io from 'socket.io-client';
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
// import {arrayBufferToString} from "@/Util/arrayBufferToString";
// import {imageStore} from "../GameStores/ImageStore";
// import {locationStore} from "../GameStores/LocationStore";
// import {Asset} from "@shared/Assets/Asset";
// import {ClientSocketHandler, clientSocketHandlers} from "./ClientSocketHandlers/ClientSocketHandler";

export class ServerProxy {
    socket = io('http://localhost:3001');
    handlers: {eventName: EVENT_NAME; handle: (payload: any) => void}[] = [];
    // Handlers for events coming from server
    // TODO: refactor into a server proxy object
    constructor() {
        // this.socketHandlers = clientSocketHandlers;
        // for (let i = 0; i < this.socketHandlers.length; i++) {
        //     let socketHandler = this.socketHandlers[i];
        //     this.socket.on(socketHandler.eventName, (payload: any) => {
        //         socketHandler.handle(payload);
        //     })
        // }
    }
    emit(eventName: EVENT_NAME, event: EVENT_TYPE.EVENT_TYPE, callback: (reply: any) => void) {
        this.socket.emit(eventName, event, callback);
    }
    addHandler(eventName: EVENT_NAME, handle: (payload: any) => void) {
        this.handlers.push({
            eventName,
            handle
        })
        this.socket.on(eventName, handle);
    }
}

const serverProxy = new ServerProxy();
export {serverProxy}