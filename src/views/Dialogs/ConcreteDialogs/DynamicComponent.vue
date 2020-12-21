<template>
    <v-dialog v-model="d.on" scrollable style="margin: 0; padding: 0" max-width="800px">
        <v-card dark tile max-height="700px" min-height="700px" style="margin: 0; padding: 0;">
            <!-- <v-card-title>

            </v-card-title> -->
            <v-card-text>
                <!-- <v-btn @click="d.hide(true)">Create</v-btn> -->
                <dynamic-list
                    :value="d.state.cds"
                    :key="nextKey"
                    :registerElement="registerElement"
                    ref="form"
                />
            </v-card-text>
            <v-card-actions>
                <!-- <br> -->
                <v-spacer />
                <!-- <v-divider></v-divider> -->
                <v-btn @click="submit()">Submit</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

import Vue, {PropType} from 'vue'

import "@/views/Workshop/ComponentMap";
import DynamicList from "@/views/Workshop/Components/DynamicList.vue";
// import cds from "./Workshop/cds";
import {ChoiceData} from "@/views/Workshop/ComponentTypes";
import dispatcher from "@/Dispatcher/Dispatcher";
import {GAME_EVENT_NAME, GAME_EVENT_TYPE} from "@shared/Game/GameEvent";

import AssetView from "@/views/components/AssetView.vue";
import {directoryStore} from '@/Stores/DirectoryStore';
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";

// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import 'splitpanes/dist/splitpanes.css';

import { EVENT_NAME } from '@shared/Events/Names';
import { DIALOG_NAME, dialogMap, ImageViewerState, CreateLocationState, LocationViewerState} from "@/views/Dialogs/Dialog";
import { DialogObject } from '@/views/Dialogs/DialogObject';
import { scriptStore } from '@/Stores/ScriptStore';
import { Asset } from "@shared/Assets/Asset";
import { spawnCreateDirectoryDialog } from '@/views/Dialogs/DialogFactories';
import { dcStore } from '@/Stores/DynamicComponentStore';

interface FormInterface {
    target: string;
}
interface Choice {
    param: string;
    value: any;
}


export default Vue.extend({
    data: () => ({
        // prop: {
        //     header: "",
        //     cds: cds,
        // },
        // input: "test",
        // choices: {},
        nextKey: 0,
        formInterfaces: [],
        folderMenuItems: [
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.CREATE_COMPONENT,
            MENU_ITEMS.DELETE_DIRECTORY,
        ],
        menuItems: [
            MENU_ITEMS.VIEW_COMPONENT,
            MENU_ITEMS.DELETE_COMPONENT,
        ],
    }),
    components: {
        DynamicList,
        AssetView,
        Splitpanes,
        Pane
    },
    props: {
        d: Object as PropType<DialogObject<any>>
    },
    methods: {
        tabber(event: Event) {
            if (!event) return;
            event.preventDefault();
        },
        registerElement(formInterface: any) {
            this.formInterfaces.push(formInterface);
        },
        submit() {
            const form = this.$refs.form as any;
            const choices = [] as any[];
            form.traverseActiveChoices((node: any) => {
                choices.push(node.getSelectedChoice())
            });
            console.log("Choices: ", choices);

            const action = {} as any;
            choices.forEach((choice: ChoiceData) => {
                action[choice.param] = choice.value
                    // action[choice.actionTarget][choice.param] = choice.value;
                // if (choice.param) {
                //     action[choice.actionTarget][choice.param] = choice.value;
                // }
            });
            this.d.state.action = action;
            this.d.hide(true);
        },
    },
    mounted() {

    }
})
</script>