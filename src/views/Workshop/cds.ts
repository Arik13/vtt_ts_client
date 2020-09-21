import {
    COMPONENT_TYPE,
    COMPONENT_PROP,
    ComponentDefinition,
    DynamicListDefinition,
} from "./ComponentTypes";

const cd1: ComponentDefinition = {
    componentType: COMPONENT_TYPE.PARAGRAPH,
    componentProp: {
        title: "Paragraph",
        text: "Testing out the paragraph component",
    } as COMPONENT_PROP.Paragraph,
}
const cd2: DynamicListDefinition = {
    componentType: COMPONENT_TYPE.DYNAMIC_LIST,
    componentProp: {
        cds: []
    } ,
}
const cd3: ComponentDefinition = {
    componentType: COMPONENT_TYPE.PARAGRAPH,
    componentProp: {
        title: "Sub Paragraph",
        text: "Testing out nested components",
    } as COMPONENT_PROP.Paragraph,
}
cd2.componentProp.cds.push(cd3);

export default [cd1, cd2];