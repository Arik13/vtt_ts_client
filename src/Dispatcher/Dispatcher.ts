// OUTGOING ////////////////////////////////////////////////////////////////////////////////////////////////
import {
    join,
    loadCampaign,
    setActiveLocation,
} from "./Campaign/Outgoing";

import {
    createImage,
    deleteImage,
} from "./Image/Outgoing";

import {
    createLocation,
    addToken,
    deleteLocation,
} from "./Location/Outgoing";

import {
    createDirectory,
    moveDirectory,
} from "./Directory/Outgoing";

import {
    login,
    logout,
} from "./User/Outgoing";


////////////////////////////////

export default {
    // CAMPAIGN
    join,
    loadCampaign,
    setActiveLocation,

    // IMAGES
    createImage,
    deleteImage,

    // LOCATIONS
    createLocation,
    addToken,
    deleteLocation,

    // DIRECTORIES
    createDirectory,
    moveDirectory,

    // USER
    login,
    logout,
}



// INCOMING ////////////////////////////////////////////////////////////////////////////////////////////////
import "./Campaign/Incoming";
import "./Image/Incoming";
import "./Location/Incoming";
import "./Directory/Incoming";