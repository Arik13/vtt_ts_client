/*
    The babylon controller is the top most object responsible for controlling rendering.
    On construction it:
        - initializes the babylon engine
        - sets up a render loop
        - sets up a resize listener
    It has access to the location store, and can be told to render any location in the store.
    It also passes input to the views.
*/

import {INPUT_EVENT, inputBus, InputEvent, InputReceiver} from "@/Babylon/Input/InputBus";
import {MeshData} from "./MeshData";
import {Location} from "@/Babylon/Locations/Location";
import {Asset} from "@shared/Assets/Asset"
import "babylonjs";

import {locationStore, LOCATION_EVENT_NAME, LOCATION_EVENT as LOCATION_EVENT} from "@/Stores/LocationStore";
import {campaignStore, CampaignSubscriber, CAMPAIGN_EVENT} from "@/Stores/CampaignStore";
import {imageStore} from "@/Stores/ImageStore";
import { tokenStore } from '@/Stores/TokenStore';
// import {tokenStore} from "@/Stores/TokenStore";

class BabylonController implements InputReceiver {
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
    activeLocation: Location;
    activeLocationID: string = null;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        inputBus.registerReceiver(this);
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
        locationStore.subscribe({
            added: () => {console.log();},
            deleted: (id) => {id; },
            updated: (id: string, event: LOCATION_EVENT.LocationEvent) => {
                if (id != this.activeLocationID) return;
                switch(event.eventName) {
                    case (LOCATION_EVENT_NAME.TOKEN_ADDED): {
                        const tokenEvent = event as LOCATION_EVENT.TokenAddedEvent;
                        const tokenData = tokenEvent.tokenData;
                        const tokenMeshData: MeshData = {
                            texturePath: this.createImageURL(tokenData.imageID),
                            meshName: tokenData.imageID,
                            materialName: tokenData.imageID
                        }
                        this.getActiveLocation().addToken(
                            tokenData.model.position.x,
                            tokenData.model.position.z,
                            tokenMeshData,
                        );
                        break;
                    }
                }
            }
        });
        const campaignSubscriber: CampaignSubscriber = {
            added: () => {
                console.log();
            },
            deleted: () => {
                console.log();
            },
            updated: (id: string, event: CAMPAIGN_EVENT) => {
                switch(event) {
                    case (CAMPAIGN_EVENT.ACTIVE_LOCATION_UPDATED):
                        this.setActiveLocation(id);
                        break;
                }
            }
        }
        campaignStore.addSubscriber(campaignSubscriber)
        if (campaignStore.activeLocationID) {
            this.setActiveLocation(campaignStore.activeLocationID);
        }
    }
    receiveEvent(evt: InputEvent) {
        switch(evt.type) {
            case INPUT_EVENT.LEFT_DOWN: {
                return this.getActiveView().trySelect();
            }
            case INPUT_EVENT.LEFT_DOWN_MOVE: {
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
            }
            case INPUT_EVENT.LEFT_UP_MOVE: {
                break;
            }
            // case INPUT_EVENT.WHEEL_FORWARDS:
            //     this.getActiveView().zoomIn();
            //     break;
            // case INPUT_EVENT.WHEEL_BACKWARDS:
            //     this.getActiveView().zoomOut();
            //     break;
            case INPUT_EVENT.DELETE: {
                // this.getActiveView().zoomOut();
                console.log("Delete");
                break;
            }
        }
    }
    resize() {
        this.engine.resize();
    }
    getActiveView() {
        if (this.activeLocation) {
            return this.activeLocation.view;
        }
    }
    getActiveModel() {
        if (this.activeLocation) {
            return this.activeLocation.model;
        }
    }
    getActiveLocation() {
        return this.activeLocation;
    }
    getActiveLocationID() {
        return this.activeLocationID;
    }
    setActiveLocation(id: string) {
        this.activeLocationID = id;
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
        const t0 = performance.now();
        const url = this.createImageURL(locationData.mapImageID);
        const locationMapName = locationData.name + " Map";
        const mapMeshData = new MeshData(url, locationMapName, locationMapName);

        // Create location
        const location = new Location(engine, canvas, locationData.model, mapMeshData);
        locationData.tokenIDs.forEach((tokenID: string) => {
            const tokenData = tokenStore.get(tokenID);
            const tokenMeshData: MeshData = {
                texturePath: this.createImageURL(tokenData.imageID),
                meshName: tokenData.imageID,
                materialName: tokenData.imageID
            }
            location.addToken(
                tokenData.model.position.x,
                tokenData.model.position.z,
                tokenMeshData,
                );
            })
        const t1 = performance.now();
        console.log(`Created the location "${locationData.name}" in ${Math.round(t1 - t0)} milliseconds.`);
        return location;
    }
    private createImageURL(imageID: string) {
        // construct map meshdata
        const mapImageData = imageStore.get(imageID);
        let url = null;
        if (mapImageData) {
            const blob = new Blob([mapImageData.fileBuffer]);
            url = URL.createObjectURL(blob);
            return url;
        }
    }
}
let babylonController = null as BabylonController;

const initializeBabylon = function (canvas: HTMLCanvasElement): BabylonController {
    babylonController = new BabylonController(canvas)
    return babylonController;
}

export {
    BabylonController,
    babylonController,
    initializeBabylon,
};