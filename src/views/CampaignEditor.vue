<template>
<div style="height: 100%; width: 100%;">
    <splitpanes
        class="default-theme"
        :push-other-panes="false"
        @resize="resize()"
        @resized="resize()"
    >
        <pane :min-size="40">
            <splitpanes horizontal :push-other-panes="false" @resize="resize()">
                <pane :min-size="40">
                    <!-- <campaign-canvas :bus="bus" style="height: 100%; width: 100%;" /> -->
                    <campaign-canvas :bus="bus" />
                </pane>
                <pane :min-size="25" :size="25">
                    <v-card height="100%" width="100%" dark tile>
                        <v-card-title>The bottom pane</v-card-title>
                        <v-card-text>
                            <!-- <create-character-dialog /> -->
                        </v-card-text>
                    </v-card>
                </pane>
            </splitpanes>
        </pane>
        <pane :min-size="25" :size="25">
            <v-tabs
                v-model="model"
                width="100%"
                dark
            >
                <v-tab
                    v-for="tab in tabs"
                    :key="tab.name"
                    :href="`#${tab.name}`"
                >
                    {{ tab.name }}
                </v-tab>

                <v-tabs-items dark v-model="model" style="padding: 0px 0px; border-left: #333333 1px solid">
                    <v-tab-item :value="TAB.ASSET_MANAGER" :eager="true">
                        <!-- <v-card dark height="100%"> -->
                            <asset-manager height="100%" width="100%"/>
                        <!-- </v-card> -->
                    </v-tab-item>
                    <v-tab-item :value="TAB.CHAT">
                        <chat></chat>
                    </v-tab-item>

                </v-tabs-items>
            </v-tabs>
            <v-card height="100%" dark tile></v-card>
        </pane>
    </splitpanes>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AssetManager from "./AssetManager/AssetManager.vue";
import CampaignCanvas from "./CampaignCanvas.vue";
import Chat from "./Chat.vue";

// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import 'splitpanes/dist/splitpanes.css';

import {campaignStore} from "@/Stores/CampaignStore";

enum TAB {
    ASSET_MANAGER = "Assets",
    CHAT = "Chat",
}

@Component({
    components: {
        "asset-manager": AssetManager,
        "campaign-canvas": CampaignCanvas,
        Splitpanes,
        Pane,
        Chat,
    }
})
export default class CampaignEditor extends Vue {
    bus: Vue = new Vue();
    loaded = false;
    TAB = TAB;
    tabs = [
        {name: TAB.ASSET_MANAGER},
        {name: TAB.CHAT},
    ];
    model = 'tab-1';
    mounted() {
        const campaignID = this.$route.params.ID;
        if (!campaignID && campaignStore) {
            this.$router.push({path: `/campaigneditor/${campaignStore.campaignID}`})
        }
        else if (!campaignID) {
            this.$router.push({path: "/campaignselector"})
        }
    }
    resize() {
        this.bus.$emit('resized');
    }
}
</script>

<style>
.splitpanes--vertical > .splitpanes__splitter {
    min-width: 6px;
    background: linear-gradient(90deg, #FFF, #111);
    margin: 0px;
    padding: 0px;
}

.splitpanes--horizontal > .splitpanes__splitter {
    min-height: 6px;
    background: linear-gradient(0deg, #111, #FFF);
    margin: 0px;
    padding: 0px;
}
</style>