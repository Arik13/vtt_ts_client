import { Component } from 'vue';
import cds from './cds';

export enum COMPONENT_NAME {
    TEXT_BLOCK = "Text Block",
    DYNAMIC_LIST = "Dynamic List",
    TABS = "Tabs",
    CHOOSE_ONE = "Choose One",
    CHOOSE_SOME = "Choose Some",
    CHOOSE_MANY = "Choose Many",
    CHOOSE_ONE_W_SUB = "Choose One With Sub",
    CHOOSE_SOME_W_SUB = "Choose Some With Sub",
    CHOOSE_MANY_W_SUB = "Choose Many With Sub",
    GRID_BUTTONS = "Grid Buttons",
}

/*
    Some choices represent choosing a modification, other choices represent a
    choosing the value of a parameter of a modification
*/

/*
    The absence of the param field means the choice represents a mod itself
*/
export interface ChoiceData {
    actionTarget: string;
    param: string;
    value: number | string;
}
export namespace COMPONENT_PROP {
    export interface TextBlock {
        header: string;
        paragraphs: string[];
    }
    export interface DynamicList {
        header: string;
        cds: ComponentDefinition[];
    }
    export interface ChooseSome {
        maxSelectable: number;
        header: string;
        label: string;
        choices: {
            header: string;
            data: ChoiceData;
        }[];
    }
    export interface ChooseOneWithSub {
        header: string;
        choices: {
            header: string;
            data: ChoiceData;
            cds: ComponentDefinition[];
        }[];
    }
    export interface Tabs {
        header: string;
        tabs: {
            header: string;
            cds: ComponentDefinition[];
        }[];
    }
    export interface GridButtons {
        header: string;
        rows: number;
        columns: number;
        choices: {
            header: string;
            data: ChoiceData;
        }[];
    }
    export type ComponentProp =
        TextBlock |
        DynamicList |
        ChooseSome |
        ChooseOneWithSub |
        Tabs |
        GridButtons;
}
export interface TextBlockDefinition {
    name: COMPONENT_NAME.TEXT_BLOCK;
    value: COMPONENT_PROP.TextBlock;
}
export interface DynamicListDefinition {
    name: COMPONENT_NAME.DYNAMIC_LIST;
    value: COMPONENT_PROP.DynamicList;
}
export interface ChooseSomeDefinition {
    name: COMPONENT_NAME.CHOOSE_SOME;
    value: COMPONENT_PROP.ChooseSome;
}
export interface ChooseOneWithSubDefinition {
    name: COMPONENT_NAME.CHOOSE_ONE_W_SUB;
    value: COMPONENT_PROP.ChooseOneWithSub;
}
export interface TabsDefinition {
    name: COMPONENT_NAME.TABS;
    value: COMPONENT_PROP.Tabs;
}
export interface GridButtonsDefinition {
    name: COMPONENT_NAME.GRID_BUTTONS;
    value: COMPONENT_PROP.GridButtons;
}
export type ComponentDefinition =
    TextBlockDefinition |
    DynamicListDefinition |
    ChooseSomeDefinition |
    ChooseOneWithSubDefinition |
    TabsDefinition |
    GridButtonsDefinition;