import {InputBus, inputBus, INPUT_EVENT} from "./InputBus";
import {PlanarCamera} from "@/Babylon/Engine/Camera";

enum MOUSE_BUTTON {
    NONE = -1,
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
}

const MOUSE_STATE = {
    LEFT: false,
    MIDDLE: false,
    RIGHT: false,
    MOVING: false,
}

export class MouseInput implements BABYLON.ICameraInput<PlanarCamera> {
    inputBus: InputBus;
    isAttached = false;
    noPreventDefault = false;
    camera: PlanarCamera;
    touchEnabled: boolean;
    buttonsPressed: number[] = [];
    angularSensibility: number;
    restrictionX: number;
    restrictionY: number;
    previousPosition: {x: number; y: number};
    pickPlane: BABYLON.Mesh
    pickedMesh: BABYLON.AbstractMesh;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private _observer: BABYLON.Observer<any> = null;
    constructor(camera: PlanarCamera, touchEnabled: boolean) {
        this.inputBus = inputBus;
        this.camera = camera;
        if (touchEnabled === void 0) { touchEnabled = true; }
        this.touchEnabled = touchEnabled;
        this.angularSensibility = 2000.0;
        this.restrictionX = 10;
        this.restrictionY = 10;
        this.camera = null;
    }
    setCamera(camera: PlanarCamera) {
        this.camera = camera;
    }
    getClassName(): string {
        return "MouseInput";
    }
    getSimpleName(): string {
        return "MouseSearchCamera";
    }
    getTypeName() {
        return "FreeCameraSearchInput";
    }
    attachControl(noPreventDefault?: boolean): void {
        if (this.isAttached || !this.camera) return;
        this._observer = this.camera.getScene().onPointerObservable.add(
            this.pointerInput,
        );
        this.noPreventDefault = noPreventDefault;
        this.isAttached = true;
    }
    detachControl() {
        if (this._observer && this.isAttached) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
            this.previousPosition = null;
        }
        this.isAttached = false;
    }
    checkInputs(): void {
        if (!this.isAttached) return;
    }
    handlePointerDown(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        const evt = pointerInfo.event as PointerEvent;
        this.buttonsPressed.push(evt.button);
        if (this.buttonsPressed.includes(MOUSE_BUTTON.LEFT)) {
            MOUSE_STATE.LEFT = true;
            inputBus.sendEvent({
                type: INPUT_EVENT.LEFT_DOWN
            });
        }
        this.previousPosition = {
            x: evt.clientX,
            y: evt.clientY
        };
        if (!this.noPreventDefault) {
            evt.preventDefault();
            const el = evt.srcElement as HTMLElement;
            el.focus();
        }
    }
    handlePointerUp(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        const evt = pointerInfo.event as PointerEvent;
        if (this.buttonsPressed.includes(MOUSE_BUTTON.LEFT)) {
            if (MOUSE_STATE.MOVING) {
                inputBus.sendEvent({
                    type: INPUT_EVENT.LEFT_UP_MOVE
                });
                MOUSE_STATE.MOVING = false;
            }
            else {
                inputBus.sendEvent({
                    type: INPUT_EVENT.LEFT_UP
                });
            }
        }
        this.buttonsPressed.splice(this.buttonsPressed.indexOf(evt.button), 1);
        this.previousPosition = null;
        if (!this.noPreventDefault) {
            evt.preventDefault();
        }
    }
    handlePointerMove(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        eventState;
        if (this.buttonsPressed.includes(MOUSE_BUTTON.LEFT)) {
            MOUSE_STATE.MOVING = true;
            inputBus.sendEvent({type: INPUT_EVENT.LEFT_DOWN_MOVE});
            return;
        }
        // else if (this)
        const evt = pointerInfo.event as PointerEvent;

        if (!this.previousPosition || this.camera.getEngine().isPointerLock) {
            inputBus.sendEvent({type: INPUT_EVENT.ALL_UP_MOVE});
            return;
        };

        const deltaX = evt.clientX - this.previousPosition.x;
        const deltaY = evt.clientY - this.previousPosition.y;
        const yRotation = deltaX / this.angularSensibility;
        const xRotation = deltaY / this.angularSensibility;
        this.camera.cameraRotation.y += (this.camera.getScene().useRightHandedSystem)? -1 * yRotation : yRotation;
        this.camera.cameraRotation.x += xRotation;
        this.previousPosition = {x: evt.clientX, y: evt.clientY};

        if (!this.noPreventDefault) {
            evt.preventDefault();
        }
    }
    handlePick(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        // pointerInfo;
        // eventState;
        // const scene = this.camera.getScene();
        // const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {return mesh !== this.pickPlane && mesh.isPickable});
        // if (pick.hit) {
        // //     this.pickedMesh.showBoundingBox = !this.pickedMesh.showBoundingBox;
        // }
    }
    handlePointerWheel(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        eventState;
        // Move parameters to view
        const defaultZoomDistance = 10;
        const maxHeight = 250;
        const minHeight = 10;

        const wheelEvent = pointerInfo.event as WheelEvent;
        const zoomDisplacement = (wheelEvent.deltaY < 0)? -defaultZoomDistance : defaultZoomDistance;
        const possibleHeight = this.camera.position.y + zoomDisplacement;
        const finalHeight = Math.min(Math.max(possibleHeight, minHeight), maxHeight)
        this.camera.position = new BABYLON.Vector3(
            this.camera.position.x,
            (finalHeight >= 0)? finalHeight : 0,
            this.camera.position.z,
        );
    }

    pointerInput = (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState): void => {
        eventState;
        const evt = pointerInfo.event as PointerEvent;
        if (!this.isAttached || !this.touchEnabled && evt.pointerType === "touch") return;
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN: return this.handlePointerDown(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERUP: return this.handlePointerUp(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERMOVE: return this.handlePointerMove(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERWHEEL: return this.handlePointerWheel(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERPICK: return this.handlePick(pointerInfo, eventState);
            // case BABYLON.PointerEventTypes.POINTERTAP: return this.handlePointerTap(pointerInfo, eventState);
            // case BABYLON.PointerEventTypes.POINTERDOUBLETAP: return this.handlePointerDoubleTap(pointerInfo, eventState);
        }
    }
    // handlePointerTap(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
    // }
    // handlePointerDoubleTap(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
    // }
}
