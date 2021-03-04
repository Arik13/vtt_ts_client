// import { Component } from 'vue';
// import cds from './cds';

export type DataSelection = {
    path: string[];
    useKey: boolean;
    replaceList: any;
    whiteList: string[];
    blackList: string[];
    case: "titleCase" | "camelCase" | "unchanged" | "snakeCase" | "kebabCase" | "sentenceCase";
};
export interface Style {
    styleType: "checkbox" | "value" | "label";
    direction: "horizontal" | "vertical";
    height: number;
    width: number;
}

export enum COMPONENT_NAME {
    TEXT_BLOCK = "Text Block",
    DYNAMIC_LIST = "Dynamic List",
    ROLLER = "Roller",
    TABS = "Tabs",
    CHOOSE_ONE = "Choose One",
    CHOOSE_SOME = "Choose Some",
    CHOOSE_MANY = "Choose Many",
    CHOOSE_ONE_W_SUB = "Choose One With Sub",
    CHOOSE_SOME_W_SUB = "Choose Some With Sub",
    CHOOSE_MANY_W_SUB = "Choose Many With Sub",
    GRID_BUTTONS = "Grid Buttons",
    TABLE = "Table",
    TEXT_FIELD = "Text Field",

    OBJECT_VIEWER = "Object Viewer",
    GRID_LAYOUT = "Grid Layout",
    VALUE_BOX_GROUP = "Value Box Group",
    SINGLE_BOX_GROUP = "Single Box Group",
    TITLE_FIELD_GROUP = "Title Field Group",
    CUSTOM_TABLE = "Custom Table",
    EXPANSION_GROUP = "Expansion Group",
}

export interface ChoiceData {
    param: string;
    value: number | string | string[] | number[];
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
        param: string;
        choices: {
            header: string;
            value: string;
        }[];
    }
    export interface TextField {
        header: string;
        paragraphs: string[];
        label: string;
        param: string;
    }
    export interface ChooseOneWithSub {
        header: string;
        param: string;
        choices: {
            header: string;
            value: string;
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
        param: string;
        choices: {
            header: string;
            value: string;
        }[];
    }
    export interface Roller {
        header: string;
        headerColumn: {id: string, name: string | number}[];
        rollParam: string;
        idParam: string;
        rollAction: string;
    }
    export interface Table {
        header: string;
        paragraphs: string[];
        headers: string[];
        widths: string[];
        rows: string[][];
    }

    // VIEWER INTERFACES
    export interface ObjectViewer {
        blacklist: string[];
        whitelist: string[];
        path: string[];
        descriptions: any;
    }
    export interface ValueBoxGroup {
        header: string;
        vertical: boolean;
        itemGap: number;
        items: {
            title: {data: DataSelection, style: Style};
            main: {data: DataSelection, style: Style};
            sub: {data: DataSelection, style: Style};
        };
    }
    export interface ExpansionGroup {
        header: string;
        vertical: boolean;
        itemGap: number;
        items: {
            title: {data: DataSelection, style: Style};
            main: {data: DataSelection, style: Style};
        };
    }
    export interface TitleFieldGroup {
        title: DataSelection;
        field: DataSelection;
    }
    export interface CustomTable {
        horizontal: boolean;
        vGap: number;
        hGap: number;
        header: string;
        items: {
            data: DataSelection;
            style: Style;
        }[];
        // items: {path: string[], itemType: string, itemArgs: any, useKey: boolean, width: number}[];
    }
    export interface GridLayout {
        cols: number;
        rows: number;
        vGap: number;
        hGap: number;
        items: {col: string, row: string, cds: ComponentDefinition[]}[];
    }
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
export interface RollerDefinition {
    name: COMPONENT_NAME.ROLLER;
    value: COMPONENT_PROP.Roller;
}
export interface TableDefinition {
    name: COMPONENT_NAME.TABLE;
    value: COMPONENT_PROP.Table;
}
export type ComponentDefinition =
    TextBlockDefinition |
    DynamicListDefinition |
    ChooseSomeDefinition |
    ChooseOneWithSubDefinition |
    TabsDefinition |
    GridButtonsDefinition |
    RollerDefinition |
    TableDefinition;