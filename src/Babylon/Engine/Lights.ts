/* eslint-disable */

// Lights the provided scene with a hemispheric light
export default function(scene: BABYLON.Scene) {
    let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    // new BABYLON.SpotLight(
    //     "pointLight",
    //     new BABYLON.Vector3(0, 100, 0),
    //     new BABYLON.Vector3(0, -1, 0),
    //     45,
    //     5,
    //     scene
    // )
    // let lights = [];
    // for (let i = 0; i < 10; i++) {
    //     lights.push(new BABYLON.SpotLight(
    //         "pointLight",
    //         new BABYLON.Vector3(i*10, 1, i*4),
    //         new BABYLON.Vector3(0, -1, 0),
    //         45,
    //         1,
    //         scene
    //     ));
    //     lights[i].diffuse = new BABYLON.Color3(1, 1, 1);
    // }
}