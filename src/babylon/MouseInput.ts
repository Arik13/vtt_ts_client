import {PlanarCamera} from "./Camera"

export class MouseInput implements BABYLON.ICameraInput<PlanarCamera> {
    isAttached = false;
    noPreventDefault = false;
    camera: PlanarCamera;
    touchEnabled: boolean;
    buttons: number[];
    angularSensibility: number;
    restrictionX: number;
    restrictionY: number;
    previousPosition: {x: number; y: number};
    private _observer: any = null;
    constructor(camera: PlanarCamera, touchEnabled: boolean) {
            if (touchEnabled === void 0) { touchEnabled = true; }
            this.touchEnabled = touchEnabled;
            this.buttons = [0, 1, 2];
            this.angularSensibility = 2000.0;
            this.restrictionX = 10000000;
            this.restrictionY = 10000000;
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
        if (!this.isAttached) return;
        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);
        element.addEventListener("mousemove", this._onSearchMove, false);
        this.noPreventDefault = noPreventDefault;
        this.isAttached = true;
    }
    detachControl(element: HTMLElement): void {
        if (this._observer && element && this.isAttached) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            element.removeEventListener("mousemove", this._onSearchMove);
            this._observer = null;
            this._onSearchMove = null;
            this.previousPosition = null;
        }
        this.isAttached = false;
    }
    checkInputs(): void {
        if (!this.isAttached) return;
    }
    _pointerInput = (eventData: BABYLON.PointerInfo, eventState: BABYLON.EventState): void => {
        eventState;
        if (!this.isAttached) return;
        const angle = {x:0, y:0};
        const evt = eventData.event as PointerEvent;
        if (!this.touchEnabled && evt.pointerType === "touch") {
            return;
        }
        if (eventData.type !== BABYLON.PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
            return;
        }
        if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            try {
                const el = evt.srcElement as HTMLElement;
                el.setPointerCapture(evt.pointerId);
            }
            catch (e) {
                //Nothing to do with the error. Execution will continue.
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
        else if (eventData.type === BABYLON.PointerEventTypes.POINTERUP) {
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
        else if (eventData.type === BABYLON.PointerEventTypes.POINTERMOVE) {
            if (!this.previousPosition || this.camera.getEngine().isPointerLock) {
                return;
            }
            const offsetX = evt.clientX - this.previousPosition.x;
            const offsetY = evt.clientY - this.previousPosition.y;
            angle.x +=offsetX;
            angle.y -=offsetY;
            if(Math.abs(angle.x) > this.restrictionX )  {
                angle.x -=offsetX;
            }
            if(Math.abs(angle.y) > this.restrictionY )  {
                angle.y +=offsetY;
            }
            if (this.camera.getScene().useRightHandedSystem) {
                if(Math.abs(angle.x) < this.restrictionX )  {
                    this.camera.cameraRotation.y -= offsetX / this.angularSensibility;
                }
            }
            else {
                if(Math.abs(angle.x) < this.restrictionX )  {
                    this.camera.cameraRotation.y += offsetX / this.angularSensibility;
                }
            }
            if(Math.abs(angle.y) < this.restrictionY )  {
                this.camera.cameraRotation.x += offsetY / this.angularSensibility;
            }
            this.previousPosition = {
                x: evt.clientX,
                y: evt.clientY
            };
            if (!this.noPreventDefault) {
                evt.preventDefault();
            }
        }
    }
    _onSearchMove = (evt: MouseEvent) => {

        if (!this.isAttached || !this.camera.getEngine().isPointerLock) return;

        const offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
        const offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
        if (this.camera.getScene().useRightHandedSystem) {
            this.camera.cameraRotation.y -= offsetX / this.angularSensibility;
        }
        else {
            this.camera.cameraRotation.y += offsetX / this.angularSensibility;
        }
        this.camera.cameraRotation.x += offsetY / this.angularSensibility;
        this.previousPosition = null;
        if (!this.noPreventDefault) {
            evt.preventDefault();
        }
    }
}
