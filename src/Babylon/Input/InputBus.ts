/*
    The input managers
*/

export interface InputReceiver {
    receiveEvent(evt: InputEvent): void;
}
export interface InputEvent {
    type: INPUT_EVENT;
}

export interface PickEvent extends InputEvent {
    pick: BABYLON.AbstractMesh;
}

export enum INPUT_EVENT {
    FALSEY,
    LEFT_DOWN,
    LEFT_UP,
    LEFT_DOWN_MOVE,
    LEFT_UP_MOVE,
    ALL_UP_MOVE,
    WHEEL_FORWARDS,
    WHEEL_BACKWARDS,
    DELETE,
}

export class InputBus {
    receivers: InputReceiver[] = [];
    registerReceiver(receiver: InputReceiver) {
        this.receivers.push(receiver);
    }
    sendEvent(evt: InputEvent) {
        for (const key in this.receivers) {
            this.receivers[key].receiveEvent(evt);
        }
    }

}

const inputBus = new InputBus();

export {inputBus};