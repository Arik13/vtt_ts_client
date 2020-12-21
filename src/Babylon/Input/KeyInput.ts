import {PlanarCamera} from "@/Babylon/Engine/Camera";
import {InputBus, inputBus, INPUT_EVENT, InputEvent} from "./InputBus";
import {KEY} from "./Key";


// enum KEY {
//     W = 87,
//     S = 83,
//     A = 65,
//     D = 68,
//     LEFT = 37,
//     UP = 38,
//     RIGHT = 39,
//     DOWN = 40,
//     DELETE = 46,
// }

export class KeyInput implements BABYLON.ICameraInput<PlanarCamera> {
    inputBus: InputBus;
    camera: PlanarCamera;
    _keys: number[] = [];
    keysUp: KEY[] = [KEY.W, KEY.UP_ARROW];
    keysDown: KEY[] = [KEY.S, KEY.DOWN_ARROW];
    keysLeft: KEY[] = [KEY.A, KEY.LEFT_ARROW];
    keysRight: KEY[] = [KEY.D, KEY.RIGHT_ARROW];
    attached = false;
    noPreventDefault = false;
    constructor(camera: PlanarCamera) {
        this.camera = camera;
        this.inputBus = inputBus;
    }
    setCamera(camera: PlanarCamera) {
        this.camera = camera;
    }
    getSimpleName(): string {
        return "keyboard";
    }
    getTypeName(): string {
        return "FreeCameraKeyboardWalkInput";
    }
    getClassName(): string {
        return "FreeCameraKeyboardWalkInput"
    }
    // detachControl(element: HTMLElement | null): void {
    detachControl(): void {
        if (this.attached) {
            this._keys = [];
        }
        this.camera.getScene().onKeyboardObservable.removeCallback(this.keyCallback);
        this.attached = false;
    }
    keyCallback = (eventData: any, eventState: any) => {
        switch (eventData.type) {
            case 1: {
                this._onKeyDown(eventData.event);
                break;
            }
            case 2: {
                this._onKeyUp(eventData.event);
                break;
            }
        }
    }
    attachControl(noPreventDefault?: boolean): void {
        this.camera.getScene().onKeyboardObservable.add(this.keyCallback);
        this.noPreventDefault = noPreventDefault;
        this.attached = true;
    }
    _onLostFocus(e: FocusEvent) {
        e;
        this._keys = [];
    }
    _onKeyDown = (evt: KeyboardEvent) => {
        if (!this.attached) return;

        // If any of the movement keys were pressed
        if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
            this.keysDown.indexOf(evt.keyCode) !== -1 ||
            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            this.keysRight.indexOf(evt.keyCode) !== -1
            ) {
            const index = this._keys.indexOf(evt.keyCode);

            // Add the key to the queue
            if (index === -1) {
                this._keys.push(evt.keyCode);
            }
            if (!this.noPreventDefault) {
                evt.preventDefault();
            }

        }
        else if (evt.keyCode == KEY.DELETE) inputBus.sendEvent({type: INPUT_EVENT.DELETE});
    }
    _onKeyUp = (evt: KeyboardEvent) => {
        if (!this.attached) return;

        // If a movement key was released
        if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
            this.keysDown.indexOf(evt.keyCode) !== -1 ||
            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            this.keysRight.indexOf(evt.keyCode) !== -1 ||
            evt.keyCode == KEY.DELETE
        ) {
            const index = this._keys.indexOf(evt.keyCode);
            // Clear the key from the queue
            if (index >= 0) {
                this._keys.splice(index, 1);
            }
            if (!this.noPreventDefault) {
                evt.preventDefault();
            }
        }
    }
    checkInputs() {
        if (this.attached) {
            const camera = this.camera;
            for (let i = 0; i < this._keys.length; i++) {
                const keyCode = this._keys[i];
                const xMod = Math.sin(camera.rotation.y);
                const zMod = Math.cos(camera.rotation.y);
                const speed = camera.speed;
                const forward = new BABYLON.Vector3(xMod * speed , 0, zMod * speed);
                const up = new BABYLON.Vector3(0, 1, 0);
                const left = forward.cross(up);

                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    camera.direction.copyFromFloats(left.x, left.y, left.z);
                }
                else if (this.keysUp.indexOf(keyCode) !== -1) {
                    camera.direction.copyFromFloats(forward.x, forward.y, forward.z);
                }
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera.direction.copyFromFloats(-left.x, -left.y, -left.z);
                }
                else if (this.keysDown.indexOf(keyCode) !== -1) {
                    camera.direction.copyFromFloats(-forward.x, -forward.y, -forward.z);
                }
                if (camera.getScene().useRightHandedSystem) {
                    camera.direction.z *= -1;
                }

                camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                BABYLON.Vector3.TransformNormalToRef(camera.direction, camera._cameraTransformMatrix, camera._transformedDirection);
                camera.cameraDirection.addInPlace(camera.direction);
            }
        }
    }
}