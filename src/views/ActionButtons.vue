<template>
    <div :style="'overflow-y: auto; overflow-x: hidden; height: ' + height">
        <v-row>
            <v-col v-for="(actionGroup, i) in actionGroups" :key="i">
                <h3>
                    {{ actionGroup.header }}
                </h3>
                <div :style="getActionGridStyle()">
                    <div v-for="(action, j) in actionGroup.actions" :key="j" :style="getItemStyle(j)">
                        <img
                            :src="getImageURL(action)"
                            @click="handleClick(action)"
                            :title="action.label"
                            :style="
                                'margin: 0px;' +
                                'padding: 0px;' +
                                'min-width: 50px;' +
                                'min-height: 50px;' +
                                'max-height: 50px;' +
                                'max-width: 50px;' +
                                'cursor: pointer;' +
                                `border: 2px solid ${getBorderColor(action)};` +
                                `box-shadow: ${getBorderGlow(action)};`
                            "
                        >
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createImageURL } from "@/Util/functions";
import Dispatcher from "@/Dispatcher/Dispatcher";
import { campaignStore } from '@/Stores/CampaignStore';
import { dcStore } from '@/Stores/DynamicComponentStore';
import { stateObjectStore } from '@/Stores/StateObjectStore';
import { tokenStore } from '@/Stores/TokenStore';
import { eventBus, CLIENT_EVENT } from "@/Stores/EventBus";
import { mouseController, MOUSE_EVENT } from "@/Stores/MouseController";
import { globalMouseContext, MOUSE_CONTEXT } from '@/Stores/MouseContext';

type ActionButtonData = {
    iconID: string;
    iconURL: string;
    label: string;
    toggle?: {
        on: {
            action: string;
            params: any;
        },
        off: {
            action: string;
            params: any;
        },
        path: string[];
    }
    action: string;
    target: {
        mode: "point" | "circle" | "square" | "cone" | "chain";
        amount: number | {
            paths: string[][]
        };
        cursor: string;
    }
};
type ActionGroupData = {
    header: string;
    path: string[];
    actions: {
        [key: string]: ActionButtonData
    };
}
type ActionGroup = {
    header: string;
    actions: ActionButtonData[];
}

