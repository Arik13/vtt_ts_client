<template>
<!-- Asset Manager -->
    <v-card dark height="100%" tile>

        <!-- Search element -->
        <v-card flat dense tile>
            <v-card-text>
                <v-text-field
                    v-model="search"
                    label="Search Assets"
                    dark
                    flat
                    solo-inverted
                    hide-details
                    clearable
                    clear-icon="mdi-close-circle-outline"
                ></v-text-field>

                <v-checkbox
                    v-model="caseSensitive"
                    dark
                    hide-details
                    label="Case sensitive search"
                ></v-checkbox>
                <!-- <br><v-divider /> -->
            </v-card-text>
        </v-card>

        <!-- Asset Tabs -->
        <v-card flat dense tile height="100%">
            <v-card-text >
                <v-tabs
                    v-model="model"
                    width="100%"
                    vertical
                    style="border-top: #333333 1px solid; border-bottom: #333333 1px solid"
                >
                    <v-tab
                        v-for="tab in tabs"
                        :key="tab.name"
                        :href="`#${tab.name}`"
                        style="background-image: linear-gradient(170deg, #333333, #111111); border-radius: 1px; border-bottom: #333333 1px solid"
                    >
                        <v-icon>
                            {{ tab.icon }}
                        </v-icon>
                    </v-tab>

                    <v-tabs-items dark v-model="model" style="padding: 0px 10px; border-left: #333333 1px solid">
                        <v-tab-item :value="TAB.IMAGES">
                            <asset-tree
                                :title="TAB.IMAGES"
                                :items="imageItems"
                                :filter="filter"
                                :search="search"
                                :menuItems="imageMenuItems"
                                :menuBus="menuHandler"
                                :assetClickEventCode="MENU_EVENT.OPEN_IMAGE"
                            />
                            <v-divider /><br>
                            <v-file-input
                                v-model="files"
                                label="Upload Image"
                                filled
                                dense
                                name="fileInput"
                                id="fileInput"
                                ref="fileInput"
                                multiple
                                @change="uploadFiles()"
                            />
                        </v-tab-item>
                        <v-tab-item :value="TAB.LIGHTS">
                            <asset-tree :title="TAB.LIGHTS" :items="lightItems" :filter="filter" :search="search" />
                        </v-tab-item>
                        <v-tab-item :value="TAB.CHARACTERS">
                            <asset-tree :title="TAB.CHARACTERS" :items="characterItems" :filter="filter" :search="search" />
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-card-text>
        </v-card>

        <!-- Create Token -->
        <v-dialog v-model="createTokenDialog" dark max-width="400px" width="100%">
            <v-card>
                <v-card-title>
                    Create Token
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Label" v-model="createTokenDialogState.label" />
                    <v-text-field label="Rank" v-model="createTokenDialogState.x" />
                    <v-text-field label="File" v-model="createTokenDialogState.y" />
                    <v-btn @click="createToken()">Create</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="imageViewerDialog" dark max-width="400px" width="100%">
            <v-img :src="imageSrc" />
        </v-dialog>
    </v-card>
</template>

<script lang="ts">

import Vue from "vue";
import AssetTree from "../components/AssetTree.vue";
import {ACTION, ACTION_ARG} from "../store/actions";
import {EVENT_NAME, EVENT_TYPE} from "@shared/events/events";
import { imageStore, ImageStore } from '@/GameStores/ImageStore';

enum TAB {
    IMAGES = "Images",
    GRAPHICS = "Graphics",
    LIGHTS = "Lights",
    CHARACTERS = "Characters",
}

enum MENU_EVENT {
    ADD_TOKEN = "addToken",
    DELETE_IMAGE = "deleteImage",
    OPEN_IMAGE = "openImage",
}

type MenuItem = {
    title: string;
    eventCode: string;
}

