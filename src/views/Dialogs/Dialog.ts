import LocationViewer from "./ConcreteDialogs/LocationViewer.vue";
import ImageViewer from "./ConcreteDialogs/ImageViewer.vue";
import CreateDirectory from "./ConcreteDialogs/CreateDirectory.vue";
import UpdateDirectory from "./ConcreteDialogs/UpdateDirectory.vue";
import CreateLocation from "./ConcreteDialogs/CreateLocation.vue";
import CreateToken from "./ConcreteDialogs/CreateToken.vue";
import CreateScript from "./ConcreteDialogs/CreateScript.vue";
import CreateComponent from "./ConcreteDialogs/CreateComponent.vue";
import DynamicComponent from "./ConcreteDialogs/DynamicComponent.vue";
import {DialogObject} from "./DialogObject";
import * as Asset from "@shared/Assets/Asset";

type ItemPair = {name: string, id: string};
export const dialogMap = new Map<string, DialogObject<any>>();

export enum DIALOG_NAME {
    IMAGE_VIEWER = "imageViewer",
    CREATE_TOKEN = "createToken",
    CREATE_LOCATION = "createLocation",
    LOCATION_VIEWER = "locationViewer",
    CREATE_DIRECTORY = "createDirectory",
    UPDATE_DIRECTORY = "updateDirectory",
    DIALOG_OBJECT = "dialogObject",
    CREATE_SCRIPT = "createScript",
    CREATE_COMPONENT = "createComponent",
    DYNAMIC_COMPONENT = "dynamicComponent",
}

export interface LocationViewerState {
    mapImageSrc: string;
    location: Asset.Location.Data;
}

export interface ImageViewerState {
    imageSrc: string;
}
export interface CreateDirectoryState {
    parentID: string;
    name: string;
}
export interface UpdateDirectoryState {
    directoryID: string;
    name: string;
}
export interface CreateLocationState {
    location: Asset.Location.Data;
    imageItems: ItemPair[];
}
export interface CreateTokenState {
    x: number;
    z: number;
    width: number;
    length: number;
    label: string;
    imageID: string;
    soID: string;
    soItems: ItemPair[];
}
export interface CreateScriptState {
    name: string;
    type: string;
}
export interface CreateComponentState {
    name: string;
}
export interface DynamicComponentState {
    cds: any;
}

const blankLocationViewerState = {
    mapImageSrc: "",
    location: {
        name: "",
        locationModel: {
            ranks: 0,
            files: 0,
            tileWidth: 0,
            tileLength: 0,
        },
        mapImageID: null as string,
        tokenIDs: [] as string[],
    } as Asset.Location.Data
}
const createDirectoryBlankState = {
    parentID: "",
    name: "New Directory",
}
const updateDirectoryBlankState = {
    directoryID: "",
    name: "",
}
const createLocationBlankState = {
    location: {
        name: "Location 1",
        locationModel: {
            files: 40,
            ranks: 40,
            tileLength: 5,
            tileWidth: 5,
        },
        mapImageID: "" as string,
        tokenIDs: [] as string[],
    } as Asset.Location.Data,
    imageItems: [] as ItemPair[],
}
const createTokenBlankState = {
    x: 20,
    z: 20,
    width: 5,
    length: 5,
    label: "test",
    soID: null as string,
    imageID: null as string,
    soItems: [] as ItemPair[],
}
const createScriptBlankState = {
    name: "",
    type: "Modification",
}
const createComponentBlankState = {
    name: "",
}
const dynamicComponentBlankState = {
    cds: {},
}

export const dialogs = [
    {name: DIALOG_NAME.LOCATION_VIEWER, component: LocationViewer, prop: new DialogObject<LocationViewerState>(blankLocationViewerState)},
    {name: DIALOG_NAME.IMAGE_VIEWER, component: ImageViewer, prop: new DialogObject<ImageViewerState>({imageSrc: ""})},
    {name: DIALOG_NAME.CREATE_DIRECTORY, component: CreateDirectory, prop: new DialogObject<CreateDirectoryState>(createDirectoryBlankState)},
    {name: DIALOG_NAME.UPDATE_DIRECTORY, component: UpdateDirectory, prop: new DialogObject<UpdateDirectoryState>(updateDirectoryBlankState)},
    {name: DIALOG_NAME.CREATE_LOCATION, component: CreateLocation, prop: new DialogObject<CreateLocationState>(createLocationBlankState)},
    {name: DIALOG_NAME.CREATE_TOKEN, component: CreateToken, prop: new DialogObject<CreateTokenState>(createTokenBlankState)},
    {name: DIALOG_NAME.CREATE_SCRIPT, component: CreateScript, prop: new DialogObject<CreateScriptState>(createScriptBlankState)},
    {name: DIALOG_NAME.CREATE_COMPONENT, component: CreateComponent, prop: new DialogObject<CreateComponentState>(createComponentBlankState)},
    {name: DIALOG_NAME.DYNAMIC_COMPONENT, component: DynamicComponent, prop: new DialogObject<DynamicComponentState>(dynamicComponentBlankState)},
];


// createToken: {
//     on: false,
//     state: {
//         x: 20,
//         z: 20,
//         width: 5,
//         length: 5,
//         label: "test",
//         imageID: null,
//     }
// },
// createLocation: {
//     on: false,
//     state: {
//         mapImageID: "",
//         name: "Location 1",
//         files: 40,
//         ranks: 40,
//         tileLength: 5,
//         tileWidth: 5,
//     }
// },