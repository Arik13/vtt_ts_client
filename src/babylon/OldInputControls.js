//Key Input Manager To Use Keys to Move Forward and BackWard and Look to the Left or Right
// let FreeCameraKeyboardWalkInput = function () {
//     const W = 87;
//     const S = 83;
//     const A = 65;
//     const D = 68;
//     const UP = 38;
//     const DOWN = 40;
//     const LEFT = 37;
//     const RIGHT = 39;
//     this._keys = [];
//     this.keysUp = [W, UP];
//     this.keysDown = [S, DOWN];
//     this.keysLeft = [A, LEFT];
//     this.keysRight = [D, RIGHT];
// }

// //Add attachment controls
// FreeCameraKeyboardWalkInput.prototype.attachControl = function (element, noPreventDefault) {
//     let _this = this;

//     // If a key was pressed
//     if (!this._onKeyDown) {
//         element.tabIndex = 1;

//         // Handle key down with this function
//         this._onKeyDown = function (evt) {

//             // If any of the movement keys were pressed
//             if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
//                 _this.keysDown.indexOf(evt.keyCode) !== -1 ||
//                 _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
//                 _this.keysRight.indexOf(evt.keyCode) !== -1) {
//                 let index = _this._keys.indexOf(evt.keyCode);
//                 // Add the key to the queue
//                 if (index === -1) {
//                     _this._keys.push(evt.keyCode);
//                 }
//                 if (!noPreventDefault) {
//                     evt.preventDefault();
//                 }
//             }
//         };

//         // Handle key up with this function
//         this._onKeyUp = function (evt) {
//             // If a movement key was pressed
//             if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
//                 _this.keysDown.indexOf(evt.keyCode) !== -1 ||
//                 _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
//                 _this.keysRight.indexOf(evt.keyCode) !== -1) {
//                 let index = _this._keys.indexOf(evt.keyCode);
//                 // Clear the key from the queue
//                 if (index >= 0) {
//                     _this._keys.splice(index, 1);
//                 }
//                 if (!noPreventDefault) {
//                     evt.preventDefault();
//                 }
//             }
//         };

//         // Add the key handlers
//         element.addEventListener("keydown", this._onKeyDown, false);
//         element.addEventListener("keyup", this._onKeyUp, false);
//     }
// };


// // Add detachment controls
// FreeCameraKeyboardWalkInput.prototype.detachControl = function (element) {
//     if (this._onKeyDown) {
//         element.removeEventListener("keydown", this._onKeyDown);
//         element.removeEventListener("keyup", this._onKeyUp);
//         BABYLON.Tools.UnregisterTopRootEvents([
//             { name: "blur", handler: this._onLostFocus }
//         ]);
//         this._keys = [];
//         this._onKeyDown = null;
//         this._onKeyUp = null;
//     }
// };

// // Keys movement control by checking inputs
// FreeCameraKeyboardWalkInput.prototype.checkInputs = function () {
//     if (this._onKeyDown) {
//         let camera = this.camera;
//         for (let i = 0; i < this._keys.length; i++) {
//             let keyCode = this._keys[i];
//             let xMod = Math.sin(camera["rotation"]["y"]);
//             let zMod = Math.cos(camera["rotation"]["y"]);
//             let speed = camera.speed;
//             let forward = new Vector3(xMod * speed , 0, zMod * speed);
//             let up = new Vector3(0, 1, 0);
//             let left = forward.cross(up);
//             if (this.keysLeft.indexOf(keyCode) !== -1) {
//                 camera.direction.copyFromFloats(left["x"], left["y"], left["z"]);
//             }
//             else if (this.keysUp.indexOf(keyCode) !== -1) {
//                 camera.direction.copyFromFloats(forward["x"], forward["y"], forward["z"]);
//             }
//             else if (this.keysRight.indexOf(keyCode) !== -1) {
//                 camera.direction.copyFromFloats(-left["x"], -left["y"], -left["z"]);
//             }
//             else if (this.keysDown.indexOf(keyCode) !== -1) {
//                 camera.direction.copyFromFloats(-forward["x"], -forward["y"], -forward["z"]);
//             }
//             if (camera.getScene().useRightHandedSystem) {
//                 camera.direction.z *= -1;
//             }
//             camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
//             BABYLON.Vector3.TransformNormalToRef(camera.direction, camera._cameraTransformMatrix, camera._transformedDirection);
//             camera.cameraDirection.addInPlace(camera.direction);
//         }
//     }
// };

// //Add the onLostFocus function
// FreeCameraKeyboardWalkInput.prototype._onLostFocus = function (e) {
//     this._keys = [];
// };

