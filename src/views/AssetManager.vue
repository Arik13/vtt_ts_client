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
            </v-card-text>
        </v-card>

        <!-- ---------------------------------------------------------------------------- -->
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
                        <!-- Image Manager -->
                        <v-tab-item :value="TAB.IMAGES">
                            <asset-tree
                                :title="TAB.IMAGES"
                                :assets="imageItems"
                                :filter="filter"
                                :search="search"
                                :menuItems="imageMenuItems"
                                :menuBus="menuHandler"
                                :assetClickEventCode="MENU_EVENT.OPEN_IMAGE"
                                height="100%"
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
                                @change="createImage()"
                            />
                        </v-tab-item>

                        <!-- Lights Manager -->
                        <v-tab-item :value="TAB.LIGHTS">
                            <asset-tree :title="TAB.LIGHTS" :assets="lightItems" :filter="filter" :search="search" />
                        </v-tab-item>

                        <!-- Characters Manager -->
                        <v-tab-item :value="TAB.CHARACTERS">
                            <asset-tree :title="TAB.CHARACTERS" :assets="characterItems" :filter="filter" :search="search" />
                        </v-tab-item>

                        <!-- Locations Manager -->
                        <v-tab-item :value="TAB.LOCATIONS">
                            <asset-tree
                                :title="TAB.LOCATIONS"
                                :assets="locationItems"
                                :filter="filter"
                                :search="search"
                                :menuItems="locationMenuItems"
                                :menuBus="menuHandler"
                                :assetClickEventCode="MENU_EVENT.VIEW_LOCATION"
                            />
                            <v-divider /><br>
                            <v-btn @click="dialogs.createLocation.on = true">Create Location</v-btn>
                            <br><br>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-card-text>
        </v-card>

        <!-- ---------------------------------------------------------------------------- -->
        <!-- DIALOGS -->

        <!-- Create Token -->
        <v-dialog v-model="dialogs.createToken.on" dark max-width="400px" width="100%">
            <v-card>
                <v-card-title>
                    Create Token
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Label" v-model="dialogs.createToken.state.label" />
                    <v-text-field label="Rank" v-model="dialogs.createToken.state.x" />
                    <v-text-field label="File" v-model="dialogs.createToken.state.y" />
                    <v-btn @click="createToken()">Create</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Image Viewer -->
        <v-dialog v-model="dialogs.imageViewer.on" dark max-width="400px" width="100%">
            <v-img :src="dialogs.imageViewer.state.imageSrc" />
        </v-dialog>

        <!-- Create Location -->
        <v-dialog v-model="dialogs.createLocation.on" dark max-width="400px" width="100%">
            <v-card>
                <v-card-title>
                    Create Location
                </v-card-title>
                <v-card-text>
                    <v-select
                        :items="imageItems"
                        item-text="name"
                        item-value="id"
                        v-model="dialogs.createLocation.state.mapImageID"
                        label="Image"
                    />
                    <v-text-field label="Name" v-model="dialogs.createLocation.state.name" />
                    <v-text-field label="Ranks" v-model="dialogs.createLocation.state.ranks" />
                    <v-text-field label="Files" v-model="dialogs.createLocation.state.files" />
                    <v-text-field label="Tile Length" v-model="dialogs.createLocation.state.tileLength" />
                    <v-text-field label="Tile Width" v-model="dialogs.createLocation.state.tileWidth" />
                    <v-btn @click="createLocation()">Create</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Location Viewer -->
        <v-dialog v-model="dialogs.locationViewer.on" dark max-width="600px" width="100%">
            <v-card v-if="dialogs.locationViewer.state.location">
                <v-card-title>
                    {{ dialogs.locationViewer.state.location.name }}
                </v-card-title>
                <v-col>

                </v-col>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <v-row>
                                <v-col cols="6"><b>Ranks:</b></v-col>
                                <v-col cols="6">{{ dialogs.locationViewer.state.location.model.ranks }}</v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6"><b>Files:</b></v-col>
                                <v-col cols="6">{{ dialogs.locationViewer.state.location.model.files }}</v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6"><b>Tile Width:</b></v-col>
                                <v-col cols="6">{{ dialogs.locationViewer.state.location.model.tileWidth }}</v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6"><b>Tile Length:</b></v-col>
                                <v-col cols="6">{{ dialogs.locationViewer.state.location.model.tileLength }}</v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="6">
                            <v-img
                                :src="dialogs.locationViewer.state.mapImageSrc"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- ---------------------------------------------------------------------------- -->
    </v-card>
