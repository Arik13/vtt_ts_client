import {MeshData} from "@/Babylon/Engine/MeshData"
import lightScene from "@/Babylon/Engine/Lights"
import {cameraFactory, PlanarCamera} from "@/Babylon/Engine/Camera"
import {createPickPlane, createMesh, buildGridLines, buildScene, buildPipeline} from "./SceneAlgorithms";
import { campaignStore } from "@/Stores/CampaignStore";

export interface LocationViewListener {
    tokenSelected(tokenID: string): void;
}

export class LocationView {
    scene: BABYLON.Scene;
    meshes: BABYLON.Mesh[] = [];
    listener: LocationViewListener;
    camera: PlanarCamera;
    canvas: HTMLCanvasElement;
    pickPlane: BABYLON.Mesh;
    pickedMesh: BABYLON.AbstractMesh;
    pickStartingPosition: BABYLON.Vector3;
    pipeline: BABYLON.DefaultRenderingPipeline;
    constructor(
        engine: BABYLON.Engine,
        listener: LocationViewListener,
        canvas: HTMLCanvasElement,
        width: number,
        length: number,
    ) {
        this.listener = listener;
        this.canvas = canvas;

        // this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        this.scene = buildScene(engine);
        const camera = cameraFactory(this.scene);
        this.scene.cameras = [camera];
        this.camera = camera;


        lightScene(this.scene);
        createPickPlane(width, length, this.scene);
        this.detachControl();
        this.pipeline = buildPipeline(this.scene);



    }
    getCamera(): PlanarCamera {
        return this.scene.cameras[0] as PlanarCamera;
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
    addToken(
        tokenModel: MeshData,
        width: number,
        height: number,
        position: BABYLON.Vector3,
        alphaIndex: number
    ) {
        if (!tokenModel) return;
        const mesh = createMesh(
            tokenModel,
            width,
            height,
            position,
            alphaIndex,
            this.scene,
        );
        this.meshes.push(mesh);
    }
    addMap(
        tokenModel: MeshData,
        width: number,
        height: number,
        position: BABYLON.Vector3,
        alphaIndex: number
        ): void
    {
        if (!tokenModel) return;
        const mesh = createMesh(
            tokenModel,
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
            }
        }
        else {
            // this.pickedMesh.showBoundingBox = false;
            if (pick.pickedMesh != this.pickPlane && pick.pickedMesh.isPickable) {
                // if (this.pickedMesh) {
                //     this.pickedMesh.showBoundingBox = false;
                // }
                this.pickedMesh = pick.pickedMesh;
                this.pickedMesh.showBoundingBox = true;
                this.pickStartingPosition = this.getGroundPosition();
                campaignStore.setSelectedToken(pick.pickedMesh.id);
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
    // getPickStartingPosition() {
    //     return this.pickStartingPosition;
    // }
}