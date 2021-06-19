import { serverProxy } from "@/Stores/ServerProxy"
import { EVENT_NAME, EVENT_TYPE } from "@shared/Events/Events"

export const undo = () => {
    serverProxy.emit(EVENT_NAME.UNDO, null, reply => {
        console.log(reply);
    });
}
export const redo = () => {
    serverProxy.emit(EVENT_NAME.REDO, null, reply => {
        console.log(reply);
    });
}