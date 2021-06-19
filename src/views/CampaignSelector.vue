<template>
<v-container>
    <v-card dark>
        <v-card-title>
            Create Campaign
        </v-card-title>
        <v-card-text>
            <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="true"
            >
                <v-text-field
                    :rules="campaignNameRules"
                    v-model="campaignName"
                    label="Campaign Name"
                    required
                />
                <v-btn @click="submitForm">
                    Create Empty
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
    <br>
    <v-card dark>
        <v-card-title>
            Select Campaign
        </v-card-title>
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
</v-container>
</template>

<script lang="ts">
import Dispatcher from '@/Dispatcher/Dispatcher';
import * as Asset from "@shared/Assets/Asset"
import { directoryStore } from '@/Stores/DirectoryStore';
import { serverProxy } from '@/Stores/ServerProxy';
import { userStore } from '@/Stores/UserStore';
import Vue from "@/vue"
import { campaignStore } from '@/Stores/CampaignStore';
import { dcStore } from '@/Stores/DynamicComponentStore';


export default Vue.extend({
    data() {
        return {
            valid: true,
            campaignName: "Campaign Numero Uno",
            campaignNameRules: [],
            campaigns: null as Asset.CampaignData[],
        }
    },
    methods: {
        submitForm() {
            serverProxy.request(
                {
                    method: "POST",
                    route: "campaigns",
                    data: {
                        name: this.campaignName,
                        userID: userStore.userID,
                    },
                },
                () => {
                    Dispatcher.getCampaigns((result: Asset.CampaignData[]) => {
                        this.campaigns = result;
                    });
                    // this.$router.push({ path: 'campaignselector' });
                }
            );
        },
        validate() {
            const form = this.$refs.form as HTMLFormElement;
            if (form.validate()) {
                this.submitForm();
            }
        },
        reset() {
            const form = this.$refs.form as HTMLFormElement;
            form.reset();
        },
        resetValidation() {
            const form = this.$refs.form as HTMLFormElement;
            form.resetValidation();
        },
        startCampaign(campaign: Asset.CampaignData) {
            this.$router.push({ path: `/loading/${campaign.id}` });
        },
        deleteCampaign(campaign: Asset.CampaignData) {
            Dispatcher.deleteCampaign(
                campaign.id,
                () => {
                    const index = this.campaigns.findIndex((campaignData: Asset.CampaignData) => {
                        return campaignData.id == campaign.id;
                    });
                    this.campaigns.splice(index, 1);
                }
            );
        }
        // async createDefault() {
        //     await serverProxy.request({
        //             method: "POST",
        //             route: "campaigns",
        //             data: {
        //                 name: this.campaignName,
        //                 userID: userStore.userID,
        //             },
        //         },
        //     );
        //     let result: Asset.CampaignData[] = await Dispatcher.getCampaigns();
        //     await Dispatcher.join(
        //         result.pop().id,
        //         userStore.userID,
        //     );
        //     await Dispatcher.loadCampaign(
        //         campaignStore.campaignID
        //     );
        //     this.$router.push({ path: 'campaigneditor' });
        // }
    },
    mounted() {
        Dispatcher.getCampaigns((result: Asset.CampaignData[]) => {
            this.campaigns = result;
        });
    }
});
</script>