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
                    <campaign-canvas :bus="bus" style="height: 100%; width: 100%;" />
                </pane>
                <pane :min-size="25" :size="25">
                    <v-card height="100%" width="100%" dark tile>
                        <v-card-title>The bottom pane</v-card-title>
                        <v-card-text>
                            <create-character-dialog />
                        </v-card-text>
                    </v-card>
                </pane>
            </splitpanes>
        </pane>
        <pane :min-size="25" :size="25">
            <asset-manager height="100%" width="100%"></asset-manager>
        </pane>
    </splitpanes>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AssetManager from "./AssetManager.vue";
import CampaignCanvas from "./CampaignCanvas.vue";
import CreateCharacterDialog from "./CreateCharacterDialog/CreateCharacterDialog.vue";

// @ts-ignore
import { Splitpanes, Pane } from "splitpanes";
import 'splitpanes/dist/splitpanes.css';

@Component({
    components: {
        "asset-manager": AssetManager,
        "campaign-canvas": CampaignCanvas,
        "create-character-dialog": CreateCharacterDialog,
        Splitpanes,
        Pane,
    }
})
export default class CampaignEditor extends Vue {
    bus: Vue = new Vue();
    mounted() {
        const campaignID = this.$route.params.ID;
        if (campaignID) {
            this.loadCampaign(campaignID);
            return true;
        }
        // console.log(this.$store.state.campaignObject)
    }
    resize() {
            this.bus.$emit('resized');
    }
    loadCampaign(campaignID: string) {
        localStorage.setItem("campaignID", campaignID);
        // const payload = {
        //     method: "GET",
        //     route: `campaigns/${campaignID}`,
        //     callback: (result: any) => {
        //         this.$store.state.campaignObject = result;
        //         // console.log(result);
        //         // localStorage.setItem("campaignObject", JSON.stringify(result));
        //     }
        // };
        // this.$store.dispatch("accessResource", payload);
    }
    get isLoggedIn() {
            return this.$store.state.authToken;
    }
    get isCampaignLoaded() {
        return this.$store.state.campaignObject;
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