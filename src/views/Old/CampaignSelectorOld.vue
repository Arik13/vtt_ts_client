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
import {campaignStore} from "@/Stores/CampaignStore";
import {userStore} from "@/Stores/UserStore";
import dispatcher from '@/Dispatcher/Dispatcher';
import * as Asset from "@shared/Assets/Asset";

export default Vue.extend({
    data: () => ({
        campaigns: null as Asset.CampaignData[],
    }),
    methods: {
        startCampaign(campaign: Asset.CampaignData) {
            this.$router.push({ path: `/loading/${campaign.id}` });
        },
        deleteCampaign(campaign: Asset.CampaignData) {
            dispatcher.deleteCampaign(
                campaign.id,
                () => {
                    const index = this.campaigns.findIndex((campaignData: Asset.CampaignData) => {
                        return campaignData.id == campaign.id;
                    });
                    this.campaigns.splice(index, 1);
                }
            );
        }
    },
    mounted() {
        dispatcher.getCampaigns((result: Asset.CampaignData[]) => {
            this.campaigns = result;
        });
    }
});
</script>