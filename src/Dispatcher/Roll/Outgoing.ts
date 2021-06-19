import * as Asset from "@shared/Assets/Asset";
import {locationStore} from "@/Stores/LocationStore";
import {serverProxy} from "@/Stores/ServerProxy";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {DB} from "@/DB/IndexedDB";
import {rollCreated} from "./Incoming"

export const createRoll = async (roll: Asset.Roll.Data) => {
    // const event: EVENT_TYPE.CREATE_ROLL = {
    //     roll: {}
    // }
    // return new Promise<Asset.Roll.Data>((resolve, reject) => {
    //     serverProxy.emit(EVENT_NAME.CREATE_ROLL, event, async (payload: any) => {
    //         payload.success? resolve(rollCreated(payload.event)) : reject();
    //     });
    // })
}

export const updateRoll = async (roll: Asset.Roll.Data) => {
    const event: EVENT_TYPE.UPDATE_ROLL = {
        roll,
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    await serverProxy.emit(EVENT_NAME.UPDATE_ROLL, event, (reply: any) => {});
}

export const deleteRoll = async (id: string) => {
    const event: EVENT_TYPE.DELETE_ROLL = {
        id
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    await serverProxy.emit(EVENT_NAME.DELETE_ROLL, event, (reply: any) => {});
}