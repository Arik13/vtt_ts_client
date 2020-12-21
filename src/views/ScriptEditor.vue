<template>
    <v-card dark height="100%" ref="outerEditor">
        <splitpanes :push-other-panes="false" height="100%">
            <pane :min-size="40">
                <div style="margin: 20px">
                    <h3>
                        {{ activeScript.type }}
                    </h3>
                    <br>
                    <v-text-field
                        v-model="activeScript.name"
                        label="Filename"
                        outlined
                        :disabled="!activeScript.id"
                    />
                    <v-checkbox v-model="activeScript.isActive" label="Active" />
                    <prism-editor
                        class="scriptEditor"
                        v-model="activeScript.script"
                        :highlight="highlighter"
                        line-numbers
                        ref="editor"
                        :style="enabledStyle()"
                    />
                    <br>
                    <v-btn
                        @click="saveScript()"
                        :disabled="!activeScript.id"
                    >Save Script</v-btn>
                </div>
            </pane>
            <pane :min-size="25" :size="25">
                <asset-view
                    v-if="scriptDirectory"
                    title="Files"
                    :folderMenuItems="folderMenuItems"
                    :menuItems="menuItems"
                    :menuBus="menuHandler"
                    assetClickEventName="openScript"
                    :directory="scriptDirectory"
                    height="100%"
                />
            </pane>
        </splitpanes>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import AssetView from "./components/AssetView.vue";
import {directoryStore} from '@/Stores/DirectoryStore';
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";

// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import 'splitpanes/dist/splitpanes.css';

import dispatcher from "@/Dispatcher/Dispatcher";
import { EVENT_NAME } from '@shared/Events/Names';
import { dialogMap, DIALOG_NAME } from './Dialogs/Dialog';
import { DialogObject } from './Dialogs/DialogObject';
import { scriptStore } from '@/Stores/ScriptStore';
import * as Asset from "@shared/Assets/Asset";
import { spawnCreateDirectoryDialog } from './Dialogs/DialogFactories';


// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

enum MENU_EVENT_NAME {
    NEW_SCRIPT = "newScript",
}

const genBlankScript = () => {
    const script: Asset.Script.Data = {id: "", name: "", script: "", type: null, isActive: false};
    return script;
}

export default Vue.extend({
    components: {
        "asset-view": AssetView,
        Splitpanes,
        Pane,
        PrismEditor,
    },
    data: () => ({
        folderMenuItems: [
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.CREATE_SCRIPT,
            MENU_ITEMS.DELETE_DIRECTORY,
        ],
        menuItems: [
            MENU_ITEMS.OPEN_SCRIPT,
            MENU_ITEMS.DELETE_SCRIPT,
        ],
        scriptDirectory: null,
        activeScript: genBlankScript() as Asset.Script.Data,
        activeScriptDirectory: null,
        textAreaHeight: "100%",
    }),
    methods: {
        highlighter(code: string) {
            return highlight(code, languages.clike); // languages.<insert language> to return html with markup
        },
        menuHandler(eventName: MENU_ITEM_NAME, dirID: string) {
            switch(eventName) {
                case (MENU_ITEM_NAME.CREATE_SCRIPT): {
                    const dialog = dialogMap.get(DIALOG_NAME.CREATE_SCRIPT) as DialogObject<any>;
                    dialog.show((state) => {
                        dispatcher.createScript({
                            name: state.name,
                            script: "",
                            type: state.type,
                            isActive: false,
                        }, dirID);
                    });
                    break;
                }
                case (MENU_ITEM_NAME.DELETE_SCRIPT): {
                    const scriptID = directoryStore.getDirectory(dirID).itemID;
                    if (scriptID == this.activeScript.id) this.activeScript = genBlankScript();
                    dispatcher.deleteScript(scriptID, dirID);
                    break;
                }
                case (MENU_ITEM_NAME.OPEN_SCRIPT): {
                    const scriptID = directoryStore.getDirectory(dirID).itemID;
                    this.activeScriptDirectory = dirID;
                    this.activeScript = scriptStore.get(scriptID);
                    const editor = this.$refs.editor as Vue;
                    const innerTextAreaEl = editor.$refs.textarea as HTMLTextAreaElement;
                    innerTextAreaEl.disabled = false;
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
            dispatcher.updateScript(this.activeScript, this.activeScriptDirectory);
        },
        enabledStyle() {
            return "";
        }
    },
    mounted() {
        this.scriptDirectory = directoryStore.getRoot().children[2];
        const outerEditor = this.$refs.outerEditor as Vue;
        const editor = this.$refs.editor as Vue;
        const scriptEditorEl = outerEditor.$el;
        const editorEl = editor.$el as HTMLElement;
        const innerTextAreaEl = editor.$refs.textarea as HTMLTextAreaElement;
        innerTextAreaEl.disabled = true;
        const scriptEditorHeight = scriptEditorEl.clientHeight;
        const textAreaHeight = editorEl.clientHeight;
        this.textAreaHeight = String(scriptEditorHeight - textAreaHeight - 100) + "px";
    }
})
</script>

<style>

.scriptEditor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */

    background: #333;
    /* border-top: solid 5px #333; */
    color: #ccc;

    height: 500px;
    /* you must provide font-family font-size line-height. Example:*/
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    /* text-indent: 10px; */
    /* margin: 0px 5px; */
    /* padding-right: 5px; */
    /* border: solid 5px #1b1b1b; */
}
/* optional class for removing the outline */
.prism-editor__textarea:focus {
    outline: none;
}

.prism-editor__container {
    /* background: #444; */
    /* border-top: solid 5px #444; */
    /* border-left: solid 10px #444; */
}
.prism-editor__line-numbers {
    /* text-align: center; */
    /* text-indent: 0px; */
    /* margin-right: 9px; */
    padding-right: 9px;
}
.prism-editor-wrapper {

}
.prism-editor__line-number {
    /* background-color: #444; */
}
.prism-editor__textarea {

}
.prism-editor__textarea--empty {

}
</style>