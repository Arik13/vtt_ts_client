import {MeshData} from "@/Babylon/Engine/MeshData"
import lightScene from "@/Babylon/Engine/Lights"
import {cameraFactory, PlanarCamera} from "@/Babylon/Engine/Camera"

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
        canvas: HTMLCanvasElement,
        width: number,
        length: number,
    ) {
        this.scene = new BABYLON.Scene(engine);
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;
        this.scene.getBoundingBoxRenderer().frontColor = BABYLON.Color3.Red();
        this.scene.getBoundingBoxRenderer().backColor = BABYLON.Color3.Red();

        const camera = cameraFactory(this.scene);
        this.scene.cameras = [camera];
        this.listener = listener;
        this.camera = camera;
        this.canvas = canvas;
        lightScene(this.scene);
        this.createPickPlane(width, length);
        this.detachControl();
        const pipeline = new BABYLON.DefaultRenderingPipeline(
            "defaultPipeline", // The name of the pipeline
            true, // Do you want the pipeline to use HDR texture?
            this.scene, // The scene instance
            this.scene.cameras // The list of cameras to be attached to
        );
        pipeline.samples = 4;
        pipeline.fxaaEnabled = true;
        this.createTestPlane();
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
        if (!tokenModel) return;
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
        meshMaterial.diffuseTexture = new BABYLON.Texture(
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
        if (!tokenModel) return;
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
    buildGridLines(ranks: number, files: number, width: number, length: number) {
        const hiZ = width/2;
        const loZ = -width/2;
        const hiX = length/2;
        const loX = -length/2;
        const height = 0;
        const tubes: BABYLON.Mesh[] = [];
        const tubeMaterial = new BABYLON.StandardMaterial("tubeMaterial", this.scene);
        tubeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        tubeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

        const tubeMeshSchema = {
            path: [] as BABYLON.Vector3[],
            radius: 0.1,
            tessellation: 3,
            cap: 1,
            arc: 1,
            sideOrientation: BABYLON.Mesh.FRONTSIDE,
        };

        for (let i = 0; i <= ranks; i++) {
            const points = [
                [new BABYLON.Vector3(hiX, height, loZ + ((hiX-loX)/(ranks))*(i)),
                new BABYLON.Vector3(loX, height, loZ + ((hiX-loX)/(ranks))*(i)),],
            ];
            for (let j = 0; j < 1; j++) {
                tubeMeshSchema.path = points[j];
                const tube = BABYLON.MeshBuilder.CreateTube(
                    "tube",
                    tubeMeshSchema,
                    this.scene
                );
                tubes.push(tube);
            }
        }
        for (let i = 0; i <= files; i++) {
            const points = [
                [new BABYLON.Vector3(loX + ((hiZ-loZ)/(files))*(i), height, hiZ),
                new BABYLON.Vector3(loX + ((hiZ-loZ)/(files))*(i), height, loZ),]
            ];
            for (let j = 0; j < 1; j++) {
                tubeMeshSchema.path = points[j];
                const tube = BABYLON.MeshBuilder.CreateTube(
                    "tube",
                    tubeMeshSchema,
                    this.scene
                );
                tubes.push(tube);
            }
        }
        const grid = BABYLON.Mesh.MergeMeshes(tubes);
        grid.material = tubeMaterial;
        grid.alphaIndex = 2;
        grid.isPickable = false;
    }
    createTestPlane() {
        // const meshPlane = BABYLON.MeshBuilder.CreatePlane(
        //     "TestPlaneMesh",
        //     {
        //         width: 100,
        //         height: 100,
        //         sideOrientation: BABYLON.Mesh.DOUBLESIDE
        //     },
        //     this.scene,
        // );
        // meshPlane.addRotation(Math.PI/2, 0, 0);
        // meshPlane.checkCollisions = true;
        // let material = new BABYLON.StandardMaterial("TestPlaneMaterial", this.scene);
        // material.alpha = 0.5;
        // material.diffuseColor = BABYLON.Color3.Red();
        // material.specularColor = BABYLON.Color3.Red();

        // meshPlane.material = material;
    }
    createPickPlane(width: number, length: number) {
        const ground = BABYLON.Mesh.CreateGround("ground", width, length, 1, this.scene, false);
        ground.checkCollisions = true;
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
            // this.pickedMesh.showBoundingBox = false;
            if (pick.pickedMesh != this.pickPlane && pick.pickedMesh.isPickable) {
                // if (this.pickedMesh) {
                //     this.pickedMesh.showBoundingBox = false;
                // }
                this.pickedMesh = pick.pickedMesh;
                this.pickedMesh.showBoundingBox = true;
                this.pickStartingPosition = this.getGroundPosition();
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