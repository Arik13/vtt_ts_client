import {MeshData} from "@/Babylon/Engine/MeshData";
// import {LocationViewListener} from "@/Babylon/Locations/LocationView";
import * as Asset from '@shared/Assets/Asset';
import lightScene from "@/Babylon/Engine/Lights"
import {cameraFactory, PlanarCamera} from "@/Babylon/Engine/Camera"
import {createPickPlane, createMesh, buildGridLines, buildScene, buildPipeline, buildStandardMaterial} from "./SceneAlgorithms";
import { campaignStore } from "@/Stores/CampaignStore";
import { createImageURL } from "@/Util/functions";
import { setTimeOfDayLighting } from "./Time";
import { imageStore } from "@/Stores/ImageStore";

export interface LocationViewListener {
    tokenSelected(tokenID: string): void;
}

enum ALPHA_INDEX {
    MAP = 1,
    TOKEN = 3,
}

export class Location implements LocationViewListener { // Controller
    inputs: BABYLON.ICameraInput<PlanarCamera>[];

    gridElementWidth: number;
    gridElementHeight: number;
    files: number;
    ranks: number;
    worldSpace: {width: number, height: number};
    worldSpaceWidth: number;
    worldSpaceHeight: number;

    ////////////////////////////////
    canvas: HTMLCanvasElement;
    scene: BABYLON.Scene;
    camera: PlanarCamera;
    pipeline: BABYLON.DefaultRenderingPipeline;

    meshMap: Map<string, BABYLON.Mesh> = new Map<string, BABYLON.Mesh>();
    pickPlane: BABYLON.Mesh;
    pickedMesh: BABYLON.AbstractMesh;
    pickStartingPosition: BABYLON.Vector3;
    hemiLight: BABYLON.HemisphericLight;

    snapToGridEnabled: boolean;

    timeOfDay: Date;
    constructor(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement,
        asset: Asset.Location.Data,
    ) {
        this.worldSpaceWidth = asset.locationModel.files * asset.locationModel.tileWidth,
        this.worldSpaceHeight = asset.locationModel.ranks * asset.locationModel.tileLength,
        this.ranks = asset.locationModel.files,
        this.files = asset.locationModel.ranks,
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
        this.pickPlane = createPickPlane(this.worldSpaceWidth, this.worldSpaceHeight, this.scene);
        let mesh = this.createPlanarMesh(
            createImageURL(asset.mapImageID),
            imageStore.get(asset.mapImageID).name,
            asset.name,
            {width: this.worldSpaceWidth, height: this.worldSpaceHeight},
            {x: this.ranks / 2 - 0.5, y: this.files / 2 - 0.5},
            ALPHA_INDEX.MAP,
        );
        mesh.isPickable = false;
        buildGridLines(
            this.ranks,
            this.files,
            this.worldSpaceWidth,
            this.worldSpaceHeight,
            this.scene,
        );
        setTimeOfDayLighting(12, 0, 0, this.scene, this.hemiLight);
    }

    deleteToken(id: string) {
        this.meshMap.get(id).dispose();
        this.meshMap.delete(id);
    }
    addToken(token: Asset.Token.Data) {
        let texturePath = createImageURL(token.imageID);
        let mesh = this.createPlanarMesh(
            texturePath,
            token.id,
            token.imageID,
            token.dimensions,
            token.position,
            ALPHA_INDEX.TOKEN
        );
        this.meshMap.set(mesh.id, mesh);
    }
    updateToken(id: string, token: Asset.Token.Data) {
        const tokenMesh = this.meshMap.get(id);
        const position = this.calcRankFilePos(token.position.x, token.position.y);
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
            y: (position.z + halfWorldHeight - 2.5) / this.gridElementHeight,
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
            if (pick.pickedMesh != this.pickPlane && pick.pickedMesh.isPickable) {
                if (this.pickedMesh) {
                    this.pickedMesh.showBoundingBox = false;
                }
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
        const scene = this.camera.getScene();
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY, mesh => mesh == this.pickPlane);
        if (pickinfo.hit) return pickinfo.pickedPoint;
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
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, this.scene);
        sphere.isPickable = false;
        sphere.position = mesh.position.clone();
        sphere.visibility = 0;
        let newPosition = BABYLON.Vector3.Zero();
        newPosition.y += 5;
        let pointLight = new BABYLON.PointLight("pointLight", newPosition, this.scene);
        mesh.addChild(sphere);
        pointLight.parent = sphere;
    }
    private createPlanarMesh(
        texturePath: string,
        meshName: string,
        materialName: string,
        {width, height}: {width: number, height: number},
        {x, y}: {x: number, y: number},
        alphaIndex: ALPHA_INDEX,
    ) {
        const mesh = BABYLON.MeshBuilder.CreatePlane(
            meshName,
            {width, height, sideOrientation: BABYLON.Mesh.DOUBLESIDE},
            this.scene,
        );
        let p = this.calcRankFilePos(x, y);
        mesh.setPositionWithLocalVector(new BABYLON.Vector3(p.x, p.y, p.z));
        mesh.addRotation(Math.PI/2, 0, 0);
        mesh.alphaIndex = alphaIndex;
        mesh.material = buildStandardMaterial(texturePath, materialName, this.scene);
        return mesh;
    }
}