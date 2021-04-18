import {MeshData} from "@/Babylon/Engine/MeshData";
import {LocationViewListener} from "@/Babylon/Locations/LocationView";
// import {LocationModel} from "@/Babylon/Locations/LocationModel";
import * as Asset from '@shared/Assets/Asset';
import lightScene from "@/Babylon/Engine/Lights"
import {cameraFactory, PlanarCamera} from "@/Babylon/Engine/Camera"
import {createPickPlane, createMesh, buildGridLines, buildScene, buildPipeline} from "./SceneAlgorithms";
// import {exportTest} from "@/Babylon/Scenes/exportTest"
import * as GUI from 'babylonjs-gui';
import { campaignStore } from "@/Stores/CampaignStore";
import { locationStore } from "@/Stores/LocationStore";
import { Color3 } from "babylonjs/Maths/math.color";
import { createImageURL } from "@/Util/functions";
// import {SceneLoader} from "babylonjs/Loading/sceneLoader"
// import * as lod from 'babylonjs-loaders';
// BABYLON.SceneLoader.RegisterPlugin(new lod.GLTFFileLoader());

export class Location implements LocationViewListener { // Controller
    inputs: BABYLON.ICameraInput<PlanarCamera>[];

    gridElementWidth: number;
    gridElementHeight: number;
    files: number;
    ranks: number;
    worldSpaceWidth: number;
    worldSpaceHeight: number;

    ////////////////////////////////
    scene: BABYLON.Scene;
    // meshes: BABYLON.Mesh[] = [];
    meshMap: Map<string, BABYLON.Mesh> = new Map<string, BABYLON.Mesh>();
    camera: PlanarCamera;
    canvas: HTMLCanvasElement;
    pickPlane: BABYLON.Mesh;
    pickedMesh: BABYLON.AbstractMesh;
    pickStartingPosition: BABYLON.Vector3;
    pipeline: BABYLON.DefaultRenderingPipeline;
    hemiLight: BABYLON.HemisphericLight;

    snapToGridEnabled: boolean;

    timeOfDay: Date;
    constructor(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement,
        locationData: Asset.Location.Model,
        mapMeshData: MeshData,
    ) {
        this.worldSpaceWidth = locationData.files * locationData.tileWidth,
        this.worldSpaceHeight = locationData.ranks * locationData.tileLength,
        this.ranks = locationData.files,
        this.files = locationData.ranks,
        this.gridElementHeight = this.worldSpaceHeight / this.ranks;
        this.gridElementWidth = this.worldSpaceWidth / this.files;
        /////////////////////////////////////////////
        this.canvas = canvas;
        this.scene = buildScene(engine);
        const camera = cameraFactory(this.scene);
        this.scene.cameras = [camera];
        this.camera = camera;
        this.snapToGridEnabled = true;

        this.hemiLight = lightScene(this.scene);

        this.pipeline = buildPipeline(this.scene);
        // BABYLON.SceneLoader.ImportMesh(
        //     null,
        //     "./Babylon/Scenes/",
        //     "data:" + JSON.stringify(exportTest),
        //     this.scene,
        //     (scene) => {
        //     },
        // );
        this.pickPlane = createPickPlane(this.worldSpaceWidth, this.worldSpaceHeight, this.scene);
        this.addMap(
            mapMeshData,
            this.worldSpaceWidth,
            this.worldSpaceHeight,
            BABYLON.Vector3.Zero(),
            1,
        )
        buildGridLines(
            this.ranks,
            this.files,
            this.worldSpaceWidth,
            this.worldSpaceHeight,
            this.scene,
        );
        let luxValues: [number, string][] = [
            [0.0001, "Night, moonless, overcast, starlight"],
            [0.002, "Night, moonless, clear, starlight"],
            [0.01, "Night, quarter moon, clear, starlight"],
            [0.25, "Night, full moon, clear, starlight"],
            [3.4, "Twilight, civil lights, clear, starlight"],
            [40, "Fully overcast"],
            [400, "Sunrise or sunset on a clear day"],
            [10000, "Overcast day"],
            [15000, "Full daylight (not direct sun)"],
            [100000, "Direct sunlight"],
        ];
        this.setTime(6, 0, 0);
        let imageURL = createImageURL("6060fafb5f570750a0addda0");
        const makeParticleSystem = () => {
            let capacity = 100000;
            const particleSystem = new BABYLON.GPUParticleSystem("particles", {capacity}, this.scene, true);
            particleSystem.particleTexture = new BABYLON.Texture(imageURL, this.scene);
            particleSystem.emitter = new BABYLON.Vector3(0, 10, 0); //a Vector3
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = 0;
            particleSystem.minSize = 1;
            particleSystem.maxSize = 3 * particleSystem.minSize;
            particleSystem.minLifeTime = 100;
            particleSystem.maxLifeTime = 100;
            particleSystem.minEmitPower = 200;
            particleSystem.maxEmitPower = 200;
            particleSystem.emitRate = 2000;
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.minEmitBox = new BABYLON.Vector3(-100, 200, -100);
            particleSystem.maxEmitBox = new BABYLON.Vector3(100, 200, 100);
            particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);
            particleSystem.direction2 = new BABYLON.Vector3(0, -1, 0);
            // particleSystem.
            // particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
            // particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
            // particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
            // particleSystem.color2 = new BABYLON.Color4(0, 1, 1, 1);
            particleSystem.gravity = new BABYLON.Vector3(0, -9.8, 0);

            particleSystem.spriteCellHeight = 64;
            particleSystem.spriteCellWidth = 64;
            particleSystem.startSpriteCellID = 0;
            particleSystem.endSpriteCellID = 9;
            particleSystem.spriteCellChangeSpeed = 4;


            particleSystem.renderingGroupId = 1;
            particleSystem.start();
        }
        for (let i = 0; i < 1; i++) {
            makeParticleSystem();
        }
        // setTimeout(() => {
        //     BABYLON.ParticleHelper.CreateAsync("explosion", this.scene).then((set) => {
        //         set.systems.forEach(s => {
        //             s.disposeOnStop = true;
        //         });
        //         set.start();
        //     });
        // }, 5000)
        // particleSystem.createBoxEmitter(
        //     new BABYLON.Vector3(-7, 8, 3),
        //     new BABYLON.Vector3(7, 8, -3),
        //     new BABYLON.Vector3(-1, 0, 0),
        //     new BABYLON.Vector3(1, 0, 0)
        // );
        // BABYLON.ParticleHelper.CreateAsync("rain", this.scene, true).then((set) => {
        //     set.systems.forEach(system => {
        //         console.log(system);
        //         // system.maxScaleX = 300;
        //         // system.maxScaleY = 300;
        //     });
        //     set.start();
        // });



