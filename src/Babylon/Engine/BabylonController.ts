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
import * as Asset from "@shared/Assets/Asset"
import "babylonjs";

import {locationStore, LOCATION_EVENT_NAME, LOCATION_EVENT} from "@/Stores/LocationStore";
import {campaignStore, CampaignSubscriber, CAMPAIGN_EVENT} from "@/Stores/CampaignStore";
import {imageStore} from "@/Stores/ImageStore";
import { tokenStore } from '@/Stores/TokenStore';
import dispatcher from '@/Dispatcher/Dispatcher';
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
            if (this.activeLocation) this.activeLocation.render();
        });
        locationStore.subscribe({
            added: () => {console.log();},
            deleted: (id) => {id; },
            notify: () => {},
            updated: (id: string, event: LOCATION_EVENT.LocationEvent) => {
                if (id != this.activeLocationID) return;
                switch(event.eventName) {
                    case (LOCATION_EVENT_NAME.TOKEN_ADDED): {
                        const tokenEvent = event as LOCATION_EVENT.TokenAddedEvent;
                        const tokenData = tokenEvent.tokenData;
                        const tokenMeshData: MeshData = {
                            texturePath: this.createImageURL(tokenData.imageID),
                            meshName: tokenData.id,
                            materialName: tokenData.imageID
                        }
                        this.getActiveLocation().addToken(
                            tokenData.tokenModel.position.x,
                            tokenData.tokenModel.position.z,
                            tokenMeshData,
                        );
                        break;
                    }
                    case (LOCATION_EVENT_NAME.TOKEN_UPDATED): {
                        const tokenEvent = event as LOCATION_EVENT.TokenUpdatedEvent;
                        const tokenData = tokenEvent.tokenData;
                        this.activeLocation.updateToken(tokenData.id, tokenData);
                        break;
                    }
                    case (LOCATION_EVENT_NAME.TOKEN_DELETED): {
                        const tokenEvent = event as LOCATION_EVENT.TokenDeleteEvent;
                        this.activeLocation.deleteToken(tokenEvent.tokenID);
                        break;
                    }
                }
            }
        });
        campaignStore.subscribe({
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
        })
        if (campaignStore.activeLocationID) {
            this.setActiveLocation(campaignStore.activeLocationID);
        }
    }
    receiveEvent(evt: InputEvent) {
        switch(evt.type) {
            case INPUT_EVENT.LEFT_DOWN: {
                return this.activeLocation.trySelect();
            }
            case INPUT_EVENT.LEFT_DOWN_MOVE: {
                if (this.activeLocation.hasSelection()) {
                    const location = this.activeLocation;
                    const currentPosition = location.getGroundPosition();
                    if (currentPosition) {
                        const pickedMesh = this.activeLocation.pickedMesh;
                        const currentTilePosition = pickedMesh.position;
                        let newPosition = this.activeLocation.findClosestTileCenter(currentPosition);
                        if (this.activeLocation.snapToGridEnabled) {
                            newPosition = this.activeLocation.findClosestTileCenter(currentPosition);
                        }
                        else {
                            newPosition = currentPosition;
                        }
                        if (
                            currentTilePosition.x != newPosition.x ||
                            currentTilePosition.z != newPosition.z
                        ) {
                            location.setSelectionPosition(newPosition);
                        }
                    }
                }
                break;
            }
            case INPUT_EVENT.LEFT_UP: {
                break;
            }
            case INPUT_EVENT.LEFT_UP_MOVE: {
                if (this.activeLocation.hasSelection()) {
                    const location = this.activeLocation;
                    let startPos = this.activeLocation.pickStartingPosition;
                    console.log("BEfore: ", startPos);
                    if (this.activeLocation.snapToGridEnabled) {
                        startPos = this.activeLocation.findClosestTileCenter(startPos);
                    }
                    console.log("After snap: ", startPos);
                    let endPos = location.getGroundPosition();
                    location.pickStartingPosition = endPos;
                    // endPos = this.activeLocation.findClosestTileCenter(endPos);
                    if (this.activeLocation.snapToGridEnabled) {
                        endPos = this.activeLocation.findClosestTileCenter(endPos);
                    }
                    if (
                        startPos.x != endPos.x ||
                        startPos.z != endPos.z
                    ) {
                        const mesh = this.activeLocation.pickedMesh;
                        const token = tokenStore.get(mesh.id);
                        token.tokenModel.position = this.activeLocation.convertToRankFilePos(endPos);
                        dispatcher.updateToken(this.activeLocationID, token);
                    }
                }

                break;
            }
            // case INPUT_EVENT.WHEEL_FORWARDS:
            //     this.getActiveView().zoomIn();
            //     break;
            // case INPUT_EVENT.WHEEL_BACKWARDS:
            //     this.getActiveView().zoomOut();
            //     break;
            case INPUT_EVENT.DELETE: {
                if (this.activeLocation.hasSelection()) {
                    let tokenID = this.activeLocation.pickedMesh.id;
                    console.log("TokenID: ", tokenID);

                    dispatcher.deleteToken(tokenID, this.activeLocationID);
                }
                // this.getActiveView().zoomOut();
                console.log("Delete");
                break;
            }
        }
    }
    resize() {
        this.engine.resize();
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
                this.activeLocation.detachControl();
            }
            this.activeLocation = this.createLocation(this.engine, this.canvas, locationData);
            this.activeLocation.attachControl();
        }
    }
    private createLocation(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement,
        locationData: Asset.Location.Data,
    ) {
        // const t0 = performance.now();
        const url = this.createImageURL(locationData.mapImageID);
        const locationMapName = locationData.name + " Map";
        const mapMeshData = new MeshData(url, locationMapName, locationMapName);

        // Create location
        const location = new Location(engine, canvas, locationData.locationModel, mapMeshData);
        locationData.tokenIDs.forEach((tokenID: string) => {
            const tokenData = tokenStore.get(tokenID);
            const tokenMeshData: MeshData = {
                texturePath: this.createImageURL(tokenData.imageID),
                meshName: tokenData.id,
                materialName: tokenData.imageID
            }
            location.addToken(
                tokenData.tokenModel.position.x,
                tokenData.tokenModel.position.z,
                tokenMeshData,
            );
        })
        // const t1 = performance.now();
        // console.log(`Created the location "${locationData.name}" in ${Math.round(t1 - t0)} milliseconds.`);
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