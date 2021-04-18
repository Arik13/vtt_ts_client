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

import {locationStore} from "@/Stores/LocationStore";
import {campaignStore} from "@/Stores/CampaignStore";
import {imageStore} from "@/Stores/ImageStore";
import { tokenStore } from '@/Stores/TokenStore';
import {createImageURL} from "@/Util/functions"
import dispatcher from '@/Dispatcher/Dispatcher';
import { eventBus, CLIENT_EVENT } from "@/Stores/EventBus";
import { globalMouseContext, MOUSE_CONTEXT } from "@/Stores/MouseContext";
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
        window.addEventListener("resize", e => this.engine.resize());

        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => {
            if (this.activeLocation) this.activeLocation.render();
        });
        eventBus.registerHandler(CLIENT_EVENT.TOKEN_ADDED, (tokenID) => {
            let token = tokenStore.get(tokenID);
            const tokenMeshData: MeshData = {
                texturePath: createImageURL(token.imageID),
                meshName: token.id,
                materialName: token.imageID
            }
            this.getActiveLocation().addToken(
                token.tokenModel.position.x,
                token.tokenModel.position.z,
                tokenMeshData,
            );
        });
        eventBus.registerHandler(CLIENT_EVENT.TOKEN_UPDATED, (tokenID) => {
            this.activeLocation.updateToken(tokenID, tokenStore.get(tokenID));
        });
        eventBus.registerHandler(CLIENT_EVENT.TOKEN_DELETED, (tokenID) => {
            this.activeLocation.deleteToken(tokenID);
        });
        eventBus.registerHandler(CLIENT_EVENT.ACTIVE_LOCATION_UPDATED, id => this.setActiveLocation(id));
        if (campaignStore.activeLocationID) {
            this.setActiveLocation(campaignStore.activeLocationID);
        }
        eventBus.registerHandler(CLIENT_EVENT.CREATE_LIGHT, point => this.activeLocation.createLight(point))
    }
    receiveEvent(evt: InputEvent) {
        if (globalMouseContext.context == MOUSE_CONTEXT.TARGETING) {
            if (evt.type == INPUT_EVENT.ALL_UP_MOVE) {
                return;
            }
            let locPoint = this.activeLocation.tryTarget();
            globalMouseContext.setContext(MOUSE_CONTEXT.DEFAULT);
            eventBus.dispatch(CLIENT_EVENT.POINT_TARGETED, locPoint);
            return;
        }
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
                    if (this.activeLocation.snapToGridEnabled) {
                        startPos = this.activeLocation.findClosestTileCenter(startPos);
                    }
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
                    dispatcher.deleteToken(tokenID, this.activeLocationID);
                }
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
        const url = createImageURL(locationData.mapImageID);
        const locationMapName = locationData.name + " Map";
        const mapMeshData = new MeshData(url, locationMapName, locationMapName);

        // Create location
        const location = new Location(engine, canvas, locationData.locationModel, mapMeshData);
        locationData.tokenIDs.forEach(tokenID => {
            const tokenData = tokenStore.get(tokenID);
            const tokenMeshData: MeshData = {
                texturePath: createImageURL(tokenData.imageID),
                meshName: tokenData.id,
                materialName: tokenData.imageID
            }
            location.addToken(
                tokenData.tokenModel.position.x,
                tokenData.tokenModel.position.z,
                tokenMeshData,
            );
        });
        return location;
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