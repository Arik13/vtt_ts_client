export interface InputReciever {
    recieveEvent(evt: InputEvent): void;
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
}

export class InputBus {
    recievers: InputReciever[] = [];
    registerReciever(reciever: InputReciever) {
        this.recievers.push(reciever);
    }
    sendEvent(evt: InputEvent) {
        for (const key in this.recievers) {
            this.recievers[key].recieveEvent(evt);
        }
    }

}

const inputBus = new InputBus();

export {inputBus};