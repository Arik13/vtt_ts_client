/*
    TODO: Add vertical translation capability to the camera via the mousewheel

    The planar camera is initialized pointing at the origin, 120 feet above it.
    The camera can pitch and yaw, but not roll. It can be translated in the
    x and z directions along the plane it starts on, which is parallel to the
    xz plane (the ground).

    In world space, the Y direction is up/down.
*/

import { KeyInput } from "@/Babylon/Input/KeyInput";
import { MouseInput } from "@/Babylon/Input/MouseInput";

import "babylonjs"

export class PlanarCamera extends BABYLON.UniversalCamera {
    // cameraRotation: BABYLON.Vector2;
    // minZ: number;
    // speed: number;
    direction: BABYLON.Vector3;
    angularSpeed: number;
    angle: number;
    constructor(
        name: string,
        position: BABYLON.Vector3,
        target: BABYLON.Vector3,
        scene: BABYLON.Scene,
        angularSpeed: number,
        minZ: number,
        speed: number,
        angle: number,
    ) {
        super(name, position, scene);
        this.setTarget(target);
        this.direction = new BABYLON.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
        // this.cameraRotation = new BABYLON.Vector2(Math.PI/2, 0);
        this.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        this.angularSpeed = angularSpeed;
        this.minZ = minZ;
        this.speed = speed;
        this.angle = angle;
    }
}

export const cameraFactory = (scene: BABYLON.Scene) => {
    const camera = new PlanarCamera(
        "MyCamera",                         // Name
        new BABYLON.Vector3(0, 250, 0),     // Position
        new BABYLON.Vector3(0, 0, 0),       // Target
        scene,                              // Scene
        0.06,                               // Angular speed
        0.1,                                // Minimum Z Level
        0.3,                                // Speed
        0,                          // Angle
    );

    // Remove default input management.
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");

    // Add custom inputs
    camera.inputs.add(new KeyInput(camera));
    camera.inputs.add(new MouseInput(camera, true));

    // camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    camera.checkCollisions = true;
    return camera;
}