// OUTGOING ////////////////////////////////////////////////////////////////////////////////////////////////
import {
    join,
    loadCampaign,
    setActiveLocation,
    getCampaigns,
    deleteCampaign,
    updateCampaignBindings,
} from "./Campaign/Outgoing";

import {
    createImage,
    deleteImage,
} from "./Image/Outgoing";

import {
    createLocation,
    deleteLocation,
    createToken,
    updateToken,
    deleteToken,
} from "./Location/Outgoing";

import {
    createDirectory,
    updateDirectory,
    deleteDirectory,
    moveDirectory,
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

import {
    createRoll,
    updateRoll,
    deleteRoll,
} from "./Roll/Outgoing";

import {
    createTurnSequence,
    endTurn,
    moveTurn,
    endTurnSequence,
} from "./TurnSequence/Outgoing";

import {
    undo,
    redo,
} from "./Commands/Outgoing";


////////////////////////////////

export default {
    // CAMPAIGN
    join,
    loadCampaign,
    setActiveLocation,
    getCampaigns,
    deleteCampaign,
    updateCampaignBindings,

    // IMAGES
    createImage,
    deleteImage,

    // LOCATIONS
    createLocation,
    deleteLocation,
    createToken,
    updateToken,
    deleteToken,

    // DIRECTORIES
    createDirectory,
    updateDirectory,
    deleteDirectory,
    moveDirectory,

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

    // STATE OBJECTS
    createStateObject,
    // updateStateObject,
    deleteStateObject,

    // ROLL
    createRoll,
    updateRoll,
    deleteRoll,

    // TURN SEQUENCE
    createTurnSequence,
    goNextTurn: endTurn,
    moveTurn,
    endTurnSequence,

    // COMMANDS
    undo,
    redo,
}

// INCOMING ////////////////////////////////////////////////////////////////////////////////////////////////
import "./Campaign/Incoming";
import "./Commands/Incoming";
import "./Image/Incoming";
import "./Location/Incoming";
import "./Directory/Incoming";
import "./Script/Incoming";
import "./DynamicComponent/Incoming";
import "./StateObject/Incoming";
import "./Game/Incoming";
import "./Roll/Incoming";
import "./TurnSequence/Incoming";