export interface Position {
    rank: number;
    file: number;
}

export interface PositionedMeshData {
    position: Position;
    meshData: MeshData;
}

export interface LocationData {
    mapMeshData: MeshData;
    tokens: PositionedMeshData[];
}

export class MeshData {
    texturePath: string;
    meshName: string;
    materialName: string;
    constructor(
        texturePath: string,
        meshName: string,
        materialName: string
        )
    {
        this.texturePath = texturePath;
        this.meshName = meshName;
        this.materialName = materialName;
    }
}