import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

export class ImageStore extends AssetStore<Asset.ImageInfo> {
    constructor() {
        super("Image Store");
    }
}
const imageStore = new ImageStore();

export {imageStore};
