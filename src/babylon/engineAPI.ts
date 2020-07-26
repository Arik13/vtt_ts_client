import {INPUT_EVENT, inputBus, InputEvent, InputReciever} from "./InputBus";
import {MeshData, LocationData} from "./LocationData";
import {Location} from "./Location";
import "babylonjs";


const createLocation = function (
    engine: BABYLON.Engine,
    canvas: HTMLCanvasElement,
    locationData: LocationData,
    )
{
    const location = new Location(engine, locationData.mapMeshData, canvas);
    for (const key in locationData.tokens) {
        location.addToken(
            locationData.tokens[key].position.file,
            locationData.tokens[key].position.rank,
            locationData.tokens[key].meshData,
        );
    }
    return location;
};

const locations = [
    // Location 1
    {
        mapMeshData: new MeshData("textures/map.jpg", "Map", "Map Material"),
        tokens: [
            {
                position: {rank: 10, file: 10},
                meshData: new MeshData("textures/avatar.png", "Avatar", "Avatar Material"),
            }
        ]
    },
    // Location 2
    {
        mapMeshData: new MeshData("textures/map2.jpg", "Map", "Map Material"),
        tokens: [
            // {
            //     position: {rank: 10, file: 10},
            //     meshData: new MeshData("textures/avatar.png", "Avatar", "Avatar Material"),
            // }
        ]
    },
]

class BabylonController implements InputReciever{
    engine: BABYLON.Engine;
    locations: Location[] = [];
    activeLocationIndex: number;
    constructor(canvas: HTMLCanvasElement) {
        // this.test();

        inputBus.registerReciever(this);
        this.engine = new BABYLON.Engine(canvas, true);     // Generate the BABYLON 3D engine
        canvas.addEventListener('contextmenu', event => event.preventDefault());
        for (let i = 0; i < locations.length; i++) {
            this.locations.push(createLocation(this.engine, canvas, locations[i]));
        }

        // Watch for browser/canvas resize events
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.activeLocationIndex = 0;
        this.getActiveLocation().view.attachControl();

        // setInterval(() => {
        //     this.setActiveLocation((this.activeLocationIndex + 1) % 2)
        // }, 1500);
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
}

export default function (canvas: HTMLCanvasElement): BabylonController {
    return new BabylonController(canvas);
}