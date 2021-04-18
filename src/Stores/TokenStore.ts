import * as Asset from "@shared/Assets/Asset";
import {AssetStore} from "./AssetStore";
import { CLIENT_EVENT } from "./EventBus";

class TokenStore extends AssetStore<Asset.Token.Data> {
    constructor() {
        super(
            "Token Store",
            CLIENT_EVENT.TOKEN_ADDED,
            CLIENT_EVENT.TOKEN_UPDATED,
            CLIENT_EVENT.TOKEN_DELETED,
        );
    }
}

const tokenStore = new TokenStore();

export {
    tokenStore,
    TokenStore
};