import {MeshData} from "./LocationData";
import {LocationView, LocationViewListener} from "./LocationView";
import {LocationModel} from "./LocationModel";
import {PlanarCamera} from "./Camera";

export class Location implements LocationViewListener { // Controller
    model: LocationModel;
    view: LocationView;
    inputs: BABYLON.ICameraInput<PlanarCamera>[];
    constructor(
        engine: BABYLON.Engine,
        map: MeshData,
        canvas: HTMLCanvasElement,
        )
    {
        this.view = new LocationView(
            engine,
            this,
            canvas,
        );
        this.model = new LocationModel(
            100,
            100,
            11,
            11,
        );
        this.view.addMap (
            map,
            this.model.getWidth(),
            this.model.getHeight(),
            new BABYLON.Vector3(0, 0, 0),
            1,
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