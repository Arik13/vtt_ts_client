import {Asset} from "@shared/Assets/Asset";
import {Store} from "./Store";
import {serverProxy, ServerProxy} from "./ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {campaignData} from "./CampaignData";
import {DB} from "@/DB/IndexedDB"
import {arrayBufferToString} from "@/Util/arrayBufferToString"

export class ImageStore extends Store<Asset.ImageInfo> {
    serverProxy: ServerProxy = serverProxy;
    constructor() {
        super("Image Store");
        this.serverProxy.addHandler(EVENT_NAME.IMAGE_DOWNLOADED, this.imageDownloaded);
        this.serverProxy.addHandler(EVENT_NAME.IMAGE_DELETED, this.imageDeleted);
    }
    create(name: string, image: ArrayBuffer) {
        const event: EVENT_TYPE.UPLOAD_IMAGE = {
            campaignID: campaignData.campaignID,
            name: name,
            fileBuffer: image,
        }
        this.serverProxy.emit(EVENT_NAME.UPLOAD_IMAGE, event, (reply: any) => {
            console.log("Reply");
            if (reply.success) {
                console.log("Image Uploaded");
            }
        });
    }
    async delete(id: string) {
        console.log("Deleted: ", id)
        this.deleted(id);
        await DB.deleteImage(id);
        const event: EVENT_TYPE.DELETE_IMAGE = {
            imageID: id
        }
        this.serverProxy.emit(EVENT_NAME.DELETE_IMAGE, event, (reply: any) => {
            console.log(reply)
        });
    }
    private imageDownloaded = async (payload: ArrayBuffer[]) => {
        const imageDataBinary: ArrayBuffer = payload.pop();
        const imageData: Asset.ImageInfo = JSON.parse(arrayBufferToString(imageDataBinary));
        imageData.fileBuffer = payload[0];
        await DB.addImage(imageData);
        this.add(imageData);
    }
    private imageDeleted = async (payload: EVENT_TYPE.IMAGE_DELETED) => {
        this.deleted(payload.imageID);
    }
}
const imageStore = new ImageStore();

export {imageStore};
