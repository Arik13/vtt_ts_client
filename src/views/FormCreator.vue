<template>
<!-- <v-card dark height="100%"> -->
<!-- <div> -->
    <v-card dark height="100%" ref="scriptEditor">
        <splitpanes :push-other-panes="false" height="100%">
            <pane :min-size="40">
                <div style="margin: 20px" height="100%">
                    <v-text-field
                        v-model="activeCD.name"
                        label="Filename"
                        outlined
                        :disabled="!activeCD.id"
                    />
                    <v-label>
                        CD ID: {{ activeCD.id }}
                    </v-label><br>
                    <v-btn @click="saveScript()" :disabled="!activeCD.id">
                        Save Script
                    </v-btn>
                    <v-btn @click="renderForm()" :disabled="!activeCD.id">
                        View
                    </v-btn>
                    <vue-json-editor
                        v-model="json"
                        :show-btns="false"
                        :expandedOnStart="true"
                        mode="code"
                        @json-change="onJsonChange"
                        :disabled="true"
                    />
                </div>
            </pane>
            <pane :min-size="25" :size="25" height="100%">
                <asset-view
                    v-if="directory"
                    title="Component Definitions"
                    :folderMenuItems="folderMenuItems"
                    :menuItems="menuItems"
                    :menuBus="menuHandler"
                    :assetClickEventName="MENU_ITEM_NAME.VIEW_COMPONENT"
                    :directory="directory"
                    height="100%"
                />
            </pane>
        </splitpanes>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import "./Workshop/ComponentMap";
import DynamicList from "./Workshop/Components/DynamicList.vue";

import {ChoiceData} from "./Workshop/ComponentTypes";
import dispatcher from "@/Dispatcher/Dispatcher";
import {GAME_EVENT_NAME, GAME_EVENT_TYPE} from "@shared/Game/GameEvent";
import AssetView from "./components/AssetView.vue";
import {directoryStore} from '@/Stores/DirectoryStore';
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";

// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import 'splitpanes/dist/splitpanes.css';
// @ts-ignore
import VueJsonEditor from 'vue-json-editor'

import { EVENT_NAME } from '@shared/Events/Names';
import {DIALOG_NAME, dialogMap, ImageViewerState, CreateLocationState, LocationViewerState} from "@/views/Dialogs/Dialog";
import { DialogObject } from './Dialogs/DialogObject';
import { scriptStore } from '@/Stores/ScriptStore';
import * as Asset from "@shared/Assets/Asset";
import { spawnCreateDirectoryDialog } from './Dialogs/DialogFactories';
import { dcStore } from '@/Stores/DynamicComponentStore';


const genBlankCD = () => {
    return {id: "", name: "", cd: ""};
}

const assembleCD = (cd: any) => {
    for (let key in cd) {
        if (
            cd[key] &&
            (typeof(cd[key]) == "object" ||
            Array.isArray(cd[key]))
        ) {
            let cdID = null;
            let cdKey = null;
            if (cd[key].cds && typeof(cd[key].cds) == "string") {
                cdID = cd[key].cds;
                cdKey = "cds";
            }
            else if (cd[key].choices && typeof(cd[key].choices) == "string") {
                cdID = cd[key].choices;
                cdKey = "choices";
            }
            if (cdID) {
                let storeCD = dcStore.get(cdID).cd;
                let subCD = JSON.parse(JSON.stringify(storeCD));
                assembleCD(subCD);
                cd[key][cdKey] = subCD;
            }
            else {
                assembleCD(cd[key]);
            }
        }
    }
}