        // interval = setInterval(iterateDaytimeLight, 400);
    }
    setTime(hour: number, minute: number, second: number) {
        // DECLARATIONS
        // const orderOfMagnitude = (x: number) => Math.floor(Math.log10(x));
        // const gaussian = (x: number, amplitude: number, pos: number, width: number) => amplitude * Math.exp(-(Math.pow(x-pos, 2)/Math.pow(width, 2)));
        const sigmoid = (x: number, xComp: number, centerX: number) => 1 / (1 + Math.pow(Math.E, -xComp*(x-centerX)));
        const sin2 = (x: number) => (Math.sin(((x) * 2 * Math.PI) - Math.PI/2) + 1)/2;
        const normalizeLux = (x: number) => Math.log10(x)/10 + 0.5;

        // const NOON_COLOR = new BABYLON.Color4(0, 0.5, 1, 1);
        // const MIDNIGHT_COLOR = new BABYLON.Color4(0, 0, 0, 1);
        // const SUNSET_COLOR = new BABYLON.Color4(0.51, 0.31, 0.17, 1);

        const secondsToMillis = (seconds: number) => 1000 * seconds;
        const minutesToMillis = (minutes: number) => secondsToMillis(60 * minutes);
        const hoursToMillis = (hours: number) => minutesToMillis(60 * hours);
        const daysToMillis = (days: number) => hoursToMillis(24 * days);

        const DAY_MILLIS = daysToMillis(1);
        const MAX_LUX = 100000;

        const luxAtTime = (t: number) => {
            let xComp = 32;
            let sigCenter = 0.75;
            let normalizedTime = t / DAY_MILLIS;
            let sinOut = sin2(normalizedTime);
            let sigOut = sigmoid(sinOut, xComp, sigCenter);
            return sigOut * MAX_LUX;
        }

        let t = hoursToMillis(hour) + minutesToMillis(minute) + secondsToMillis(second);
        let lux = luxAtTime(t);
        let normalizedLux = normalizeLux(lux);

        const SKY_SIGMOID_COMPRESSION = 10;
        const SKY_SIGMOID_INFLECTION_X = 0.8;
        const LIGHT_SIGMOID_COMPRESSION = 7;
        const LIGHT_SIGMOID_INFLECTION_X = 0.5;

        let skyHSV = new BABYLON.Color3(
            210,                                  // Hue
            0.7,                                    // Saturation
            sigmoid(normalizedLux, SKY_SIGMOID_COMPRESSION,  SKY_SIGMOID_INFLECTION_X),     // Value
        );
        let lightHSV = new BABYLON.Color3(
            210,                                  // Hue
            0,                                    // Saturation
            sigmoid(normalizedLux, LIGHT_SIGMOID_COMPRESSION,  LIGHT_SIGMOID_INFLECTION_X),     // Value
        );
        let skyColor = hsvToRGB(skyHSV);
        let lightColor = hsvToRGB(lightHSV);
        this.scene.clearColor = skyColor.toColor4();
        this.hemiLight.diffuse = lightColor;
    }
    deleteToken(id: string) {
        this.meshMap.get(id).dispose();
        this.meshMap.delete(id);
    }
    addToken(rank: number, file: number, tokenModel: MeshData) {
        if (!tokenModel) return;

        const mesh = createMesh(
            tokenModel,
            this.gridElementWidth,
            this.gridElementHeight,
            this.calcRankFilePos(rank, file),
            3,
            this.scene,
        );
        this.meshMap.set(mesh.id, mesh);
    }
    updateToken(id: string, token: Asset.Token.Data) {
        const tokenMesh = this.meshMap.get(id);
        const position = this.calcRankFilePos(token.tokenModel.position.x, token.tokenModel.position.z);
        tokenMesh.setAbsolutePosition(position);
    }
    tokenSelected(tokenID: string) {
        tokenID;
    }
    calcRankFilePos(rank: number, file: number): BABYLON.Vector3 {
        return new BABYLON.Vector3(
            -(this.worldSpaceWidth/2) + rank * this.gridElementWidth + this.gridElementWidth/2,
            0,
            -(this.worldSpaceHeight/2) + file * this.gridElementHeight + this.gridElementHeight/2,
        );
    }
    convertToRankFilePos(position: BABYLON.Vector3) {
        const halfWorldWidth = (this.worldSpaceWidth / 2);
        const halfWorldHeight = (this.worldSpaceHeight / 2);
        return {
            x: (position.x + halfWorldWidth - 2.5) / this.gridElementWidth,
            z: (position.z + halfWorldHeight - 2.5) / this.gridElementHeight,
        }
    }
    findClosestTileCenter(position: BABYLON.Vector3): BABYLON.Vector3 {
        const positiveX = position.x + this.worldSpaceWidth / 2 - this.gridElementWidth/2;
        const positiveY = position.z + this.worldSpaceHeight / 2 - this.gridElementWidth/2;
        const newRank = Math.round(positiveX / this.gridElementWidth);
        const newFile = Math.round(positiveY / this.gridElementHeight);
        const newX = (newRank * this.gridElementWidth) - this.worldSpaceWidth/2 + this.gridElementWidth/2;
        const newY = (newFile * this.gridElementHeight) - this.worldSpaceHeight/2  + this.gridElementHeight/2;
        return new BABYLON.Vector3(newX, 0, newY);
    }
    getCamera(): PlanarCamera {
        return this.camera;
    }
    setInputs(inputs: BABYLON.ICameraInput<PlanarCamera>[]) {
        for (const key in inputs) {
            this.getCamera().inputs.add(inputs[key]);
        }
    }
    attachControl() {
        this.camera.attachControl(this.canvas, true);
    }
    detachControl() {
        this.camera.detachControl(this.canvas);
    }
    addMap(
        meshData: MeshData,
        width: number,
        height: number,
        position: BABYLON.Vector3,
        alphaIndex: number
    ) {
        if (!meshData) return;
        const mesh = createMesh(
            meshData,
            width,
            height,
            position,
            alphaIndex,
            this.scene,
        );
        mesh.isPickable = false;
    }
    render() {
        this.scene.render();
    }
    trySelect() {
        const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => mesh !== this.pickPlane && mesh.isPickable);

        // Deselect picked mesh if empty area clicked
        if (!pick.hit) {
            if (this.pickedMesh) {
                this.pickedMesh.showBoundingBox = false;
                this.pickedMesh = null;
                campaignStore.setSelectedToken(null);
            }
        }
        else {
            // this.pickedMesh.showBoundingBox = false;
            if (pick.pickedMesh != this.pickPlane && pick.pickedMesh.isPickable) {
                if (this.pickedMesh) {
                    this.pickedMesh.showBoundingBox = false;
                }

                // if (this.pickedMesh) {
                //     this.pickedMesh.showBoundingBox = false;
                // }
                this.pickedMesh = pick.pickedMesh;
                campaignStore.setSelectedToken(pick.pickedMesh.id);
                this.pickedMesh.showBoundingBox = true;
                this.pickStartingPosition = this.getGroundPosition();
            }
        }
    }
    tryTarget() {
        const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => mesh == this.pickPlane);
        let locationPoint = this.convertToRankFilePos(this.findClosestTileCenter(pick.pickedPoint));
        return locationPoint;
    }
    setSelectionPosition(position: BABYLON.Vector3) {
        this.pickedMesh.setAbsolutePosition(position);
    }
    hasSelection() {
        return !!this.pickedMesh;
    }
    getGroundPosition(): BABYLON.Vector3 | null {
        // Use a predicate to get position on the ground
        const scene = this.camera.getScene();
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
            return mesh == this.pickPlane;
        });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }
    calcPosition(rank: number, file: number): BABYLON.Vector3 {
        return new BABYLON.Vector3(
            -(this.worldSpaceWidth/2) + rank * this.gridElementWidth + this.gridElementWidth/2,
            -(this.worldSpaceHeight/2) + rank * this.gridElementHeight + this.gridElementHeight/2,
            0
        );
    }
    createLight(point: any) {
        let mesh = this.meshMap.get("6063ab39b026652c78999a74");
        // let position = this.calcRankFilePos(point.x, point.z);
        // position.y = 5;
        // console.log(position);
        console.log(mesh.position);
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, this.scene);
        sphere.isPickable = false;
        sphere.position = mesh.position.clone();
        sphere.visibility = 0;
        let newPosition = BABYLON.Vector3.Zero();
        newPosition.y += 5;

        let pointLight = new BABYLON.PointLight("pointLight", newPosition, this.scene);
        mesh.addChild(sphere);
        pointLight.parent = sphere;

        // pointLight.position.y += 5;
        // console.log(pointLight.position);
        // pointLight.range = 1000;


    }
}
let i = 0;
const NOON_COLOR = new BABYLON.Color4(0, 0.5, 1, 1);
const MIDNIGHT_COLOR = new BABYLON.Color4(0, 0, 0, 1);
const SUNSET_COLOR = new BABYLON.Color4(0.51, 0.31, 0.17, 1);

