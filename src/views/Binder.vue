<template>
    <v-card dark>
        <!-- <v-card-title>

        </v-card-title> -->
        <v-card-text>
            <v-form
                ref="form"
                v-if="binding"
            >
                <v-btn
                    @click="save()"
                >
                    Save
                </v-btn>
                <v-row>
                    <h2 style="margin: 35px 10px 0 15px">Create Character</h2>
                    <v-col>
                        <v-select
                            label="Dynamic View"
                            :items="items"
                            item-text="name"
                            item-value="id"
                            v-model="binding.createCharacter.dcID"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="Action Script Name"
                            v-model="binding.createCharacter.actionTarget"
                            required
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <h2 style="margin: 35px 10px 0 15px">View Character</h2>
                    <v-col>
                        <v-select
                            label="Dynamic View"
                            :items="items"
                            item-text="name"
                            item-value="id"
                            v-model="binding.viewCharacter.dcID"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <h2 style="margin: 35px 10px 0 15px">Action Button Group</h2>
                    <v-col>
                        <v-select
                            label="Dynamic View"
                            :items="items"
                            item-text="name"
                            item-value="id"
                            v-model="binding.actionButtonGroup.dcID"
                        />
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                    <h2 style="margin: 35px 10px 0 15px">Start Turn Sequence</h2>
                    <v-col>
                        <v-text-field
                            label="Action Script Name"
                            v-model="binding.initTurnSequenceScript"
                            required
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <h2 style="margin: 35px 10px 0 15px">End Turn</h2>
                    <v-col>
                        <v-text-field
                            label="Action Script Name"
                            v-model="binding.endTurnScript"
                            required
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <h2 style="margin: 35px 10px 0 15px">End Turn Sequence</h2>
                    <v-col>
                        <v-text-field
                            label="Action Script Name"
                            v-model="binding.endTurnSequenceScript"
                            required
                        />
                    </v-col>
                </v-row>
                <v-divider></v-divider>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {dcStore} from "@/Stores/DynamicComponentStore"
import {campaignStore} from "@/Stores/CampaignStore"
import * as Asset from "@shared/Assets/Asset";
import Dispatcher from "@/Dispatcher/Dispatcher";

export default Vue.extend({
    data: () => ({
        items: [],
        binding: null as Asset.CampaignBindings.Data,
    }),
    methods: {
        save() {
            Dispatcher.updateCampaignBindings(this.binding, () => {});
        }
    },
    mounted() {
        this.binding = JSON.parse(JSON.stringify(campaignStore.campaignBindings));
        dcStore.forEach((dc: Asset.DynamicComponent.Data) => {
            this.items.push(dc);
        })
    }
});
</script>