</template>

<script lang="ts">
/*
    The asset manager is responsible for displaying lists of each assets, and providing
    a set of dialogs and menus that allow for the manipulation of those assets.

    The top half of the template above contains the HTML for the asset lists,
    and the bottom half contains the HTML for the dialogs.

    In the data, each dialog has a state. Each dialog also has a handler,
    which can update the asset store relevant to the asset being created/updated/deleted.
*/

import Vue from "vue";
import AssetTree from "@/components/AssetTree.vue";
import {ACTION, ACTION_ARG} from "@/store/actions";
import {EVENT_NAME, EVENT_TYPE} from "@shared/Events/Events";
import {Asset} from "@shared/Assets/Asset";
import { Store } from '@/GameStores/Store';
import {imageStore, ImageStore} from '@/GameStores/ImageStore';
import {locationStore, LocationStore} from '@/GameStores/LocationStore';
import {Subscriber} from "@/GameStores/Subscriber";
import {babylonController} from "@/Babylon/Engine/BabylonController";

enum TAB {
    IMAGES = "Images",
    // GRAPHICS = "Graphics",
    LIGHTS = "Lights",
    CHARACTERS = "Characters",
    LOCATIONS = "Locations",
}

enum MENU_EVENT {
    CREATE_TOKEN = "createToken",
    OPEN_IMAGE = "openImage",
    DELETE_IMAGE = "deleteImage",

    CREATE_LOCATION = "createLocation",
    OPEN_LOCATION = "openLocation",
    DELETE_LOCATION = "deleteLocation",
    VIEW_LOCATION = "viewLocation"
}

enum DIALOG {
    IMAGE_VIEWER = "imageViewer",
    CREATE_TOKEN = "createToken",
    CREATE_LOCATION = "createLocation",
    LOCATION_VIEWER = "locationViewer",
}

type MenuItem = {
    title: string;
    eventCode: string;
}