export default Vue.extend({
    data: () => ({
        // actions: null as ActionButtonData[],
        actionGroups: [] as ActionGroup[],
        cols: 1,
        // buttonCursor: "cursor: url(https://image.shutterstock.com/image-vector/line-cursor-icon-trendy-flat-260nw-761958064.jpg)",
        buttonCursor: "cursor: pointer",
        height: "0px",
    }),
    props: {
        bus: {
            default: null,
            type: Vue,
        },
    },
    methods: {
        getImageURL(actionData: ActionButtonData) {
            return (actionData.iconURL)? (actionData.iconURL) : createImageURL(actionData.iconID);
        },
        updateHeight() {
            let elDistanceToTop = window.pageYOffset + this.$el.getBoundingClientRect().top;
            let height = window.innerHeight - elDistanceToTop - 40;
            this.height = height + "px";
        },
        getActionGridStyle() {
            return {
                display: "grid",
                // gap: "10px",
                "grid-auto-columns": `52px`,
                "grid-auto-rows": `minmax(0, auto)`,
            }
        },
        getGridStyle() {
            return {
                display: "grid",
                // "grid-template-columns": "auto auto auto auto",
                // "grid-template-rows": "auto auto auto auto",
                // gap: "10px",
                // "grid-auto-columns": `auto auto`,
                "grid-auto-columns": `minmax(0, auto)`,
                "grid-auto-rows": `minmax(0, auto)`,
            }
        },
        getItemStyle(index: number) {
            let itemStyle = {
                "grid-column": `${index + 1}`,
                // "grid-column": this.cols++,
                "grid-row": "1",
            }

            return itemStyle;
        },
        getBorderColor(actionData: ActionButtonData) {
            if (actionData.toggle) {
                let resolved = this.resolvePath(actionData.toggle.path);
                return (resolved)? "red" : "gray";
            }
            return "gray";
        },
        getBorderGlow(actionData: ActionButtonData) {
            if (actionData.toggle) {
                return (this.resolvePath(actionData.toggle.path))? "0 0 15px red;'" : "";
            }
            return "";
        },
        resolvePath(path: string[]) {
            let so = this.getSO();
            let soAttr = so;
            for (let i = 0; i < path.length && (soAttr !== null || soAttr !== undefined); i++) {
                let pathEl = path[i];
                soAttr = soAttr[pathEl];
            }
            return soAttr;
        },
        getSO() {
            let soID = tokenStore.get(campaignStore.selectedTokenID).soID;
            return stateObjectStore.get(soID);
        },
        handleClick(actionData: ActionButtonData) {
            console.log(`${actionData.label} button clicked: ${actionData.action} action fired`);
            console.log(actionData);
            if (actionData.toggle && this.resolvePath(actionData.toggle.path)) {
                let soID = tokenStore.get(campaignStore.selectedTokenID).soID;
                Dispatcher.doAction(actionData.toggle.off.action, {
                    ...actionData.toggle.off.params,
                    initiatorID: soID,
                });
                return;
            }
            globalMouseContext.setContext(MOUSE_CONTEXT.TARGETING, actionData.target.cursor);

            mouseController.handleOnce(MOUSE_EVENT.RIGHT_CLICK, e => {
                globalMouseContext.setContext(MOUSE_CONTEXT.DEFAULT);
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
            eventBus.registerDisposableHandler(CLIENT_EVENT.POINT_TARGETED, (point) => {
                let action = "";
                let params = {};
                if (actionData.toggle) {
                    action = actionData.toggle.on.action;
                    params = actionData.toggle.on.params;
                }
                else {
                    action = actionData.action
                }
                // let action = (actionData.toggle)? actionData.toggle.on.action
                // let params
                let soID = tokenStore.get(campaignStore.selectedTokenID).soID;
                Dispatcher.doAction(action, {
                    initiatorID: soID,
                    point,
                    ...params
                });
            });
        },
        initButtons() {
            // Get the campaign button config
            let btnsID = campaignStore.campaignBindings.actionButtonGroup.dcID;
            if (!btnsID) return;

            let actionGroupData = dcStore.get(btnsID).cd as ActionGroupData[];
            if (!actionGroupData) return;

            // Create action button groups
            let actionGroups: ActionGroup[] = [];
            actionGroupData.forEach((actionGroupDatum) => {
                // Get character actions
                let soActions = this.resolvePath(actionGroupDatum.path);
                if (!soActions || !Object.keys(soActions).length) return;

                // Create an action button for each character action
                let actions: ActionButtonData[] = [];
                for (let key in soActions) {
                    if (soActions[key]) {
                        let actionButtonData = actionGroupDatum.actions[key];
                        actions.push(actionButtonData);
                    }
                }
                // Add action button group
                let actionGroup: ActionGroup = {
                    header: actionGroupDatum.header,
                    actions,
                }
                actionGroups.push(actionGroup);
            })
            this.actionGroups = actionGroups;
            console.log(this.actionGroups);

        },
        selectedTokenHandler(tokenID: string) {
            if (!tokenID) {
                return this.actionGroups = [];
            }
            let token = tokenStore.get(tokenID);
            if (!token.soID) return;
            let so = stateObjectStore.get(token.soID);
            if (!so) return;
            this.initButtons();
        }
    },
    mounted() {
        eventBus.registerHandler(CLIENT_EVENT.SELECTED_TOKEN_UPDATED, this.selectedTokenHandler);
        eventBus.registerHandler(CLIENT_EVENT.MOUSE_CONTEXT_CHANGED, (context: MOUSE_CONTEXT) => {
            switch(context) {
                case MOUSE_CONTEXT.TARGETING:
                    this.buttonCursor = "";
                    break;
                case MOUSE_CONTEXT.DEFAULT:
                    this.buttonCursor = "cursor: pointer";
                    break;
            }
        });
        eventBus.registerHandler(CLIENT_EVENT.STATE_OBJECT_UPDATED, (soID: string) => {
            if (soID == this.getSO().id) {
                this.selectedTokenHandler(campaignStore.selectedTokenID);
            }
        });
        this.bus.$on('resized', () => {
            this.updateHeight();
        });
    }
})
</script>