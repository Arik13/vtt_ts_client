import {MeshData} from "@/Babylon/Engine/MeshData";
import {LocationView, LocationViewListener} from "@/Babylon/Locations/LocationView";
import {LocationModel} from "@/Babylon/Locations/LocationModel";
import * as Asset from '@shared/Assets/Asset';
import lightScene from "@/Babylon/Engine/Lights"
import {cameraFactory, PlanarCamera} from "@/Babylon/Engine/Camera"
import {createPickPlane, createMesh, buildGridLines, buildScene, buildPipeline} from "./SceneAlgorithms";
// import {exportTest} from "@/Babylon/Scenes/exportTest"
import * as GUI from 'babylonjs-gui';
// import {SceneLoader} from "babylonjs/Loading/sceneLoader"
// import * as lod from 'babylonjs-loaders';
// BABYLON.SceneLoader.RegisterPlugin(new lod.GLTFFileLoader());

export class Location implements LocationViewListener { // Controller
    // model: LocationModel;
    view: LocationView;
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
    meshes: Map<string, BABYLON.Mesh> = new Map<string, BABYLON.Mesh>();
    camera: PlanarCamera;
    canvas: HTMLCanvasElement;
    pickPlane: BABYLON.Mesh;
    pickedMesh: BABYLON.AbstractMesh;
    pickStartingPosition: BABYLON.Vector3;
    pipeline: BABYLON.DefaultRenderingPipeline;

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

        lightScene(this.scene);

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

    }
    addToken(rank: number, file: number, tokenModel: MeshData) {
        if (!tokenModel) return;
        // let labelPlane = BABYLON.Mesh.CreatePlane(
        //     tokenModel.materialName,
        //     5,
        //     // {
        //     //     width: 5,
        //     //     height: 2.5,
        //     // },
        //     this.scene,
        // );
        // labelPlane.addRotation(Math.PI/2, 0, 0);
        // let textPosition = this.calcRankFilePos(rank, file);
        // textPosition.y += 0.1;
        // textPosition.z -= 3.2;
        // labelPlane.setAbsolutePosition(textPosition)
        // labelPlane.alphaIndex = 100;
        // var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
        //     labelPlane,
        //     1024,
        //     1024,
        //     false,
        //     true,

        // );
        // // MATERIAL
        // var textMaterial = new BABYLON.StandardMaterial("Mat", this.scene);
        // // TEXTURE
        // let textTexture = new BABYLON.DynamicTexture(
        //     tokenModel.materialName,
        //     {width: 512, height: 256},
        //     this.scene,
        //     true,
        // );
        // textTexture.hasAlpha = true;
        // textTexture.drawText(
        //     "TEST",
        //     20,
        //     200,
        //     "bold 200px monospace",
        //     "red",
        //     "transparent",
        //     true,
        //     true,
        // );
        // textMaterial.diffuseTexture = textTexture;
        // textMaterial.specularColor = new BABYLON.Color3(0, 0 , 0);
        // // textMaterial.emissiveTexture = textTexture;
        // // textMaterial.specularTexture = textTexture;

        // // MESH
        // let textMesh = BABYLON.MeshBuilder.CreatePlane(
        //     tokenModel.materialName,
        //     {
        //         width: 5,
        //         height: 2.5,
        //     },
        //     this.scene,
        // );
        // textMesh.material = textMaterial;
        // textMesh.addRotation(Math.PI/2, 0, 0);
        // let textPosition = this.calcRankFilePos(rank, file);
        // textPosition.y += 0.1;
        // textPosition.z -= 3.2;
        // textMesh.setAbsolutePosition(textPosition)
        // textMesh.alphaIndex = 100;


        const mesh = createMesh(
            tokenModel,
            this.gridElementWidth,
            this.gridElementHeight,
            this.calcRankFilePos(rank, file),
            3,
            this.scene,
        );
        this.meshes.set(mesh.id, mesh);
    }
    updateToken(id: string, token: Asset.Token.Data) {
        const tokenMesh = this.meshes.get(id);
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
        const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => {
            return mesh !== this.pickPlane && mesh.isPickable;
        });

        // Deselect picked mesh if empty area clicked
        if (!pick.hit) {
            if (this.pickedMesh) {
                this.pickedMesh.showBoundingBox = false;
                this.pickedMesh = null;
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
                this.pickedMesh.showBoundingBox = true;
                this.pickStartingPosition = this.getGroundPosition();
            }
        }
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
}