export default Vue.extend({
    data: () => ({
        imageStore: imageStore as ImageStore,
        locationStore: locationStore as LocationStore,
        caseSensitive: false,

        tabs: [
            {name: TAB.IMAGES, icon: "mdi-image"},
            {name: TAB.LIGHTS, icon: "mdi-lightbulb"},
            {name: TAB.CHARACTERS, icon: "mdi-head"},
            {name: TAB.LOCATIONS, icon: "mdi-map-marker"},
        ],
        search: null,
        model: 'tab-1',
        TAB: TAB,
        MENU_EVENT: MENU_EVENT,

        // Image assets state
        imageMenuItems: [
            {title: "Create Token", eventCode: MENU_EVENT.CREATE_TOKEN,},
            {title: "Delete", eventCode: MENU_EVENT.DELETE_IMAGE,},
        ],
        imageItems: [],
        files: [],

        // Asset Lists
        graphicItems: [],
        lightItems: [],
        characterItems: [],
        locationItems: [],
        locationMenuItems: [
            {title: "Open", eventCode: MENU_EVENT.OPEN_LOCATION,},
            {title: "Delete", eventCode: MENU_EVENT.DELETE_LOCATION,},
            {title: "View", eventCode: MENU_EVENT.VIEW_LOCATION,},
        ],

        dialogs: {
            createToken: {
                on: false,
                state: {
                    x: 1,
                    y: 1,
                    label: "test",
                    imageID: null,
                }
            },
            createLocation: {
                on: false,
                state: {
                    mapImageID: "",
                    name: "Location 1",
                    files: 10,
                    ranks: 10,
                    tileLength: 5,
                    tileWidth: 5,
                }
            },
            imageViewer: {
                on: false,
                state: {
                    imageSrc: null,
                }
            },
            locationViewer: {
                on: false,
                state: {
                    location: null,
                    mapImageSrc: null,
                }
            }
        },
    }),
    components: {
        "asset-tree": AssetTree,
    },
    methods: {
        menuHandler(menuEvent: MENU_EVENT, itemID: string) {
            switch(menuEvent) {
                // IMAGES
                case MENU_EVENT.OPEN_IMAGE:
                    this.dialogs.imageViewer.state.imageSrc = this.createImageURL(itemID);
                    this.openDialog(DIALOG.IMAGE_VIEWER);
                    return;
                case MENU_EVENT.DELETE_IMAGE:
                    this.imageStore.delete(itemID);
                    return;

                // LOCATIONS
                case MENU_EVENT.OPEN_LOCATION:
                    this.dialogs.locationViewer.state.location = this.locationStore.get(itemID);
                    this.dialogs.locationViewer.state.mapImageSrc = this.createImageURL(this.dialogs.locationViewer.state.location.mapImageID);
                    this.openDialog(DIALOG.LOCATION_VIEWER);
                    return;
                case MENU_EVENT.CREATE_LOCATION:
                    return;
                case MENU_EVENT.DELETE_LOCATION:
                    this.locationStore.delete(itemID);
                    return;
                case MENU_EVENT.VIEW_LOCATION:
                    babylonController.setActiveLocation(itemID);
                    return;

                // TOKENS
                case MENU_EVENT.CREATE_TOKEN:
                    this.dialogs.createToken.state.imageID = itemID;
                    this.openDialog(DIALOG.CREATE_TOKEN);
                    return;
            }
        },
        openDialog(dialogName: DIALOG) {
            const dialogObject = this.dialogs[dialogName] as any;
            dialogObject.on = true;
        },
        resetDialogState(dialogName: DIALOG) {
            const dialogObject = this.dialogs[dialogName] as any;
            dialogObject.on = false;
            for (const key in dialogObject.state) {
                dialogObject.state[key] = null;
            }
        },
        createImageURL(imageID: string) {
            const image = imageStore.get(imageID);
            if (!image) return;
            return URL.createObjectURL(new Blob([image.fileBuffer]));
        },
        async createImage() {
            const files = this.files;
            if (!files || !files.length) return;
            const file = files[0] as File;
            const fileBuffer = await file.arrayBuffer();
            this.imageStore.create(file.name, fileBuffer);
            this.files = null;
        },
        createToken() {
            const event: EVENT_TYPE.CREATE_TOKEN = {
                imageID: this.dialogs.createToken.state.imageID,
                label: this.dialogs.createToken.state.label,
                x: this.dialogs.createToken.state.x,
                y: this.dialogs.createToken.state.y,
            }
            this.resetDialogState(DIALOG.CREATE_TOKEN);
            const payload: ACTION_ARG.TRIGGER_EVENT = {
                eventName: EVENT_NAME.CREATE_TOKEN,
                event: event,
                callback: (reply: any) => {
                    if (reply.success) {
                        console.log("Token Created");
                    }
                }
            }
            this.$store.dispatch(ACTION.TRIGGER_EVENT, payload);
        },
        createLocation() {
            const locationAsset: Asset.LocationData = {
                name: this.dialogs.createLocation.state.name,
                mapImageID: this.dialogs.createLocation.state.mapImageID,
                model: {
                    files: this.dialogs.createLocation.state.files,
                    ranks: this.dialogs.createLocation.state.ranks,
                    tileLength: this.dialogs.createLocation.state.tileLength,
                    tileWidth: this.dialogs.createLocation.state.tileWidth,
                }
            }
            this.locationStore.create(locationAsset);
            this.resetDialogState(DIALOG.CREATE_LOCATION);
        },
        imageCreated(id: string) {
            const image = this.imageStore.get(id);
            this.imageItems.push({
                id: image.id,
                name: image.name,
            })
        },
        imageDeleted(id: string) {
            for (let i = 0; i < this.imageItems.length; i++) {
                if (this.imageItems[i].id == id) {
                    this.imageItems.splice(i, 1);
                }
            }
        },
        locationCreated(id: string) {
            const location = this.locationStore.get(id);
            this.locationItems.push({
                id: location.id,
                name: location.name,
            })
        },
        locationDeleted(id: string) {
            for (let i = 0; i < this.locationItems.length; i++) {
                if (this.locationItems[i].id == id) {
                    this.locationItems.splice(i, 1);
                }
            }
        },
    },
    computed: {
        filter () {
            return this.caseSensitive? (item: Array<string>, search: string, textKey: number) => item[textKey].indexOf(search) > -1 : undefined
        },
    },
    mounted() {
        // Subscribe to changes in the asset stores
        const imageSubscriber: Subscriber = {
            added: this.imageCreated,
            deleted: this.imageDeleted,
        }
        const locationSubscriber: Subscriber = {
            added: this.locationCreated,
            deleted: this.locationDeleted,
        }
        this.imageStore.subscribe(imageSubscriber);
        this.locationStore.subscribe(locationSubscriber);

        // Pull all assets from the stores and add them to the view
        this.imageStore.forEach(image => {
            this.imageItems.push({
                id: image.id,
                name: image.name,
            })
        });
        this.locationStore.forEach(location => {
            this.locationItems.push({
                id: location.id,
                name: location.name,
            })
        });
    }
});
</script>