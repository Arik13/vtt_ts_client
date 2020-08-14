<template>
    <v-card dark>
        <v-list v-if="loggedIn">
            <template v-for="campaign in campaigns">
                <v-list-item
                    :key="campaign.ID"
                >
                    <v-btn @click="startCampaign(campaign.ID)">
                        {{campaign.name}}
                    </v-btn>
                </v-list-item>
            </template>
        </v-list>
        <!-- <img :src="image"> -->
    </v-card>
</template>

<script lang="ts">
import Vue from "vue"
import {ACTION, ACTION_ARG} from "@store/actions";
import {EVENT_NAME, EVENT_TYPE} from "@shared/events/events";

interface CampaignData {
    name: string;
    ID: string;
}

export default Vue.extend({
    data: () => ({
        campaigns: null,
        // image: null,
    }),
    computed: {
        loggedIn() {
            if (!this.$store.state.userID) return false;

            return true;
        }
    },
    methods: {
        startCampaign(ID: string) {
            this.$store.state.campaignID = ID;
            this.$router.push({ path: `campaigneditor/${ID}` });
        }
    },
    mounted() {
        const payload: ACTION_ARG.ACCESS_RESOURCE = {
            method: "GET",
            route: `users/${this.$store.state.userID}/campaigns`,
            callback: (result: CampaignData[]) => {
                this.campaigns = result;
            }
        };
        this.$store.dispatch(ACTION.ACCESS_RESOURCE, payload);
    }
});
</script>