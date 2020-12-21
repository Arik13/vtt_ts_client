<template>
    <div class="loading">
        <h1>LOADING</h1>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dispatcher from "@/Dispatcher/Dispatcher"
import {campaignStore} from "@/Stores/CampaignStore";
import {userStore} from "@/Stores/UserStore";

export default Vue.extend({
    data: () => ({
        // campaignID: null,
    }),
    methods: {
        async startEditor(campaignID: string) {
            // The current campaign is already loaded
            if (campaignStore && campaignStore.campaignID == campaignID) {
                this.$router.push({ path: `/campaigneditor/${campaignID}` });
            }
            else {
                // TODO Optimization: The join and load events can be merged in order to cut travel time latency in half
                await dispatcher.join(campaignID, userStore.userID, () => {
                    dispatcher.loadCampaign(campaignID, () => {
                        // this.$store.state.campaignID = campaignID;
                        this.$router.push({ path: `/campaigneditor/${campaignID}` });
                    });
                });
            }
        },
    },
    mounted() {
        const campaignID = this.$route.params.ID;
        if (campaignID) {
            this.startEditor(campaignID);
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