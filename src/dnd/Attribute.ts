import {TitleIDPair} from "./TitleIDPair";

export enum ATTRIBUTE {
    STRENGTH = 1,
    DEXTERITY = 2,
    CONSTITUTION = 3,
    CHARISMA = 4,
    INTELLIGENCE = 5,
    WISDOM = 6,
}

export const ATTRIBUTE_STRINGS: {[key: string]: string} = {
    STRENGTH: "Strength",
    DEXTERITY: "Dexterity",
    CONSTITUTION: "Constitution",
    CHARISMA: "Charisma",
    INTELLIGENCE: "Intelligence",
    WISDOM: "Wisdom",
}

export const ATTRIBUTE_DATA: {[key: string]: TitleIDPair} = {
    STRENGTH: {title: "Strength", ID: ATTRIBUTE.STRENGTH},
    DEXTERITY: {title: "Dexterity", ID: ATTRIBUTE.DEXTERITY},
    CONSTITUTION: {title: "Constitution", ID: ATTRIBUTE.CONSTITUTION},
    CHARISMA: {title: "Charisma", ID: ATTRIBUTE.CHARISMA},
    INTELLIGENCE: {title: "Intelligence", ID: ATTRIBUTE.INTELLIGENCE},
    WISDOM: {title: "Wisdom", ID: ATTRIBUTE.WISDOM},
}