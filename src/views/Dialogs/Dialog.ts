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

export class LocationViewerState {
    mapImageSrc: string = "";
    location: Asset.Location.Data;
}
export class ImageViewerState {
    imageSrc: string = "";
}
export class CreateDirectoryState {
    parentID: string = "";
    name: string = "Directory";
}
export class UpdateDirectoryState {
    directoryID: string = "";
    name: string = "";
}
export class CreateLocationState {
    location: Asset.Location.Data;
    imageItems: ItemPair[] = [];
    constructor() {
        this.location = new Asset.Location.Data();
        this.location.locationModel = {
            files: 40,
            ranks: 40,
            tileLength: 5,
            tileWidth: 5,
        }
        this.location.name = "Location"
    }
}
export class CreateTokenState {
    token: Asset.Token.Data;
    soItems: ItemPair[] = [];
    constructor() {
        this.token = {
            name: "",
            imageID: "",
            soID: "",
            position: {
                x: 20,
                y: 20,
            },
            dimensions: {
                width: 5,
                height: 5,
            }
        }
    }
}
export class CreateScriptState {
    name: string = "";
    type: "MODIFICATION" | "ACTION" = "MODIFICATION";
}
export class CreateComponentState {
    name: string = "";
}
export class DynamicComponentState {
    cds: any = {};
    action: any = {};
}

export const dialogs = {
    imageViewer:        new DialogObject(new ImageViewerState()),
    createToken:        new DialogObject(new CreateTokenState()),
    createLocation:     new DialogObject(new CreateLocationState()),
    locationViewer:     new DialogObject(new LocationViewerState()),
    createDirectory:    new DialogObject(new CreateDirectoryState()),
    updateDirectory:    new DialogObject(new UpdateDirectoryState()),
    createScript:       new DialogObject(new CreateScriptState()),
    createComponent:    new DialogObject(new CreateComponentState()),
    dynamicComponent:   new DialogObject(new DynamicComponentState()),
}

export const dialogArray = [
    {component: LocationViewer,      prop: dialogs.locationViewer},
    {component: ImageViewer,         prop: dialogs.imageViewer},
    {component: CreateDirectory,     prop: dialogs.createDirectory},
    {component: UpdateDirectory,     prop: dialogs.updateDirectory},
    {component: CreateLocation,      prop: dialogs.createLocation},
    {component: CreateToken,         prop: dialogs.createToken},
    {component: CreateScript,        prop: dialogs.createScript},
    {component: CreateComponent,     prop: dialogs.createComponent},
    {component: DynamicComponent,    prop: dialogs.dynamicComponent},
];