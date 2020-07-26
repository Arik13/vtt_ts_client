/* eslint-disable */

export default function(scene: BABYLON.Scene) {
    // Add lights to the scene
    let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
	light.diffuse = new BABYLON.Color3(0, 0, 0);
}