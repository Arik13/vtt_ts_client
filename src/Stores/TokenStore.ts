import {Asset} from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import {serverProxy} from "./ServerProxy";

class TokenStore extends AssetStore<Asset.TokenData> {
    constructor() {
        super("Token Store", serverProxy);
        // this.serverProxy.addHandler(EVENT_NAME.TOKEN_DOWNLOADED, this.tokenDownloaded);
        // this.serverProxy.addHandler(EVENT_NAME.TOKEN_DELETED, this.tokenDeleted);
    }
    // create(token: Asset.TokenData, locationID: string) {
    //     // const event: EVENT_TYPE.CREATE_TOKEN = {
    //     //     locationID: locationID,
    //     //     token: token,
    //     // }
    //     // this.serverProxy.emit(EVENT_NAME.CREATE_TOKEN, event, (reply: any) => {
    //     //     if (reply.success) {
    //     //         console.log("Token Created");
    //     //     }
    //     // });
    // }
    // async delete(id: string) {
    //     this.deleted(id);
    //     // await DB.deleteImage(id);
    //     // const event: EVENT_TYPE.TOKEN_DELETED = {
    //     //     tokenID: id,
    //     // }
    //     // this.serverProxy.emit(EVENT_NAME.DELETE_LOCATION, event, (reply: any) => {
    //     //     console.log(reply)
    //     // });
    // }
    // private tokenDownloaded = async (token: Asset.TokenData) => {
    //     // console.log("Token Downloaded", token);
    //     // // await DB.addToken(token);
    //     // this.add(token);
    // }
    // private tokenDeleted = async (payload: EVENT_TYPE.TOKEN_DELETED) => {
    //     // console.log("Token deleted", payload.tokenID);
    //     // this.deleted(payload.tokenID);
    // }
}

const tokenStore = new TokenStore();

export {
    tokenStore,
    TokenStore
};