const hoursToMillis = (hours: number) => 1000 * 60 * 60 * hours;
const minutesToMillis = (minutes: number) => 1000 * 60 * minutes;
const DAY_MILLIS = hoursToMillis(24);
const NOON_MILLIS = hoursToMillis(12);

const scaleColor = (scalingFactor: number, color: BABYLON.Color4) => {
    return new BABYLON.Color4(
        color.r * scalingFactor,
        color.g * scalingFactor,
        color.b * scalingFactor,
        1,
    );
}
const washColor = (color: BABYLON.Color3) => {
    let magnitude = Math.sqrt(color.r * color.r + color.g * color.g + color.b * color.b);
    const washColorChannel = (colorChannel: number) => {
        const WASH_CONSTANT = 0.5;
        return (colorChannel * colorChannel) * (WASH_CONSTANT);
    }
    let baseBrightness = 0.9;
    color.r = 0.1 + baseBrightness * magnitude + washColorChannel(color.r);
    color.g = 0.1 + baseBrightness * magnitude + washColorChannel(color.g);
    color.b = 0.1 + baseBrightness * magnitude + washColorChannel(color.b);
    return color;
}

const generateColor = () => {
    let millisElapsed = hoursToMillis(i);
    let sinFunc1 = (x: number) => (Math.sin(((x) * 2 * Math.PI) - Math.PI/2) + 1)/2;
    let compressedLows = (x: number) => (Math.sin(x) < 0)? sinFunc1(x)*x : sinFunc1(x);
    let scalingFactor = sinFunc1(millisElapsed/DAY_MILLIS);
    console.log(`${i % 24}:00 -- ${scalingFactor.toFixed(2)} -- ${compressedLows(millisElapsed/DAY_MILLIS).toFixed(2)}`);
    i++;
    // return scaleColor(scalingFactor, SUNSET_COLOR);
    return scaleColor(scalingFactor, NOON_COLOR);
}


function hsvToRGB(hsvVector: BABYLON.Color3) {
    let r, g, b, i, f, p, q, t, h, s, v;
    h = hsvVector.r / 360, s = hsvVector.g, v = hsvVector.b,
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return new BABYLON.Color3(
        r,
        g,
        b
    );
}

const interpolateColors = (
    color1: BABYLON.Color3,
    color2: BABYLON.Color3,
    mixScalar: number,
) => {
    color1.toHSV()
}