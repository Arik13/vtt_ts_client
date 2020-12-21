import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";

class TokenStore extends AssetStore<Asset.Token.Data> {
    constructor() {
        super("Token Store");
    }
}

const tokenStore = new TokenStore();

export {
    tokenStore,
    TokenStore
};