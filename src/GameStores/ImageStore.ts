import {Asset} from "@shared/Assets/Asset"

export class ImageStore {
    images: Asset.ImageInfo[];
    setImages(images: Asset.ImageInfo[]) {
        this.images = images;
    }
    getImage(id: string) {
        for (let i = 0; i < this.images.length; i++) {
            if (this.images[i]._id == id) {
                return this.images[i];
            }
        }
    }
}

const imageStore = new ImageStore();

export {imageStore};