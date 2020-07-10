import {TitleIDPair} from "./TitleIDPair";

export enum ITEM {
    COMPONENT_POUCH = 1,
    ARCANE_FOCUS = 2,
    DUNGEONEERS_PACK = 3,
    EXPLORERS_PACK = 4,
}

export const ITEM_STRINGS: {[key: string]: string} = {
    COMPONENT_POUCH: "Component Pouch",
    ARCANE_FOCUS: "Arcane Focus",
    DUNGEONEERS_PACK: "Dungeoneers Pack",
    EXPLORERS_PACK: "Explorers Pack",
}

export const ITEM_DATA: {[key: string]: TitleIDPair} = {
    COMPONENT_POUCH: {title: ITEM_STRINGS.COMPONENT_POUCH, ID: ITEM.COMPONENT_POUCH},
    ARCANE_FOCUS: {title: ITEM_STRINGS.ARCANE_FOCUS, ID: ITEM.ARCANE_FOCUS},
    DUNGEONEERS_PACK: {title: ITEM_STRINGS.DUNGEONEERS_PACK, ID: ITEM.DUNGEONEERS_PACK},
    EXPLORERS_PACK: {title: ITEM_STRINGS.EXPLORERS_PACK, ID: ITEM.EXPLORERS_PACK},
}