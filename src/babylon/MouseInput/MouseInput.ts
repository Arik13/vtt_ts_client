import {InputBus, inputBus, INPUT_EVENT} from "../InputBus";
import {PlanarCamera} from "../Camera";

enum MOUSE_BUTTON {
    NONE = -1,
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
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
    private _observer: any = null;
    pickPlane: BABYLON.Mesh
    pickedMesh: BABYLON.AbstractMesh;
    isDown: boolean;
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
    attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
        if (this.isAttached || !this.camera) return;
        this._observer = this.camera.getScene().onPointerObservable.add(
            this.pointerInput,
        );
        this.noPreventDefault = noPreventDefault;
        this.isAttached = true;
    }
    detachControl(element: HTMLElement): void {
        if (this._observer && element && this.isAttached) {
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
        this.isDown = true;
        const scene = this.camera.getScene();

        const evt = pointerInfo.event as PointerEvent;
        this.buttonsPressed.push(evt.button);
        if (this.buttonsPressed.includes(MOUSE_BUTTON.LEFT)) {
            inputBus.sendEvent({
                type: INPUT_EVENT.LEFT_DOWN
            });
        }
        try {
            const el = evt.srcElement as HTMLElement;
            el.setPointerCapture(evt.pointerId);
        }
        catch (e) {
            // Nothing to do with the error. Execution will continue.
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
        this.isDown = false;
        const evt = pointerInfo.event as PointerEvent;
        this.buttonsPressed.splice(this.buttonsPressed.indexOf(evt.button), 1);
        try {
            const el = evt.srcElement as HTMLElement;
            el.releasePointerCapture(evt.pointerId);
        }
        catch (e) {
            //Nothing to do with the error.
        }
        this.previousPosition = null;
        if (!this.noPreventDefault) {
            evt.preventDefault();
        }
    }
    handlePointerMove(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        if (this.buttonsPressed.includes(MOUSE_BUTTON.LEFT)) {
            inputBus.sendEvent({
                type: INPUT_EVENT.LEFT_DOWN_MOVE
            });
        }
        const evt = pointerInfo.event as PointerEvent;
        if (this.buttonsPressed.includes(MOUSE_BUTTON.LEFT)) {
            return;
        }

        if (!this.previousPosition || this.camera.getEngine().isPointerLock) {
            return;
        }
        const deltaX = evt.clientX - this.previousPosition.x;
        const deltaY = evt.clientY - this.previousPosition.y;
        const yRotation = deltaX / this.angularSensibility;
        const xRotation = deltaY / this.angularSensibility;
        this.camera.cameraRotation.y += (this.camera.getScene().useRightHandedSystem)? -1 * yRotation : yRotation;
        this.camera.cameraRotation.x += xRotation;
        this.previousPosition = {
            x: evt.clientX,
            y: evt.clientY
        };
        if (!this.noPreventDefault) {
            evt.preventDefault();
        }
    }
    handlePick(pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState) {
        const scene = this.camera.getScene();
        const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {return mesh !== this.pickPlane && mesh.isPickable});
        if (pick.hit) {
        //     this.pickedMesh.showBoundingBox = !this.pickedMesh.showBoundingBox;
        }
    }
    pointerInput = (pointerInfo: BABYLON.PointerInfo, eventState: BABYLON.EventState): void => {
        eventState;
        const evt = pointerInfo.event as PointerEvent;
        if (!this.isAttached || !this.touchEnabled && evt.pointerType === "touch") return;
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN: return this.handlePointerDown(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERUP: return this.handlePointerUp(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERMOVE: return this.handlePointerMove(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERWHEEL: return;
            case BABYLON.PointerEventTypes.POINTERPICK: return this.handlePick(pointerInfo, eventState);
            case BABYLON.PointerEventTypes.POINTERTAP: return;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP: return;
        }
    }
}
