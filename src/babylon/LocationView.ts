import {MeshData} from "./LocationData"
import {cameraFactory, PlanarCamera} from "./Camera"
import lightScene from "./Lights"

// import "babylonjs"

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
    constructor(
        engine: BABYLON.Engine,
        listener: LocationViewListener,
        // inputs: BABYLON.ICameraInput<PlanarCamera>[],
        canvas: HTMLCanvasElement,
    ) {
        this.scene = new BABYLON.Scene(engine);
        this.scene.getBoundingBoxRenderer().frontColor = BABYLON.Color3.Red();
        this.scene.getBoundingBoxRenderer().backColor = BABYLON.Color3.Red();
        const camera = cameraFactory(this.scene);
        this.scene.cameras = [camera];
        this.listener = listener;
        this.camera = camera;
        this.canvas = canvas;
        lightScene(this.scene);
        this.buildGridLines(this.scene);
        this.createPickPlane();
        this.detachControl();
        // const pipeline = new BABYLON.DefaultRenderingPipeline(
        //     "defaultPipeline", // The name of the pipeline
        //     true, // Do you want the pipeline to use HDR texture?
        //     this.scene, // The scene instance
        //     this.scene.cameras // The list of cameras to be attached to
        // );
        // pipeline.samples = 4;
        // pipeline.fxaaEnabled = true;
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
        ): void
    {
        const mesh = this.createMesh(
            tokenModel,
            width,
            height,
            position,
            alphaIndex,
        );
        this.meshes.push(mesh);
    }
    createMesh(
        tokenModel: MeshData,
        width: number,
        height: number,
        position: BABYLON.Vector3,
        alphaIndex: number
        ): BABYLON.Mesh
    {
        const mesh = BABYLON.MeshBuilder.CreatePlane(
            tokenModel.meshName,
            {
                width: width,
                height: height,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE
            },
            this.scene,
        );
        mesh.addRotation(Math.PI/2, 0, 0);
        mesh.setPositionWithLocalVector(new BABYLON.Vector3(position.x, position.y, position.z));
        const meshMaterial = new BABYLON.StandardMaterial(tokenModel.materialName, this.scene);
        mesh.alphaIndex = alphaIndex;
        meshMaterial.emissiveTexture = new BABYLON.Texture(
            tokenModel.texturePath,
            this.scene,
        );
        meshMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        meshMaterial.opacityTexture = new BABYLON.Texture(
            tokenModel.texturePath,
            this.scene,
            false,
            true,
            BABYLON.Texture.NEAREST_SAMPLINGMODE
        );
        mesh.material = meshMaterial;
        // mesh.
        return mesh;
    }
    addMap(
        tokenModel: MeshData,
        width: number,
        height: number,
        position: BABYLON.Vector3,
        alphaIndex: number
        ): void
    {
        const mesh = this.createMesh(
            tokenModel,
            width,
            height,
            position,
            alphaIndex,
        );
        mesh.isPickable = false;
    }
    render() {
        this.scene.render();
    }
    buildGridLines(scene: BABYLON.Scene) {
        const gridLines = 10;
        const hiZ = 50;
        const loZ = -50;
        const hiX = 50;
        const loX = -50;
        const height = 0;
        const tubes: BABYLON.Mesh[] = [];
        const tubeMaterial = new BABYLON.StandardMaterial("tubeMaterial", scene);
        tubeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        const tubeMeshSchema: any = {
            path: [],
            radius: 0.2,
            tessellation: 3,
            cap: 1,
            arc: 1,
            sideOrientation: BABYLON.Mesh.FRONTSIDE,
        };

        for (let i = 0; i <= gridLines + 1; i++) {
            const points = [
                [new BABYLON.Vector3(hiX, height, loZ + ((hiX-loX)/(gridLines+1))*(i)),
                new BABYLON.Vector3(loX, height, loZ + ((hiX-loX)/(gridLines+1))*(i)),],
                [new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, hiZ),
                new BABYLON.Vector3(loX + ((hiZ-loZ)/(gridLines+1))*(i), height, loZ),]
            ];
            for (let j = 0; j < 2; j++) {
                tubeMeshSchema.path = points[j];
                const tube = BABYLON.MeshBuilder.CreateTube(
                    "tube",
                    tubeMeshSchema,
                    scene
                );
                // tube.material = tubeMaterial;
                // tube.alphaIndex = 2;
                // tube.isPickable = false;
                tubes.push(tube);
            }
        }
        const grid = BABYLON.Mesh.MergeMeshes(tubes);
        grid.material = tubeMaterial;
        grid.alphaIndex = 2;
        grid.isPickable = false;
    }
    createPickPlane() {
        const ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, this.scene, false);
        const groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.alphaIndex = 4;

        groundMaterial.emissiveTexture = new BABYLON.Texture(
            null,// tokenModel.texturePath,
            this.scene,
        );
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.opacityTexture = new BABYLON.Texture(
            null, // tokenModel.texturePath,
            this.scene,
            false,
            true,
            BABYLON.Texture.NEAREST_SAMPLINGMODE
        );
        ground.material = groundMaterial;
        this.pickPlane = ground;
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
            // if (pick.pickedMesh == this.pickedMesh) {
            //     this.pickedMesh.showBoundingBox = false;
            //     this.pickedMesh = null;
            // }
            if (pick.pickedMesh != this.pickPlane && pick.pickedMesh.isPickable) {
                // if (pick.pickedMesh.showBoundingBox) {

                // }
                // console.log(pick.pickedMesh.name);
                this.pickedMesh = pick.pickedMesh;
                this.pickedMesh.showBoundingBox = true;
                this.pickStartingPosition = this.getGroundPosition();
                // this.pickedMesh.showBoundingBox = !this.pickedMesh.showBoundingBox;
            }
        }
    }
    getCurrentCursorPosition(): BABYLON.Vector3 {
        return this.getGroundPosition();
    }
    setSelectionPosition(position: BABYLON.Vector3) {
        this.pickedMesh.setAbsolutePosition(position);
    }
    hasSelection() {
        return !!this.pickedMesh;
    }
    getGroundPosition() {
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
    getPickStartingPosition() {
        return this.pickStartingPosition;
    }
}