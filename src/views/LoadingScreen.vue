<template>
    <div class="loading">
        <h1>LOADING</h1>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import {ACTION, ACTION_ARG} from "@store/actions";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import { imageStore } from '@/GameStores/ImageStore';
import { locationStore } from '@/GameStores/LocationStore';
import {createCampaignData} from "@/GameStores/CampaignData";

export default Vue.extend({
    data: () => ({
        // campaignID: null,
    }),
    methods: {
        startEditor(campaignID: string) {
            // No campaign has been loaded
            // if (!this.$store.state.campaignID) {

            // }
            // The current campaign is already loaded
            if (campaignID == this.$store.state.campaignID) {
                return this.$router.push({ path: `/campaigneditor/${campaignID}` });
            }
            this.start(campaignID);
            // A new campaign is being loaded, reconnect to get a new session
            // else {
            //     this.$store.dispatch(ACTION.RECONNECT, {
            //         callback: () => {
            //             this.start(campaignID);
            //         }
            //     });
            // }
        },
        start(campaignID: string) {

            // imageStore.reset();
            // locationStore.reset();

            const event: EVENT_TYPE.JOIN = {
                campaignID: campaignID,
                userID: this.$store.state.userID,
            };

            const payload: ACTION_ARG.TRIGGER_EVENT = {
                eventName: EVENT_NAME.JOIN,
                event: event,
                callback: (res: any) => {
                    this.$store.dispatch(ACTION.LOAD_CAMPAIGN, {
                        id: campaignID,
                        callback: (result: any) => {
                            this.$store.state.campaignID = campaignID;
                            this.$router.push({ path: `/campaigneditor/${campaignID}` });
                        }
                    });
                }
            };

            this.$store.dispatch(ACTION.TRIGGER_EVENT, payload);
        }
    },
    mounted() {
        const campaignID = this.$route.params.ID;
        if (campaignID) {
            this.startEditor(campaignID);
            return true;
        }
    }
})
</script>

<style scoped>
.loading {
    width:200px;
    height:200px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -100px;
}

</style>