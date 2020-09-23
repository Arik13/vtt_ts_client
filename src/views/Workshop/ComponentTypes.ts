import { Component } from 'vue';

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
            text: string;
            choiceID: string;
        }[];
    }
    export interface ChooseOneWithSub {
        header: string;
        choices: {
            header: string;
            choiceID: string;
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
        buttons: {
            header: string;
            choiceID: string;
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
    prop: COMPONENT_PROP.TextBlock;
}
export interface DynamicListDefinition {
    name: COMPONENT_NAME.DYNAMIC_LIST;
    prop: COMPONENT_PROP.DynamicList;
}
export interface ChooseSomeDefinition {
    name: COMPONENT_NAME.CHOOSE_SOME;
    prop: COMPONENT_PROP.ChooseSome;
}
export interface ChooseOneWithSubDefinition {
    name: COMPONENT_NAME.CHOOSE_ONE_W_SUB;
    prop: COMPONENT_PROP.ChooseOneWithSub;
}
export interface TabsDefinition {
    name: COMPONENT_NAME.TABS;
    prop: COMPONENT_PROP.Tabs;
}
export interface GridButtonsDefinition {
    name: COMPONENT_NAME.GRID_BUTTONS;
    prop: COMPONENT_PROP.GridButtons;
}
export type ComponentDefinition =
    TextBlockDefinition |
    DynamicListDefinition |
    ChooseSomeDefinition |
    ChooseOneWithSubDefinition |
    TabsDefinition |
    GridButtonsDefinition;