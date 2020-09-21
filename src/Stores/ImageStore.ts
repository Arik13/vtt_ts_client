import {Asset} from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import {serverProxy} from "./ServerProxy";



export class ImageStore extends AssetStore<Asset.ImageInfo> {
    // serverProxy: ServerProxy = serverProxy;
    constructor() {
        super("Image Store", serverProxy);
    }
    // create(name: string, image: ArrayBuffer, directoryID: string) {
    //     const event: EVENT_TYPE.UPLOAD_IMAGE = {
    //         campaignID: campaignStore.campaignID,
    //         name: name,
    //         fileBuffer: image,
    //         directoryID,
    //     }
    //     this.serverProxy.emit(EVENT_NAME.UPLOAD_IMAGE, event, (reply: any) => {
    //         if (reply.success) {
    //             console.log("Image Uploaded");
    //         }
    //     });
    // }
    // async delete(id: string) {
    //     this.deleted(id);
    //     await DB.deleteImage(id);
    //     const event: EVENT_TYPE.DELETE_IMAGE = {
    //         imageID: id
    //     }
    //     this.serverProxy.emit(EVENT_NAME.DELETE_IMAGE, event, (reply: any) => {
    //         console.log(reply)
    //     });
    // }
}
const imageStore = new ImageStore();

export {imageStore};