export default Vue.extend({
    data: () => ({
        prop: {
            header: "",
        },
        input: "test",
        nextKey: 0,
        directory: null,
        textAreaHeight: null,
        activeCD: genBlankCD() as Asset.DynamicComponent.Data,
        activeCDDirectory: null,
        folderMenuItems: [
            MENU_ITEMS.CREATE_COMPONENT,
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.DELETE_DIRECTORY,
        ],
        menuItems: [
            MENU_ITEMS.VIEW_COMPONENT,
            MENU_ITEMS.DELETE_COMPONENT,
        ],
        json: {},
        MENU_ITEM_NAME,
    }),
    components: {
        DynamicList,
        AssetView,
        Splitpanes,
        Pane,
        VueJsonEditor,
    },
    methods: {
        renderForm() {
            try {
                this.nextKey++;
                const dialog = dialogMap.get(DIALOG_NAME.DYNAMIC_COMPONENT);
                let cdOriginal = this.activeCD.cd;
                let cd = JSON.parse(JSON.stringify(cdOriginal))
                assembleCD(cd);
                dialog.state.cds = {
                    header: "",
                    cds: cd,
                };

                dialog.show((state) => {
                    const action = state.action;
                })
            }
            catch (error) {
                console.log(error);
            }
        },
        tabber(event: Event) {
            if (!event) return;
            event.preventDefault();
        },
        menuHandler(eventName: MENU_ITEM_NAME, dirID: string) {
            switch(eventName) {
                case (MENU_ITEM_NAME.CREATE_COMPONENT): {
                    const dialog = dialogMap.get(DIALOG_NAME.CREATE_COMPONENT) as DialogObject<any>;
                    dialog.show((state) => {
                        dispatcher.createDynamicComponent({
                            name: state.name,
                            cd: [],
                        }, dirID);
                    });
                    break;
                }
                case (MENU_ITEM_NAME.DELETE_COMPONENT): {
                    const cdID = directoryStore.getDirectory(dirID).itemID;
                    if (cdID == this.activeCD.id) this.activeCD = genBlankCD();
                    dispatcher.deleteDynamicComponent(cdID, dirID);
                    break;
                }
                case (MENU_ITEM_NAME.VIEW_COMPONENT): {
                    const cdID = directoryStore.getDirectory(dirID).itemID;
                    this.activeCDDirectory = dirID;
                    const dc = dcStore.get(cdID);
                    this.activeCD = dc;
                    this.json = dc.cd;
                    break;
                }
                case (MENU_ITEM_NAME.CREATE_DIRECTORY): {
                    spawnCreateDirectoryDialog(dirID);
                    break;
                }
                case (MENU_ITEM_NAME.DELETE_DIRECTORY): {
                    dispatcher.deleteDirectory(dirID);
                    break;
                }
            }
        },
        saveScript() {
            try {
                const json = JSON.parse(JSON.stringify(this.json));
                this.activeCD.cd = this.json
                dispatcher.updateDynamicComponent(this.activeCD, this.activeCDDirectory);
            }
            catch {
                console.log("Invalid JSON");
            }
        },
        onJsonChange(value: any) {

        },
    },
    mounted() {
        this.directory = directoryStore.getRoot().children[4];
        // let scriptEditor = this.$refs.scriptEditor as Vue;
        // let textArea = this.$refs.textarea as Vue;
        // let scriptEditorEl = scriptEditor.$el;
        // let textAreaEl = textArea.$el;
        // let scriptEditorHeight = scriptEditorEl.clientHeight;
        // let textAreaHeight = textAreaEl.clientHeight;
        // this.textAreaHeight = String(scriptEditorHeight - textAreaHeight - 100) + "px";
    }
})
</script>

<style>
.jsoneditor-vue {
    height: 600px;
    /* background-color: black; */
}
table.jsoneditor-search div.jsoneditor-frame {
    background-color: gray;
}
div.jsoneditor-menu > div.jsoneditor-modes > button:active {
  background-color: rgba(255,255,255,0.3);
}
div.jsoneditor-menu > div.jsoneditor-modes > button:hover {
  background-color: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
}
div.jsoneditor {
  color: #1A1A1A;
  border: 1px solid #333333;
}
div.jsoneditor-menu {
  color: white;
  background-color: #333333;
  border-bottom: 1px solid #333333;
}
</style>