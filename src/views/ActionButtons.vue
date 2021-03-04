<template>
    <div>
        <v-row>
            <v-col v-for="(actionGroup, i) in actionGroups" :key="i">
                <h3>
                    {{ actionGroup.header }}
                </h3>
                <div :style="getActionGridStyle()">
                    <div v-for="(action, j) in actionGroup.actions" :key="j" :style="getItemStyle(j)">
                        <!-- {{ action }} -->
                        <div style="background-color: white" @click="handleClick(action)">
                            <v-img
                                max-height="50"
                                max-width="50"
                                :src="getImageURL(action)"
                                style="cursor: pointer; "
                            />
                        </div>
                        <div style="">
                            {{ action.label }}
                        </div>
                    </div>
                </div>
                <!-- {{ actionGroup }} -->
            </v-col>
        </v-row>
        <!-- <div v-for="(actionGroup, i) in actionGroups" :key="i" :style="getGridStyle()">
            <div :style="getItemStyle(i)">
                <h3>
                    {{ actionGroup.header }}
                </h3>
                <div :style="getActionGridStyle()">
                    <div v-for="(action, j) in actionGroup.actions" :key="j" :style="getItemStyle(j)">
                        <div style="text-align: center">
                            {{ action.label }}
                        </div>
                        <div style="background-color: white" @click="handleClick(action)">
                            <v-img
                                max-height="50"
                                max-width="50"
                                :src="getImageURL(action)"
                                style="cursor: pointer;"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createImageURL } from "@/Util/functions";
import Dispatcher from "@/Dispatcher/Dispatcher";
import { campaignStore } from '@/Stores/CampaignStore';
import { dcStore } from '@/Stores/DynamicComponentStore';
import { stateObjectStore } from '@/Stores/StateObjectStore';

type ActionButtonData = {iconID: string, label: string, action: string};
type ActionGroupData = {
    header: string;
    path: string[];
    actions: {
        [key: string]: ActionButtonData
    }
}
type ActionGroup = {
    header: string;
    actions: ActionButtonData[];
}

export default Vue.extend({
    data: () => ({
        actions: null as ActionButtonData[],
        actionGroups: [] as ActionGroup[],
        cols: 1,
    }),
    methods: {
        getImageURL(actionData: ActionButtonData) {
            return createImageURL(actionData.iconID);
        },
        getActionGridStyle() {
            return {
                display: "grid",
                // gap: "10px",
                "grid-auto-columns": `70px`,
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
            console.log(itemStyle);

            return itemStyle;
        },
        handleClick(action: ActionButtonData) {
            console.log(action);
            // Dispatcher.doAction(action.action, );

        }
    },
    mounted() {
        let btnsID = campaignStore.clientConfig.actionButtonGroup.dcID;
        if (!btnsID) return;
        let actionGroupDatas = dcStore.get(btnsID).cd as ActionGroupData[];
        if (!actionGroupDatas) return;

        // TODO: replace with character selection mechanism
        let soObj: any;
        stateObjectStore.forEach(so => {
            soObj = so;
        });

        let actionGroups: ActionGroup[] = [];
        // Init action groups
        actionGroupDatas.forEach((actionGroupData) => {
            // Get character actions
            let soActions = soObj;
            for (let i = 0; i < actionGroupData.path.length; i++) {
                soActions = soActions[actionGroupData.path[i]];
            }

            let actions: ActionButtonData[] = [];
            for (let key in soActions) {
                actions.push(actionGroupData.actions[key]);
            }
            let actionGroup: ActionGroup = {
                header: actionGroupData.header,
                actions,
            }
            actionGroups.push(actionGroup)

            // this.actions = displayedActions;
        })
        console.log(actionGroups);
        this.actionGroups = actionGroups;
    }
})
</script>