<template>
<div style="height: 100%; width: 100%;">
    <splitpanes class="default-theme" :push-other-panes="false" @resize="resize()">
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
            <!-- <div style="background-color: red"></div> -->
        </pane>
    </splitpanes>
</div>
</template>

<script>
import Vue from "vue";
import AssetManager from "./AssetManager";
import CampaignCanvas from "./CampaignCanvas";
import CreateCharacterDialog from "./CreateCharacterDialog/CreateCharacterDialog"
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default Vue.extend({
    data: () => ({
        bus: new Vue(),
    }),
    components: {
        "asset-manager": AssetManager,
        "campaign-canvas": CampaignCanvas,
        "create-character-dialog": CreateCharacterDialog,
        Splitpanes,
        Pane,
    },
    methods: {
        resize() {
            this.bus.$emit('resized');
        },
        loadCampaign(campaignID) {
            const payload = {
                method: "GET",
                route: `campaigns/${campaignID}`,
                callback: (result) => {
                    this.$store.state.campaignObject = result;
                    localStorage.setItem("campaignObject", result);
                }
            };
            this.$store.dispatch("accessResource", payload);
        },
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.authToken;
        },
        isCampaignLoaded() {
            return this.$store.state.campaignObject;
        },
    },
    mounted() {
        const campaignID = this.$route.params.ID;
        if (campaignID) {
            this.loadCampaign(campaignID);
            return true;
        }
    },
    watch: {
        canvasWidth(width) {
            console.log("Watcher: ", width);
        },
        canvasHeight(height) {
            console.log("Watcher: ", height);
        },
    }
});
</script>

<style>
/* .splitpanes {
    background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
} */

/* .splitpanes__pane {
    box-shadow: 0 0 5px rgba(0, 0, 0, .2) inset;
} */

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