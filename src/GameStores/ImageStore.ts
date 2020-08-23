import {Asset} from "@shared/Assets/Asset";
import {Store} from "./Store";
import {Subscriber} from "./Subscriber";

export class ImageStore extends Store {
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
    getLatestImages(id: number) {
        const subscriber = this.subscribers.get(id);
        const latestImages = []
        for (let i = subscriber.index; i < this.images.length; i++) {
            latestImages.push(this.images[i]);
        }
        subscriber.index = this.images.length;
        return latestImages;
    }
    addImage(image: Asset.ImageInfo) {
        this.images.push(image);
        this.subscribers.forEach((subscriberData) => {
            subscriberData.subscriber.notify(subscriberData.id);
        });
    }
}

const imageStore = new ImageStore();

export {imageStore};