<template>
    <v-card dark>
        <!-- <v-card-title>

        </v-card-title> -->
        <v-card-text>
            <v-form
                ref="form"
                v-if="conf"
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
                            v-model="conf.createCharacter.dcID"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="Action Name"
                            v-model="conf.createCharacter.actionTarget"
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
                            v-model="conf.viewCharacter.dcID"
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
                            v-model="conf.actionButtonGroup.dcID"
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
        conf: null as Asset.ClientConfig.Data,
    }),
    methods: {
        save() {
            Dispatcher.updateClientConfig(this.conf, () => {
                console.log("Updated Conf");

            })
        }
    },
    mounted() {
        this.conf = JSON.parse(JSON.stringify(campaignStore.clientConfig));
        dcStore.forEach((dc: Asset.DynamicComponent.Data) => {
            this.items.push(dc);
        })
    }
});
</script>