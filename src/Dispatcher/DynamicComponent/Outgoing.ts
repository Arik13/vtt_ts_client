import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import {dynamicComponentCreated} from "./Incoming"

export const createDynamicComponent = async (dynamicComponent: Asset.DynamicComponent.Data, directoryID: string) => {
    const event: EVENT_TYPE.CREATE_DYNAMIC_COMPONENT = {
        dynamicComponent,
        directoryID,
    }
    return new Promise<Asset.DynamicComponent.Data>((resolve, reject) => {
        serverProxy.emit(EVENT_NAME.CREATE_DYNAMIC_COMPONENT, event, async (payload: any) => {
            payload.success? resolve(dynamicComponentCreated(payload.event)) : reject();
        });
    })
}

export const updateDynamicComponent = async (dynamicComponent: Asset.DynamicComponent.Data, directoryID: string) => {
    const event: EVENT_TYPE.UPDATE_DYNAMIC_COMPONENT = {
        dynamicComponent,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    await serverProxy.emit(EVENT_NAME.UPDATE_DYNAMIC_COMPONENT, event, (reply: any) => {});
}

export const deleteDynamicComponent = async (dcID: string, directoryID: string) => {
    const event: EVENT_TYPE.DELETE_DYNAMIC_COMPONENT = {
        dcID,
        directoryID,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    await serverProxy.emit(EVENT_NAME.DELETE_DYNAMIC_COMPONENT, event, (reply: any) => {});
}