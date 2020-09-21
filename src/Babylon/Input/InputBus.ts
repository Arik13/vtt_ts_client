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
    LEFT_DOWN = 1,
    LEFT_UP = 2,
    LEFT_DOWN_MOVE = 3,
    LEFT_UP_MOVE = 4,
    WHEEL_FORWARDS = 5,
    WHEEL_BACKWARDS = 6,
    DELETE = 7,
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