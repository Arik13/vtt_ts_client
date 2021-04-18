import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";

export class ImageStore extends AssetStore<Asset.ImageInfo> {
    constructor() {
        super(
            "Image Store",
            CLIENT_EVENT.IMAGE_ADDED,
            CLIENT_EVENT.IMAGE_UPDATED,
            CLIENT_EVENT.IMAGE_DELETED,
        );
    }
}
const imageStore = new ImageStore();

export {imageStore};
