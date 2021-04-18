import { Component } from 'vue';
import {COMPONENT_NAME} from "./ComponentTypes";

const componentMap = new Map<COMPONENT_NAME, Component>();



// FORM ELEMENTS
import Textblock from "./Textblock.vue";
componentMap.set(COMPONENT_NAME.TEXT_BLOCK, Textblock);

import DynamicList from "./DynamicList.vue";
componentMap.set(COMPONENT_NAME.DYNAMIC_LIST, DynamicList);

import CappedSelectBox from "./CappedSelectBox.vue";
componentMap.set(COMPONENT_NAME.CHOOSE_SOME, CappedSelectBox);

import ExpandingRadioForm from "./ExpandingRadioForm.vue";
componentMap.set(COMPONENT_NAME.CHOOSE_ONE_W_SUB, ExpandingRadioForm);

import Tabs from "./Tabs.vue";
componentMap.set(COMPONENT_NAME.TABS, Tabs);

import GridButtons from "./GridButtons.vue";
componentMap.set(COMPONENT_NAME.GRID_BUTTONS, GridButtons);

import Roller from "./Roller.vue";
componentMap.set(COMPONENT_NAME.ROLLER, Roller);

import Table from "./Table.vue";
componentMap.set(COMPONENT_NAME.TABLE, Table);

import TextField from "./TextField.vue";
componentMap.set(COMPONENT_NAME.TEXT_FIELD, TextField);

// VIEWER ELEMENTS
import ObjectViewer from "./ObjectViewer.vue";
componentMap.set(COMPONENT_NAME.OBJECT_VIEWER, ObjectViewer);

import GridLayout from "./GridLayout.vue";
componentMap.set(COMPONENT_NAME.GRID_LAYOUT, GridLayout);

import ValueBoxGroup from "./ValueBoxGroup.vue";
componentMap.set(COMPONENT_NAME.VALUE_BOX_GROUP, ValueBoxGroup);

import TitleFieldGroup from "./TitleFieldGroup.vue";
componentMap.set(COMPONENT_NAME.TITLE_FIELD_GROUP, TitleFieldGroup);

import CustomTable from "./CustomTable.vue";
componentMap.set(COMPONENT_NAME.CUSTOM_TABLE, CustomTable);

import ExpansionGroup from "./ExpansionGroup.vue";
componentMap.set(COMPONENT_NAME.EXPANSION_GROUP, ExpansionGroup);

export default componentMap;