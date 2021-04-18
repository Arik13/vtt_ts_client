import uniqid from 'uniqid';

export enum CLIENT_EVENT {
    DUMMY_EVENT,

    ACTIVE_LOCATION_UPDATED = "ActiveLocationUpdated",
    LOCATION_ADDED = "LocationAdded",
    LOCATION_UPDATED = "LocationUpdated",
    LOCATION_DELETED = "LocationDeleted",

    TOKEN_ADDED = "TokenAdded",
    TOKEN_UPDATED = "TokenUpdated",
    TOKEN_DELETED = "TokenDeleted",
    SELECTED_TOKEN_UPDATED = "SelectedTokenUpdated",

    DC_ADDED = "DCAdded",
    DC_UPDATED = "DCUpdated",
    DC_DELETED = "DCDeleted",

    IMAGE_ADDED = "ImageAdded",
    IMAGE_UPDATED = "ImageUpdated",
    IMAGE_DELETED = "ImageDeleted",

    ROLL_ADDED = "RollAdded",
    ROLL_UPDATED = "RollUpdated",
    ROLL_DELETED = "RollDeleted",

    SCRIPT_ADDED = "ScriptAdded",
    SCRIPT_UPDATED = "ScriptUpdated",
    SCRIPT_DELETED = "ScriptDeleted",

    STATE_OBJECT_ADDED = "StateObjectAdded",
    STATE_OBJECT_UPDATED = "StateObjectUpdated",
    STATE_OBJECT_DELETED = "StateObjectDeleted",

    INIT_NEW_CAMPAIGN = "InitNewCampaign",
    CAMPAIGN_DELETED = "CampaignDeleted",

    LOGGED_IN = "LoggedIn",
    LOGGED_OUT = "LoggedOut",

    MOUSE_CONTEXT_CHANGED = "MouseContextChanged",

    POINT_TARGETED = "PointTargeted",
    CREATE_LIGHT = "CreateLight",

    ACTION_LOG_STATEMENT_ADDED = "ActionLogStatementAdded",
}

type EventHandler = (eventData: any, key: EventHandlerKey) => void;
type EventHandlerKey = {prefix: "eh-", id: string};
type HandlerSet = Map<EventHandlerKey, EventHandler>;

class EventBus {
    eventHandlers: Map<CLIENT_EVENT, HandlerSet> = new Map();
    constructor() {
        for (let key in CLIENT_EVENT) {
            this.eventHandlers.set(CLIENT_EVENT[key] as CLIENT_EVENT, new Map<EventHandlerKey, EventHandler>());
        }
    }
    registerHandler(eventName: CLIENT_EVENT, handler: EventHandler) {
        let key: EventHandlerKey = {prefix: "eh-", id: uniqid()};
        this.eventHandlers.get(eventName).set(key, handler);
        return key;
    }
    deregisterHandler(eventName: CLIENT_EVENT, key: EventHandlerKey) {
        this.eventHandlers.get(eventName).delete(key);
    }
    registerDisposableHandler(eventName: CLIENT_EVENT, handler: EventHandler) {
        let disposableHandler = (event: any, key: EventHandlerKey) => {
            handler(event, key);
            this.deregisterHandler(eventName, key);
        }
        this.registerHandler(eventName, disposableHandler);
    }
    dispatch(eventName: CLIENT_EVENT, event?: any) {
        console.log(`Dispatching client event ${eventName}: `, event);
        this.eventHandlers.get(eventName).forEach((handler, key) => handler(event, key));
    }
}

const eventBus = new EventBus();

export {
    eventBus
};