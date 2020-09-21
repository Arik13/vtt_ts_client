import { Component } from 'vue';
import {COMPONENT_TYPE} from "./ComponentTypes";

const componentMap = new Map<COMPONENT_TYPE, Component>();


import Paragraph from "./Components/Paragraph.vue";
componentMap.set(COMPONENT_TYPE.PARAGRAPH, Paragraph);

import DynamicList from "./Components/DynamicList.vue";
componentMap.set(COMPONENT_TYPE.DYNAMIC_LIST, DynamicList);


export default componentMap;