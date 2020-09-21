<template>
    <v-card dark>
            <template v-for="(campaign, i) in campaigns">
                <div :key="i">
                    <v-row style="margin: 0px 0px 0px 0px">
                        <v-col>
                            <v-btn @click="startCampaign(campaign)" icon style="white-space: nowrap; float: left">
                                <v-icon>
                                    mdi-arrow-right
                                </v-icon>
                            </v-btn>
                            <h3 style="padding: 4px 0px 0px 0px; white-space: nowrap">
                                {{ campaign.name }}
                            </h3>
                        </v-col>
                        <!-- <v-col>

                        </v-col> -->
                        <!-- <v-spacer /> -->
                        <v-col cols="1">
                            <v-btn @click="deleteCampaign(campaign)" icon>
                                <v-icon>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!-- <v-divider /> -->
                </div>
            </template>
        <v-divider />
    </v-card>
</template>

<script lang="ts">
import Vue from "vue"
import {ACTION, ACTION_ARG} from "@/Stores/vuex/actions";

interface CampaignData {
    name: string;
    ID: string;
}

export default Vue.extend({
    data: () => ({
        campaigns: null as CampaignData[],
    }),
    methods: {
        startCampaign(campaign: CampaignData) {
            this.$router.push({ path: `/loading/${campaign.ID}` });
        },
        deleteCampaign(campaign: CampaignData) {
            const payload: ACTION_ARG.ACCESS_RESOURCE = {
                method: "DELETE",
                route: `campaigns/${campaign.ID}`,
                callback: () => {
                    const index = this.campaigns.findIndex((campaignData: CampaignData) => {
                        return campaignData.ID == campaign.ID;
                    });
                    this.campaigns.splice(index, 1);
                    console.log("Deleted campaign");
                }
            };
            this.$store.dispatch(ACTION.ACCESS_RESOURCE, payload);
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