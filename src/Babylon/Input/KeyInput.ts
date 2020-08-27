import {PlanarCamera} from "@/Babylon/Engine/Camera"

enum KEY {
    W = 87,
    S = 83,
    A = 65,
    D = 68,
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39,
}

export class KeyInput implements BABYLON.ICameraInput<PlanarCamera> {
    camera: PlanarCamera;
    _keys: number[] = [];
    keysUp: KEY[] = [KEY.W, KEY.UP];
    keysDown: KEY[] = [KEY.S, KEY.DOWN];
    keysLeft: KEY[] = [KEY.A, KEY.LEFT];
    keysRight: KEY[] = [KEY.D, KEY.RIGHT];
    attached = false;
    noPreventDefault = false;
    constructor(camera: PlanarCamera) {
        this.camera = camera;
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
    _onLostFocus(e: FocusEvent) {
        this._keys = [];
    }
    detachControl(element: HTMLElement | null): void {
        if (this.attached) {
            element.removeEventListener("keydown", this._onKeyDown);
            element.removeEventListener("keyup", this._onKeyUp);
            // BABYLON.Tools.UnregisterTopRootEvents(
            //     // element.ownerDocument.defaultView,
            //     null,
            //     [
            //         { name: "blur", handler: this._onLostFocus }
            //     ]
            // );
            this._keys = [];
        }
        this.attached = false;
    }
    attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
        if (!this.attached) {
            element.tabIndex = 1;
            element.addEventListener("keydown", this._onKeyDown, false);
            element.addEventListener("keyup", this._onKeyUp, false);
        }
        this.noPreventDefault = noPreventDefault;
        this.attached = true;
    }
    _onKeyDown = (evt: KeyboardEvent) => {
        if (!this.attached) return;

        // If any of the movement keys were pressed
        if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
            this.keysDown.indexOf(evt.keyCode) !== -1 ||
            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            this.keysRight.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            // Add the key to the queue
            if (index === -1) {
                this._keys.push(evt.keyCode);
            }
            if (!this.noPreventDefault) {
                evt.preventDefault();
            }
        }
    }
    _onKeyUp = (evt: KeyboardEvent) => {

        if (!this.attached) return;
        // If a movement key was pressed
        if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
            this.keysDown.indexOf(evt.keyCode) !== -1 ||
            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            this.keysRight.indexOf(evt.keyCode) !== -1) {
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