// //Add the two required functions for the control Name
// FreeCameraKeyboardWalkInput.prototype.getTypeName = function () {
//     return "FreeCameraKeyboardWalkInput";
// };

// FreeCameraKeyboardWalkInput.prototype.getSimpleName = function () {
//     return "keyboard";
// };






//The Mouse Manager to use the mouse (touch) to search around including above and below
    // let FreeCameraSearchInput = function (touchEnabled) {
    //     if (touchEnabled === void 0) { touchEnabled = true; }
    //     this.touchEnabled = touchEnabled;
    //     this.buttons = [0, 1, 2];
    //     this.angularSensibility = 2000.0;
    //     this.restrictionX = 10000000;
    //     this.restrictionY = 10000000;
    // }

    // //add attachment control which also contains the code to react to the input from the mouse
    // FreeCameraSearchInput.prototype.attachControl = function (element, noPreventDefault) {
    //     let _this = this;
    //     let engine = this.camera.getEngine();
    //     let angle = {x:0, y:0};
    //     if (!this._pointerInput) {
    //         this._pointerInput = function (p, s) {
    //             let evt = p.event;
    //             if (!_this.touchEnabled && evt.pointerType === "touch") {
    //                 return;
    //             }
    //             if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {
    //                 return;
    //             }
    //             if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
    //                 try {
    //                     evt.srcElement.setPointerCapture(evt.pointerId);
    //                 }
    //                 catch (e) {
    //                     //Nothing to do with the error. Execution will continue.
    //                 }
    //                 _this.previousPosition = {
    //                     x: evt.clientX,
    //                     y: evt.clientY
    //                 };
    //                 if (!noPreventDefault) {
    //                     evt.preventDefault();
    //                     element.focus();
    //                 }
    //             }
    //             else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
    //                 try {
    //                     evt.srcElement.releasePointerCapture(evt.pointerId);
    //                 }
    //                 catch (e) {
    //                     //Nothing to do with the error.
    //                 }
    //                 _this.previousPosition = null;
    //                 if (!noPreventDefault) {
    //                     evt.preventDefault();
    //                 }
    //             }
    //             else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
    //                 if (!_this.previousPosition || engine.isPointerLock) {
    //                     return;
    //                 }
    //                 let offsetX = evt.clientX - _this.previousPosition.x;
    //                 let offsetY = evt.clientY - _this.previousPosition.y;
    //                 angle.x +=offsetX;
    //                 angle.y -=offsetY;
    //                 if(Math.abs(angle.x) > _this.restrictionX )  {
    //                     angle.x -=offsetX;
    //                 }
    //                 if(Math.abs(angle.y) > _this.restrictionY )  {
    //                     angle.y +=offsetY;
    //                 }
    //                 if (_this.camera.getScene().useRightHandedSystem) {
    //                     if(Math.abs(angle.x) < _this.restrictionX )  {
    //                         _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
    //                     }
    //                 }
    //                 else {
    //                     if(Math.abs(angle.x) < _this.restrictionX )  {
    //                         _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
    //                     }
    //                 }
    //                 if(Math.abs(angle.y) < _this.restrictionY )  {
    //                     _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
    //                 }
    //                 _this.previousPosition = {
    //                     x: evt.clientX,
    //                     y: evt.clientY
    //                 };
    //                 if (!noPreventDefault) {
    //                     evt.preventDefault();
    //                 }
    //             }
    //         };
    //     }
    //     this._onSearchMove = function (evt) {
    //         if (!engine.isPointerLock) {
    //             return;
    //         }
    //         let offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
    //         let offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
    //         if (_this.camera.getScene().useRightHandedSystem) {
    //             _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
    //         }
    //         else {
    //             _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
    //         }
    //         _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
    //         _this.previousPosition = null;
    //         if (!noPreventDefault) {
    //             evt.preventDefault();
    //         }
    //     };
    //     this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);
    //     element.addEventListener("mousemove", this._onSearchMove, false);
    // };

    // //Add detachment control
    // FreeCameraSearchInput.prototype.detachControl = function (element) {
    //     if (this._observer && element) {
    //         this.camera.getScene().onPointerObservable.remove(this._observer);
    //         element.removeEventListener("mousemove", this._onSearchMove);
    //         this._observer = null;
    //         this._onSearchMove = null;
    //         this.previousPosition = null;
    //     }
    // };

    // //Add the two required functions for names
    // FreeCameraSearchInput.prototype.getTypeName = function () {
    //     return "FreeCameraSearchInput";
    // };

    // FreeCameraSearchInput.prototype.getSimpleName = function () {
    //     return "MouseSearchCamera";
    // };
