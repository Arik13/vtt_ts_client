<template>
    <v-dialog
        v-model="d.on"
        scrollable
        style="margin: 0; padding: 0"
        max-width="1000px"
        @click:outside="handleDismiss()"
    >
        <v-card dark tile max-height="900px" min-height="900px" style="margin: 0; padding: 0;">
            <v-card-text>
                <dynamic-list
                    v-if="on"
                    :value="d.state.cds"
                    :global="d.global"
                    :key="nextKey"
                    ref="form"
                />
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
import Vue, {PropType} from 'vue';

import "@/views/DC_Module/ComponentMap";
import DynamicList from "@/views/DC_Module/DynamicList.vue";
import {ChoiceData} from "@/views/DC_Module/ComponentTypes";
import AssetView from "@/views/components/AssetView.vue";
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";
import { DialogObject } from '@/views/Dialogs/DialogObject';

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
                console.error("Form is incomplete!");
                return;
            }
            form.traverseActiveChoices((node: any) => {
                let choice = node.getSelectedChoice();
                if (Array.isArray(choice)) {
                    choices.push(...choice);
                }
                else choices.push(choice);
            });
            console.info("Choices: ", choices);

            const action = {} as any;
            choices.forEach((choice: ChoiceData) => {
                action[choice.param] = choice.value
            });
            this.d.state.action = action;
            this.d.hide(true);
        },
        handleDismiss() {
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