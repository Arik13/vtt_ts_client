<template>
    <v-dialog
        v-model="d.on"
        scrollable
        style="margin: 0; padding: 0"
        max-width="1000px"
        @click:outside="handleDismiss()"
    >
        <v-card dark tile max-height="800px" min-height="800px" style="margin: 0; padding: 0;">
            <!-- <v-card-title>

            </v-card-title> -->
            <v-card-text>
                <!-- <v-btn @click="d.hide(true)">Create</v-btn> -->
                <dynamic-list
                    v-if="on"
                    :value="d.state.cds"
                    :key="nextKey"
                    ref="form"
                />
                    <!-- :registerElement="registerElement" -->
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="submit()">Submit</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import 'splitpanes/dist/splitpanes.css';
import Vue, {PropType} from 'vue'

import "@/views/Workshop/ComponentMap";
import DynamicList from "@/views/Workshop/Components/DynamicList.vue";
import {ChoiceData} from "@/views/Workshop/ComponentTypes";
import AssetView from "@/views/components/AssetView.vue";
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";
import { DialogObject } from '@/views/Dialogs/DialogObject';

interface FormInterface {
    target: string;
}
interface Choice {
    param: string;
    value: any;
}


export default Vue.extend({
    data: () => ({
        nextKey: 0,
        folderMenuItems: [
            MENU_ITEMS.CREATE_COMPONENT,
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.DELETE_DIRECTORY,
        ],
        menuItems: [
            MENU_ITEMS.VIEW_COMPONENT,
            MENU_ITEMS.DELETE_COMPONENT,
        ],
        on: true,
        reset: false,
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
        submit() {
            const form = this.$refs.form as any;
            const choices = [] as any[];
            let isValidSubmission = true;
            form.traverseActiveChoices((node: any) => {
                isValidSubmission = isValidSubmission && node.validate();
            });
            if (!isValidSubmission) {
                console.log("Form is incomplete!");

                return;
            }
            form.traverseActiveChoices((node: any) => {
                let choice = node.getSelectedChoice();
                if (Array.isArray(choice)) {
                    choices.push(...choice);
                }
                else choices.push(choice);
            });
            console.log("Choices: ", choices);

            const action = {} as any;
            choices.forEach((choice: ChoiceData) => {
                action[choice.param] = choice.value
            });
            this.d.state.action = action;
            this.d.hide(true);
        },
        handleDismiss() {
            console.log("DISMISS");
            this.d.dismiss();
        }
    },
    watch: {
        d: {
            handler(val: any) {
                if (!this.d.on && !this.reset) {
                    const form = this.$refs.form as any;
                    this.reset = true;
                    form.reset();
                    this.d.resetState();
                }
                else if (this.d.on) {
                    this.reset = false;
                }
            },
            deep: true,
        }
    },
    mounted() {

    },
    updated() {

    }

})
</script>