// OUTGOING ////////////////////////////////////////////////////////////////////////////////////////////////
import {
    join,
    loadCampaign,
    setActiveLocation,
    getCampaigns,
    deleteCampaign,
    updateClientConfig,
} from "./Campaign/Outgoing";

import {
    createImage,
    deleteImage,
} from "./Image/Outgoing";

import {
    createLocation,
    deleteLocation,
    addToken,
    updateToken,
} from "./Location/Outgoing";

import {
    createDirectory,
    moveDirectory,
    deleteDirectory,
} from "./Directory/Outgoing";

import {
    login,
    logout,
    signup,
} from "./User/Outgoing";

import {
    sendGameEvent,
    doAction,
} from "./Game/Outgoing";

import {
    createScript,
    updateScript,
    deleteScript,
} from "./Script/Outgoing";

import {
    createDynamicComponent,
    updateDynamicComponent,
    deleteDynamicComponent,
} from "./DynamicComponent/Outgoing";


import {
    createStateObject,
    // updateStateObject,
    deleteStateObject,
} from "./StateObject/Outgoing";


////////////////////////////////

export default {
    // CAMPAIGN
    join,
    loadCampaign,
    setActiveLocation,
    getCampaigns,
    deleteCampaign,
    updateClientConfig,

    // IMAGES
    createImage,
    deleteImage,

    // LOCATIONS
    createLocation,
    deleteLocation,
    addToken,
    updateToken,

    // DIRECTORIES
    createDirectory,
    moveDirectory,
    deleteDirectory,

    // USER
    login,
    logout,
    signup,

    // GAME
    sendGameEvent,
    doAction,

    // SCRIPT
    createScript,
    updateScript,
    deleteScript,

    // DYNAMIC COMPONENTS
    createDynamicComponent,
    updateDynamicComponent,
    deleteDynamicComponent,

    // DYNAMIC COMPONENTS
    createStateObject,
    // updateStateObject,
    deleteStateObject,
}

// INCOMING ////////////////////////////////////////////////////////////////////////////////////////////////
import "./Campaign/Incoming";
import "./Image/Incoming";
import "./Location/Incoming";
import "./Directory/Incoming";
import "./Script/Incoming";
import "./DynamicComponent/Incoming";
import "./StateObject/Incoming";
import "./Game/Incoming";