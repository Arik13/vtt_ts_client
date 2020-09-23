import { Component } from 'vue';
import {COMPONENT_NAME} from "./ComponentTypes";

const componentMap = new Map<COMPONENT_NAME, Component>();


import Textblock from "./Components/Textblock.vue";
componentMap.set(COMPONENT_NAME.TEXT_BLOCK, Textblock);

import DynamicList from "./Components/DynamicList.vue";
componentMap.set(COMPONENT_NAME.DYNAMIC_LIST, DynamicList);

import CappedSelectBox from "./Components/CappedSelectBox.vue";
componentMap.set(COMPONENT_NAME.CHOOSE_SOME, CappedSelectBox);

import ExpandingRadioForm from "./Components/ExpandingRadioForm.vue";
componentMap.set(COMPONENT_NAME.CHOOSE_ONE_W_SUB, ExpandingRadioForm);

import Tabs from "./Components/Tabs.vue";
componentMap.set(COMPONENT_NAME.TABS, Tabs);

import GridButtons from "./Components/GridButtons.vue";
componentMap.set(COMPONENT_NAME.GRID_BUTTONS, GridButtons);

export default componentMap;