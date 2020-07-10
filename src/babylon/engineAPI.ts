import {cameraFactory} from "./Camera";
import LIGHTS from "./Lights";

const buildGridLines = function(scene: BABYLON.Scene) {
    const gridLines = 10;
    const hiZ = 2;
    const loZ = -2;
    const hiX = 2;
    const loX = -2;
    const height = 0.04;
    const tubes = [];
    const tubeMaterial = new BABYLON.StandardMaterial("tubeMaterial", scene);
    // tubeMaterial.emissiveTexture = new BABYLON.Color3(0, 0, 0);
    tubeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    for (let i = 0; i <= gridLines + 1; i++) {
        const points = [
            new BABYLON.Vector3(hiX, height, loZ + ((hiX-loX)/(gridLines+1))*(i)),
            new BABYLON.Vector3(loX, height, loZ + ((hiX-loX)/(gridLines+1))*(i)),
        ];
        const tube = BABYLON.MeshBuilder.CreateTube(
            "tube", {
                path: points,
                radius: 0.005,
                tessellation: 3,
                radiusFunction: null,
                cap: 1,
                arc: 1,
                // updateable: false,
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
    for (let i = 0; i <= gridLines + 1; i++) {
        const points = [
            new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, hiZ),
            new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, loZ),
        ];
        const tube = BABYLON.MeshBuilder.CreateTube(
            "tube", {
                path: points,
                radius: 0.005,
                tessellation: 3,
                radiusFunction: null,
                cap: 1,
                arc: 1,
                // updateable: false,
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

const createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    const scene = new BABYLON.Scene(engine);

    const camera = cameraFactory(scene);
    camera.attachControl(canvas, true);

    LIGHTS(scene);

    const map = BABYLON.MeshBuilder.CreateGround("myGround", {width: 4, height: 4, subdivisions: 4}, scene);
    const mapMaterial = new BABYLON.StandardMaterial("mapMaterial", scene);
    mapMaterial.emissiveTexture = new BABYLON.Texture("textures/map.jpg", scene);
    mapMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    map.material = mapMaterial;

    //creates lines
    buildGridLines(scene);
    const pipeline = new BABYLON.DefaultRenderingPipeline(
        "defaultPipeline", // The name of the pipeline
        true, // Do you want the pipeline to use HDR texture?
        scene, // The scene instance
        [camera] // The list of cameras to be attached to
    );
    pipeline.samples = 4;
    pipeline.fxaaEnabled = true;

    return scene;
};

export default function (canvas: HTMLCanvasElement) {
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    canvas.addEventListener('contextmenu', event => event.preventDefault());

    const scene = createScene(engine, canvas);

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