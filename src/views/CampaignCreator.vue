<template>
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
                <v-btn @click="createDefault">
                    Create Default
                </v-btn>
                <v-btn @click="submitForm">
                    Create Empty
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Dispatcher from '@/Dispatcher/Dispatcher';
import * as Asset from "@shared/Assets/Asset"
import { directoryStore } from '@/Stores/DirectoryStore';
import { serverProxy } from '@/Stores/ServerProxy';
import { userStore } from '@/Stores/UserStore';
import Vue from "vue"
import { campaignStore } from '@/Stores/CampaignStore';
import { dcStore } from '@/Stores/DynamicComponentStore';
const cd = require("@/TestAssets/cd.json");
const mapURL = require("@/TestAssets/map2.jpg");
const tokURL = require("@/TestAssets/med.png");

// Action scripts
const createCharacterScript = require("@/TestAssets/Scripts/Actions/CreateCharacter").default;

// Modification Scripts
const initializeCharacterScript = require("@/TestAssets/Scripts/Modifications/InitializeCharacter").default;
const aasimarScript = require("@/TestAssets/Scripts/Modifications/Aasimar").default;
const protectorScript = require("@/TestAssets/Scripts/Modifications/Protector").default;
const scourgeScript = require("@/TestAssets/Scripts/Modifications/Scourge").default;
const fallenScript = require("@/TestAssets/Scripts/Modifications/Fallen").default;
const alignmentScript = require("@/TestAssets/Scripts/Modifications/Alignment").default;


export default Vue.extend({
    data() {
        return {
            valid: true,
            campaignName: "Campaign Numero Uno",
            campaignNameRules: [],
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
                    this.$router.push({ path: 'campaignselector' });
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
        async createDefault() {
            await serverProxy.request({
                    method: "POST",
                    route: "campaigns",
                    data: {
                        name: this.campaignName,
                        userID: userStore.userID,
                    },
                },
            );
            let result: Asset.CampaignData[] = await Dispatcher.getCampaigns();
            await Dispatcher.join(
                result.pop().id,
                userStore.userID,
            );
            await Dispatcher.loadCampaign(
                campaignStore.campaignID
            );
            // let imageDir = directoryStore.getRoot().children[0];
            // let locDir = directoryStore.getRoot().children[1];
            // let scriptDir = directoryStore.getRoot().children[2];
            // let charDir = directoryStore.getRoot().children[3];
            // let dcsDir = directoryStore.getRoot().children[4];
            // let sosDir = directoryStore.getRoot().children[5];
            // let dc = await Dispatcher.createDynamicComponent({name: "CharacterCreator",cd}, dcsDir.id);
            // let clientConfig: Asset.ClientConfig.Data = {
            //     id: campaignStore.clientConfig.id,
            //     createCharacter: {actionTarget: "CreateCharacter", dcID: dc.id}
            // };
            // let dirs = await Promise.all([
            //     Dispatcher.updateClientConfig(clientConfig),
            //     // Dispatcher.createDirectory("Actions", scriptDir.id),
            //     // Dispatcher.createDirectory("Modifications", scriptDir.id),
            //     Dispatcher.createDirectory("Maps", imageDir.id),
            //     Dispatcher.createDirectory("Tokens", imageDir.id),
            // ]);
            // // let actionsDir = dirs[1];
            // // let modsDir = dirs[2];
            // let mapsDir = dirs[1];
            // let tokensDir = dirs[2];

            // const getImage = async (name: string, url: string, parentID: string) => {
            //     let blob = await fetch(url).then(r => r.blob());
            //     let buf = await blob.arrayBuffer();
            //     return await Dispatcher.createImage(name, buf, parentID);
            // }
            // const images = await Promise.all([
            //     getImage("map2.jpg", mapURL, mapsDir.id),
            //     getImage("med.png", tokURL, tokensDir.id),
            // ])
            // let mapImg = images[0];
            // let tokImg = images[1];

            // let location = await Dispatcher.createLocation({
            //     name: "Location 1",
            //     mapImageID: mapImg.id,
            //     tokenIDs: [],
            //     locationModel: {
            //         ranks: 40,
            //         files: 40,
            //         tileWidth: 5,
            //         tileLength: 5,
            //     }
            // }, locDir.id);
            // Dispatcher.setActiveLocation(location.id);

            // ////////////////////////////////////////
            // Dispatcher.createToken(location.id, {
            //     name: "Ikra",
            //     imageID: tokImg.id,
            //     tokenModel: {
            //         position: {
            //             x: 20,
            //             z: 20,
            //         },
            //         dimensions: {
            //             width: 5,
            //             length: 5,
            //         }
            //     }
            // })
            this.$router.push({ path: 'campaigneditor' });
        }
    },
});
</script>