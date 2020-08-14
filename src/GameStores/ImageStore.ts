/*


*/

export class ImageFile {
    _id: string;
    fileBuffer: ArrayBuffer;
    fileType: string;
    name: string;
}

export class ImageStore {
    images: ImageFile[];
    setImages(images: ImageFile[]) {
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