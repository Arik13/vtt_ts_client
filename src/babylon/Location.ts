import {MeshData} from "./LocationData";
import {LocationView, LocationViewListener} from "./LocationView";
import {LocationModel} from "./LocationModel";
import {PlanarCamera} from "./Camera";
import { Asset } from '@shared/Assets/Asset';

export class Location implements LocationViewListener { // Controller
    model: LocationModel;
    view: LocationView;
    inputs: BABYLON.ICameraInput<PlanarCamera>[];
    constructor(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement,
        locationData: Asset.LocationModel,
        mapMeshData: MeshData,
        )
    {
        this.view = new LocationView(
            engine,
            this,
            canvas,
        );
        console.log(locationData);
        this.model = new LocationModel(
            locationData.files * locationData.tileWidth,
            locationData.ranks * locationData.tileLength,
            locationData.files,
            locationData.ranks,
        );
        this.view.addMap (
            mapMeshData,
            this.model.getWidth(),
            this.model.getHeight(),
            new BABYLON.Vector3(0, 0, 0),
            1,
        );
        this.view.buildGridLines(
            locationData.ranks,
            locationData.files,
            locationData.files * locationData.tileWidth,
            locationData.ranks * locationData.tileLength,
        );
    }
    addToken(rank: number, file: number, tokenModel: MeshData) {
        this.view.addToken(
            tokenModel,
            this.model.getGridElementWidth(),
            this.model.getGridElementHeight(),
            this.model.calcPosition(rank, file),
            3
        );
    }
    tokenSelected(tokenID: string) {
        tokenID;
    }
    getCamera(): PlanarCamera {
        return this.view.getCamera() as PlanarCamera;
    }
    setInputs(inputs: BABYLON.ICameraInput<PlanarCamera>[]) {
        this.view.setInputs(inputs);
    }
    render() {
        this.view.render();
    }
}