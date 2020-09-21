/* eslint-disable */

// Lights the provided scene with a hemispheric light
export default function(scene: BABYLON.Scene) {
    let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
	light.diffuse = new BABYLON.Color3(1, 1, 1);
}