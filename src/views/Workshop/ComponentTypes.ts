export enum COMPONENT_TYPE {
    PARAGRAPH = "Paragraph",
    DYNAMIC_LIST = "Dynamic List",
    CHOOSE_ONE = "Choose One",
    CHOOSE_SOME = "Choose Some",
    CHOOSE_MANY = "Choose Many",
    CHOOSE_ONE_W_SUB = "Choose One With Sub",
    CHOOSE_SOME_W_SUB = "Choose Some With Sub",
    CHOOSE_MANY_W_SUB = "Choose Many With Sub",
}
export namespace COMPONENT_PROP {
    export interface Paragraph {
        title: string;
        text: string;
    }
    export interface DynamicList {
        cds: ComponentDefinition[];
    }
    export type ComponentProp =
        Paragraph |
        DynamicList;
}

export interface ComponentDefinition {
    componentType: COMPONENT_TYPE;
    componentProp: COMPONENT_PROP.ComponentProp;
}
export interface DynamicListDefinition extends ComponentDefinition {
    componentProp: COMPONENT_PROP.DynamicList;
}