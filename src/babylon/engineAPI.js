/* eslint-disable */

import * as BABYLON from 'babylonjs';
import CAMERA from "./camera.js";
import LIGHTS from "./lights.js";

export default function (canvas) {
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    canvas.addEventListener('contextmenu', event => event.preventDefault());

    var scene = createScene(engine, canvas);

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
    return engine;
}

var createScene = function (engine, canvas) {
    var scene = new BABYLON.Scene(engine);

    var camera = CAMERA(scene);
    camera.attachControl(canvas, true);

    LIGHTS(scene);

    var map = BABYLON.MeshBuilder.CreateGround("myGround", {width: 4, height: 4, subdivisions: 4}, scene);
    var mapMaterial = new BABYLON.StandardMaterial("mapMaterial", scene);
    mapMaterial.emissiveTexture = new BABYLON.Texture("textures/map.jpg", scene);
    mapMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    map.material = mapMaterial;

    //creates lines
    buildGridLines(scene);
    var pipeline = new BABYLON.DefaultRenderingPipeline(
        "defaultPipeline", // The name of the pipeline
        true, // Do you want the pipeline to use HDR texture?
        scene, // The scene instance
        [camera] // The list of cameras to be attached to
    );
    pipeline.samples = 4;
    pipeline.fxaaEnabled = true;

    return scene;
};

var buildGridLines = function(scene) {
    var gridLines = 10;
    var hiZ = 2;
    var loZ = -2;
    var hiX = 2;
    var loX = -2;
    var height = 0.04;
    var tubes = [];
    var tubeMaterial = new BABYLON.StandardMaterial("tubeMaterial", scene);
    // tubeMaterial.emissiveTexture = new BABYLON.Color3(0, 0, 0);
    tubeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    for (var i = 0; i <= gridLines + 1; i++) {
        var points = [
            new BABYLON.Vector3(hiX, height, loZ + ((hiX-loX)/(gridLines+1))*(i)),
            new BABYLON.Vector3(loX, height, loZ + ((hiX-loX)/(gridLines+1))*(i)),
        ];
        // var line = BABYLON.MeshBuilder.CreateLines("lines", {points: points, colors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)]}, scene);
        var tube = BABYLON.MeshBuilder.CreateTube(
            "tube", {
                path: points,
                radius: 0.005,
                tessellation: 3,
                radiusFunction: null,
                cap: 1,
                arc: 1,
                updateable: false,
                sideOrientation: BABYLON.Mesh.FRONTSIDE,
                frontUVs: null,
                backUVs: null,
                instance: null,
                invertUV: null,
            }, scene);
        tube.material = tubeMaterial;
        tubes.push(tube);
        // lines.push(line);
    }
    for (var i = 0; i <= gridLines + 1; i++) {
        var points = [
            new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, hiZ),
            new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, loZ),
        ];
        // var line = BABYLON.MeshBuilder.CreateLines("lines", {points: [
        //     new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, hiZ),
        //     new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, loZ),
        // ], colors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)]}, scene);
        var tube = BABYLON.MeshBuilder.CreateTube(
            "tube", {
                path: points,
                radius: 0.005,
                tessellation: 3,
                radiusFunction: null,
                cap: 1,
                arc: 1,
                updateable: false,
                sideOrientation: BABYLON.Mesh.FRONTSIDE,
                frontUVs: null,
                backUVs: null,
                instance: null,
                invertUV: null,
            }, scene);
        tube.material = tubeMaterial;
        tubes.push(tube);
        // lines.push(line);
    }
}