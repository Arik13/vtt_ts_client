import { Component } from 'vue';
import {COMPONENT_NAME} from "./ComponentTypes";

const componentMap = new Map<COMPONENT_NAME, Component>();



// FORM ELEMENTS
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

import Roller from "./Components/Roller.vue";
componentMap.set(COMPONENT_NAME.ROLLER, Roller);

import Table from "./Components/Table.vue";
componentMap.set(COMPONENT_NAME.TABLE, Table);

import TextField from "./Components/TextField.vue";
componentMap.set(COMPONENT_NAME.TEXT_FIELD, TextField);

// VIEWER ELEMENTS
import ObjectViewer from "./Components/Viewer/ObjectViewer.vue";
componentMap.set(COMPONENT_NAME.OBJECT_VIEWER, ObjectViewer);

import GridLayout from "./Components/Viewer/GridLayout.vue";
componentMap.set(COMPONENT_NAME.GRID_LAYOUT, GridLayout);

import ValueBoxGroup from "./Components/Viewer/ValueBoxGroup.vue";
componentMap.set(COMPONENT_NAME.VALUE_BOX_GROUP, ValueBoxGroup);

import TitleFieldGroup from "./Components/Viewer/TitleFieldGroup.vue";
componentMap.set(COMPONENT_NAME.TITLE_FIELD_GROUP, TitleFieldGroup);

import CustomTable from "./Components/Viewer/CustomTable.vue";
componentMap.set(COMPONENT_NAME.CUSTOM_TABLE, CustomTable);

export default componentMap;