export default Vue.extend({
    data: () => ({
        imageStore: null,
        caseSensitive: false,

        tabs: [
            {name: TAB.IMAGES, icon: "mdi-image"},
            {name: TAB.LIGHTS, icon: "mdi-lightbulb"},
            {name: TAB.CHARACTERS, icon: "mdi-head"},
        ],
        search: null,
        model: 'tab-1',
        TAB: TAB,
        MENU_EVENT: MENU_EVENT,

        // Image assets state
        imageMenuItems: [
            {title: "Add Token", eventCode: MENU_EVENT.ADD_TOKEN,},
            {title: "Delete", eventCode: MENU_EVENT.DELETE_IMAGE,},
        ],
        imageItems: [],
        files: [],

        // Asset Lists
        graphicItems: [],
        lightItems: [],
        characterItems: [],

        // Create token dialog state
        createTokenDialog: false,
        createTokenDialogState: {
            x: 1,
            y: 1,
            label: "test",
            imageID: null,
        },

        // Image viewer dialog state
        imageViewerDialog: false,
        imageSrc: null,
    }),
    components: {
        "asset-tree": AssetTree,
    },
    methods: {
        menuHandler(menuEvent: MENU_EVENT, itemID: string) {
            switch(menuEvent) {
                case MENU_EVENT.ADD_TOKEN:
                    this.createTokenDialog = true;
                    this.createTokenDialogState.imageID = itemID;
                    break;
                case MENU_EVENT.DELETE_IMAGE:
                    console.log("Delete: ", itemID);
                    break;
                case MENU_EVENT.OPEN_IMAGE:
                    this.openImage(itemID);
                    break;
            }
        },
        openImage(imageID: string) {
            const image = imageStore.getImage(imageID);
            if (!image) return;
            const url = URL.createObjectURL(new Blob([image.fileBuffer]));
            this.imageSrc = url;
            this.imageViewerDialog = true;
        },
        async uploadFiles() {
            console.log();
            const files = this.files;
            if (!files.length) return;
            const file = files[0] as File;
            const fileBuff = await file.arrayBuffer();

            const event: EVENT_TYPE.UPLOAD_IMAGE = {
                campaignID: this.$store.state.campaignID,
                name: file.name,
                file: fileBuff,
            }
            const payload: ACTION_ARG.TRIGGER_EVENT = {
                eventName: EVENT_NAME.UPLOAD_IMAGE,
                event: event,
                callback: (reply: any) => {
                    console.log("Upload File Result: ", reply);
                    if (reply.success) {
                        // this.$store.state.images.push(file);
                        // console.log("Image Added: ", this.$store.state.images);
                    }
                }
            }

            this.$store.dispatch(ACTION.TRIGGER_EVENT, payload);
        },
        async createToken() {
            const event: EVENT_TYPE.CREATE_TOKEN = {
                imageID: this.createTokenDialogState.imageID,
                label: this.createTokenDialogState.label,
                x: this.createTokenDialogState.x,
                y: this.createTokenDialogState.y,
            }
            this.resetCreateTokenDialog();
            const payload: ACTION_ARG.TRIGGER_EVENT = {
                eventName: EVENT_NAME.CREATE_TOKEN,
                event: event,
                callback: (reply: any) => {
                    console.log("Upload File Result: ", reply);
                    if (reply.success) {
                        // this.$store.state.images.push(file);
                        // console.log("Image Added: ", this.$store.state.images);
                    }
                }
            }
            this.$store.dispatch(ACTION.TRIGGER_EVENT, payload);
        },
        resetCreateTokenDialog() {
            this.createTokenDialog = false;
            this.createTokenDialogState.imageID = null;
            this.createTokenDialogState.label = null;
            this.createTokenDialogState.x = null;
            this.createTokenDialogState.y = null;
        }
    },
    computed: {
        filter () {
            return this.caseSensitive? (item: Array<string>, search: string, textKey: number) => item[textKey].indexOf(search) > -1 : undefined
        },
    },
    mounted() {
        console.log("Asset Manager Images: ", imageStore);
        this.imageStore = imageStore;
        imageStore.images.forEach(image => {
            this.imageItems.push({
                id: image._id,
                name: image.name,
            })
        })
    }
});
</script>