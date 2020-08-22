import {INPUT_EVENT, inputBus, InputEvent, InputReciever} from "./InputBus";
import {MeshData} from "./LocationData";
import {Location} from "./Location";
import {Asset} from "@shared/Assets/Asset"
import "babylonjs";

import {imageStore} from "@/GameStores/ImageStore";
import {locationStore} from "@/GameStores/LocationStore";




// const locations = [
//     // Location 1
//     {
//         // mapMeshData: new MeshData("textures/map.jpg", "Map", "Map Material"),
//         // tokens: [
//         //     {
//         //         position: {rank: 10, file: 10},
//         //         meshData: new MeshData("textures/avatar.png", "Avatar", "Avatar Material"),
//         //     }
//         // ]
//     },
//     // Location 2
//     {
//         mapMeshData: new MeshData("textures/map2.jpg", "Map", "Map Material"),
//         tokens: [
//             // {
//             //     position: {rank: 10, file: 10},
//             //     meshData: new MeshData("textures/avatar.png", "Avatar", "Avatar Material"),
//             // }
//         ]
//     },
// ]

class BabylonController implements InputReciever{
    engine: BABYLON.Engine;
    locations: Location[] = [];
    activeLocationIndex: number;
    constructor(canvas: HTMLCanvasElement) {
        inputBus.registerReciever(this);
        this.engine = new BABYLON.Engine(canvas, true);     // Generate the BABYLON 3D engine
        canvas.addEventListener('contextmenu', event => event.preventDefault());
        locationStore.forEach((locationData) => {
            this.locations.push(this.createLocation(this.engine, canvas, locationData));
        });
        // for (let i = 0; i < locations.length; i++) {
        //     // @ts-ignore
        //     this.locations.push(createLocation(this.engine, canvas, locations[i]));
        // }

        // Watch for browser/canvas resize events
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.activeLocationIndex = 0;
        this.getActiveLocation().view.attachControl();

        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => {
            if (this.locations.length) {
                this.locations[this.activeLocationIndex].render();
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
        return this.locations[this.activeLocationIndex].view;
    }
    getActiveModel() {
        return this.locations[this.activeLocationIndex].model;
    }
    getActiveLocation() {
        return this.locations[this.activeLocationIndex];
    }
    setActiveLocation(index: number) {
        this.getActiveLocation().view.detachControl();
        this.activeLocationIndex = index;
        this.getActiveLocation().view.attachControl();
    }
    private createLocation(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement,
        locationData: Asset.LocationData,
        )
    {
        // construct map meshdata
        const mapImageData = imageStore.getImage(locationData.mapImageID);
        const blob = new Blob([mapImageData.fileBuffer]);
        const url = URL.createObjectURL(blob);
        const locationMapName = locationData.name + " Map";
        const mapMeshData = new MeshData(url, locationMapName, locationMapName);

        // construct model data
        locationData.model


        // Create location
        const location = new Location(engine, canvas, locationData.model, mapMeshData);
        // for (const key in locationData.tokens) {
        //     location.addToken(
        //         locationData.tokens[key].position.file,
        //         locationData.tokens[key].position.rank,
        //         locationData.tokens[key].meshData,
        //     );
        // }
        return location;
    }
}

export default function (canvas: HTMLCanvasElement): BabylonController {
    return new BabylonController(canvas);
}