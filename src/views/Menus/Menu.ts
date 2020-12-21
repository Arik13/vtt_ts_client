// import VueDialog from "./VueDialog.vue";
// import LocationViewer from "./ConcreteDialogs/LocationViewer.vue";
// import ImageViewer from "./ConcreteDialogs/ImageViewer.vue";
// import CreateDirectory from "./ConcreteDialogs/CreateDirectory.vue";
// import CreateLocation from "./ConcreteDialogs/CreateLocation.vue";
// import CreateToken from "./ConcreteDialogs/CreateToken.vue";
// import {MenuObject} from "./MenuObject"


// export const dialogMap = new Map();

// export enum DIALOG_NAME {
//     IMAGE_VIEWER = "imageViewer",
//     CREATE_TOKEN = "createToken",
//     CREATE_LOCATION = "createLocation",
//     LOCATION_VIEWER = "locationViewer",
//     CREATE_DIRECTORY = "createDirectory",
//     DIALOG_OBJECT = "dialogObject",
// }

// export interface LocationViewerState {
//     mapImageSrc: string;
//     location: {
//         name: string;
//         model: {
//             ranks: number;
//             files: number;
//             tileWidth: number;
//             tileLength: number;
//         }
//     }
// }

// export interface ImageViewerState {
//     imageSrc: string,
// }
// export interface CreateDirectoryState {
//     parentID: string;
//     name: string;
// }
// export interface CreateLocationState {
//     mapImageID: string;
//     name: string;
//     files: number;
//     ranks: number;
//     tileLength: number;
//     tileWidth: number;
//     imageItems: {name: string, id: string}[];
// }
// export interface CreateTokenState {
//     x: number;
//     z: number;
//     width: number;
//     length: number;
//     label: string;
//     imageID: string;
// }

// let blankLocationViewerState = {
//     mapImageSrc: "",
//     location: {
//         name: "",
//         model: {
//             ranks: 0,
//             files: 0,
//             tileWidth: 0,
//             tileLength: 0,
//         }
//     }
// }

// let createDirectoryBlankState = {
//     parentID: "",
//     name: "New Directory",
// }
// let createLocationBlankState = {
//     mapImageID: "",
//     name: "Location 1",
//     files: 40,
//     ranks: 40,
//     tileLength: 5,
//     tileWidth: 5,
//     imageItems: [] as {name: string, id: string}[],
// }
// let createTokenBlankState = {
//     x: 20,
//     z: 20,
//     width: 5,
//     length: 5,
//     label: "test",
//     imageID: null as string,
// }


// export const dialogs = [
//     {name: DIALOG_NAME.LOCATION_VIEWER, component: LocationViewer, prop: new DialogObject<LocationViewerState>(blankLocationViewerState)},
//     {name: DIALOG_NAME.IMAGE_VIEWER, component: ImageViewer, prop: new DialogObject<ImageViewerState>({imageSrc: ""})},
//     {name: DIALOG_NAME.CREATE_DIRECTORY, component: CreateDirectory, prop: new DialogObject<CreateDirectoryState>(createDirectoryBlankState)},
//     {name: DIALOG_NAME.CREATE_LOCATION, component: CreateLocation, prop: new DialogObject<CreateLocationState>(createLocationBlankState)},
//     {name: DIALOG_NAME.CREATE_TOKEN, component: CreateToken, prop: new DialogObject<CreateTokenState>(createTokenBlankState)},
// ];


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