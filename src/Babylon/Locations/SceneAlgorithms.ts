import { MeshData } from '../Engine/MeshData';

export const createPickPlane = (width: number, length: number, scene: BABYLON.Scene) => {
    const pickPlane = BABYLON.Mesh.CreateGround("pickPlane", width, length, 1, scene, false);
    pickPlane.checkCollisions = true;
    const pickPlaneMaterial = new BABYLON.StandardMaterial("pickPlaneMaterial", scene);
    pickPlaneMaterial.specularColor = BABYLON.Color3.Black();
    pickPlane.alphaIndex = 4;

    pickPlaneMaterial.emissiveTexture = new BABYLON.Texture(
        null,// tokenModel.texturePath,
        scene,
    );
    pickPlaneMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    pickPlaneMaterial.opacityTexture = new BABYLON.Texture(
        null, // tokenModel.texturePath,
        scene,
        false,
        true,
        BABYLON.Texture.NEAREST_SAMPLINGMODE
    );
    pickPlane.material = pickPlaneMaterial;
    return pickPlane;
}

export const createMesh = (
    meshData: MeshData,
    width: number,
    height: number,
    position: BABYLON.Vector3,
    alphaIndex: number,
    scene: BABYLON.Scene
) => {

    const mesh = BABYLON.MeshBuilder.CreatePlane(
        meshData.meshName,
        {width, height, sideOrientation: BABYLON.Mesh.DOUBLESIDE},
        scene,
    );
    mesh.setPositionWithLocalVector(new BABYLON.Vector3(position.x, position.y, position.z));
    mesh.addRotation(Math.PI/2, 0, 0);
    mesh.alphaIndex = alphaIndex;
    mesh.material = buildStandardMaterial(meshData.texturePath, meshData.materialName, scene);
    return mesh;
}

export const buildStandardMaterial = (texturePath: string, name: string, scene: BABYLON.Scene) => {
    const meshMaterial = new BABYLON.StandardMaterial(name, scene);
    meshMaterial.maxSimultaneousLights = 16;
    meshMaterial.diffuseTexture = new BABYLON.Texture(texturePath, scene);
    meshMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    meshMaterial.opacityTexture = new BABYLON.Texture(
        texturePath,
        scene,
        false,
        true,
        BABYLON.Texture.NEAREST_SAMPLINGMODE
    );
    return meshMaterial;
}

export const buildGridLines = (
    ranks: number,
    files: number,
    width: number,
    length: number,
    scene: BABYLON.Scene
) => {
    const hiZ = width/2;
    const loZ = -width/2;
    const hiX = length/2;
    const loX = -length/2;
    const height = 0;
    const tubes: BABYLON.Mesh[] = [];
    const tubeMaterial = new BABYLON.StandardMaterial("gridmaterial", scene);
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
                scene
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
                scene
            );
            tubes.push(tube);
        }
    }
    const grid = BABYLON.Mesh.MergeMeshes(tubes);
    grid.material = tubeMaterial;
    grid.alphaIndex = 2;
    grid.isPickable = false;
}
export const buildScene = (engine: BABYLON.Engine) => {
    const scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.getBoundingBoxRenderer().frontColor = BABYLON.Color3.Red();
    scene.getBoundingBoxRenderer().backColor = BABYLON.Color3.Red();
    return scene;
}

export const buildPipeline = (scene: BABYLON.Scene) => {
    const pipeline = new BABYLON.DefaultRenderingPipeline(
        "pipeline", // The name of the pipeline
        true, // Do you want the pipeline to use HDR texture?
        scene, // The scene instance
        scene.cameras // The list of cameras to be attached to
    );
    pipeline.samples = 4;
    pipeline.fxaaEnabled = true;
    return pipeline;
}

var line2D = function(name: string, options: any, scene: BABYLON.Scene) {

    let positions: any[] = [];
    let indices: any[] = [];
    let normals: any[] = [];
    let uvs: any[] = [];

    let customMesh = new BABYLON.Mesh(name, scene);
    let vertexData = new BABYLON.VertexData();

    //Assign positions and indices to vertexData
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(customMesh);
    return customMesh;
}