import { KeyInput } from "./KeyInput";
import { MouseInput } from "./MouseInput/MouseInput";

import "babylonjs"

export class PlanarCamera extends BABYLON.UniversalCamera {
    direction: BABYLON.Vector3;
    cameraRotation: BABYLON.Vector2;
    angularSpeed: number;
    minZ: number;
    speed: number;
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
        )
    {
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
        new BABYLON.Vector3(0, 120, 0),     // Position
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

    camera.inputs.add(new KeyInput(camera));
    camera.inputs.add(new MouseInput(camera, true));
    return camera;
}