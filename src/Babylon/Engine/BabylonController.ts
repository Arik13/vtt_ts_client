/*
    The babylon controller is the top most object responsible for controlling rendering.
    On construction it:
        - initializes the babylon engine
        - sets up a render loop
        - sets up a resize listener
    It has access to the location store, and can be told to render any location in the store.
    It also passes input to the views.
*/

import {INPUT_EVENT, inputBus, InputEvent, InputReciever} from "@/Babylon/Input/InputBus";
import {MeshData} from "./MeshData";
import {Location} from "@/Babylon/Locations/Location";
import {Asset} from "@shared/Assets/Asset"
import "babylonjs";

import {imageStore} from "@/GameStores/ImageStore";
import {locationStore} from "@/GameStores/LocationStore";

class BabylonController implements InputReciever{
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
    activeLocation: Location;
    activeLocationID: string = null;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        inputBus.registerReciever(this);
        this.engine = new BABYLON.Engine(canvas, true);     // Generate the BABYLON 3D engine
        canvas.addEventListener('contextmenu', event => event.preventDefault());

        // Watch for browser/canvas resize events
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => {
            if (this.activeLocation) {
                this.activeLocation.render();
            }
        });
    }
    recieveEvent(evt: InputEvent) {
        switch(evt.type) {
            case INPUT_EVENT.LEFT_DOWN:
                return this.getActiveView().trySelect();
            case INPUT_EVENT.LEFT_DOWN_MOVE:
                if (this.getActiveView().hasSelection()) {
                    const view = this.getActiveView();
                    const model = this.getActiveModel();
                    const currentPosition = view.getCurrentCursorPosition();
                    if (currentPosition) {
                        const newPosition = model.findClosestTileCenter(currentPosition);
                        view.setSelectionPosition(newPosition);
                    }
                }
                break;
            case INPUT_EVENT.LEFT_UP_MOVE:
                break;
        }
    }
    resize() {
        this.engine.resize();
    }
    getActiveView() {
        return this.activeLocation.view;
    }
    getActiveModel() {
        return this.activeLocation.model;
    }
    getActiveLocation() {
        return this.activeLocation;
    }
    setActiveLocation(id: string) {
        const locationData = locationStore.get(id);
        if (locationData) {
            if (this.activeLocation) {
                this.getActiveView().detachControl();
            }
            this.activeLocation = this.createLocation(this.engine, this.canvas, locationData);
            this.getActiveView().attachControl();
        }
    }
    private createLocation(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement,
        locationData: Asset.LocationData,
        )
    {
        // construct map meshdata
        const mapImageData = imageStore.get(locationData.mapImageID);
        let url = null;
        if (mapImageData) {
            const blob = new Blob([mapImageData.fileBuffer]);
            url = URL.createObjectURL(blob);
        }
        const locationMapName = locationData.name + " Map";
        const mapMeshData = new MeshData(url, locationMapName, locationMapName);

        // construct model data
        locationData.model

        // Create location
        const location = new Location(engine, canvas, locationData.model, mapMeshData);

        // Add Stuff


        // Return
        return location;
    }
}
let babylonController = null as BabylonController;

const initializeBabylon = function (canvas: HTMLCanvasElement): BabylonController {
    babylonController = new BabylonController(canvas)
    return babylonController;
}

export {
    babylonController,
    initializeBabylon,
};