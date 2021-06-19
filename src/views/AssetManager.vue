<template>
<!-- Asset Manager -->
    <v-card dark height="100%" tile>
        <!-- Asset Tabs -->
        <v-card flat dense tile height="100%">
            <v-card-text >
                <v-tabs
                    v-model="tabModel"
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

                    <v-tabs-items dark v-model="tabModel" style="padding: 0px 0px 0px 5px; border-left: #333333 1px solid">
                        <!-- Image Manager -->
                        <v-tab-item :value="TAB.IMAGES">
                            <asset-view
                                v-if="imageDirectory"
                                :title="TAB.IMAGES"
                                :filter="filter"
                                :search="search"
                                :folderMenuItems="imageFolderMenuItems"
                                :menuItems="imageMenuItems"
                                :menuBus="menuHandler"
                                :assetClickEventName="MENU_ITEM_NAME.OPEN_IMAGE"
                                :directory="imageDirectory"
                            />
                            <input
                                type="file"
                                style="display: none"
                                ref="fileInput"
                                accept="image/*"
                                @change="createImage($event)"
                            />
                        </v-tab-item>

                        <!-- Lights Manager -->
                        <v-tab-item :value="TAB.LIGHTS">
                            <!-- <asset-tree :title="TAB.LIGHTS" :assets="lightItems" :filter="filter" :search="search" /> -->
                        </v-tab-item>

                        <!-- Characters Manager -->
                        <v-tab-item :value="TAB.CHARACTERS">
                            <asset-view
                                v-if="characterDirectory"
                                :title="TAB.CHARACTERS"
                                :filter="filter"
                                :search="search"
                                :folderMenuItems="characterFolderMenuItems"
                                :menuItems="characterMenuItems"
                                :menuBus="menuHandler"
                                :assetClickEventName="MENU_ITEM_NAME.VIEW_CHARACTER"
                                :directory="characterDirectory"
                            />
                        </v-tab-item>

                        <!-- Locations Manager -->
                        <v-tab-item :value="TAB.LOCATIONS">
                            <asset-view
                                v-if="locationDirectory"
                                :title="TAB.LOCATIONS"
                                :filter="filter"
                                :search="search"
                                :folderMenuItems="locationFolderMenuItems"
                                :menuItems="locationMenuItems"
                                :menuBus="menuHandler"
                                :assetClickEventName="MENU_ITEM_NAME.VIEW_LOCATION"
                                :directory="locationDirectory"
                            />
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-card-text>
        </v-card>
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

import Vue from "@/vue";
import AssetView from "@/views/components/AssetView.vue";
import * as Asset from "@shared/Assets/Asset";
import {DIR_INDEX} from "@shared/Directories/Directory";
import {imageStore} from '@/Stores/ImageStore';
import {locationStore} from '@/Stores/LocationStore';
import {directoryStore} from '@/Stores/DirectoryStore';
import {babylonController} from "@/Babylon/Engine/BabylonController";
import dispatcher from "@/Dispatcher/Dispatcher";
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";
import { dialogs } from "@/views/Dialogs/Dialog";
import {spawnCreateDirectoryDialog, spawnUpdateDirectoryDialog} from "@/views/Dialogs/DialogSpawners";
import { stateObjectStore } from '@/Stores/StateObjectStore';
import { dcStore } from "@/Stores/DynamicComponentStore";
import { campaignStore } from "@/Stores/CampaignStore";
import { EVENT_TYPE } from "@shared/Events/Types";
import { CLIENT_EVENT, eventBus } from "@/Stores/EventBus";


enum TAB {
    IMAGES = "Images",
    LIGHTS = "Lights",
    CHARACTERS = "Characters",
    LOCATIONS = "Locations",
}

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

export default Vue.extend({
    data: () => ({
        caseSensitive: false,
        TAB: TAB,
        MENU_ITEMS: MENU_ITEMS,
        MENU_ITEM_NAME: MENU_ITEM_NAME,
        tabs: [
            {name: TAB.IMAGES, icon: "mdi-image"},
            {name: TAB.LIGHTS, icon: "mdi-lightbulb"},
            {name: TAB.CHARACTERS, icon: "mdi-head"},
            {name: TAB.LOCATIONS, icon: "mdi-map-marker"},
        ],
        search: null,
        tabModel: TAB.IMAGES,
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Asset lists
        imageItems: [],
        soItems: [],
        files: [],
        graphicItems: [],
        lightItems: [],
        characterItems: [],
        locationItems: [],
        pickedDirectoryID: null,
        imageDirectory: null,
        locationDirectory: null,
        characterDirectory: null,
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        imageMenuItems: [
            MENU_ITEMS.UPDATE_DIRECTORY,
            MENU_ITEMS.CREATE_TOKEN,
            MENU_ITEMS.OPEN_IMAGE,
            MENU_ITEMS.DELETE_IMAGE,
        ],
        imageFolderMenuItems: [
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.UPDATE_DIRECTORY,
            MENU_ITEMS.DELETE_DIRECTORY,
            MENU_ITEMS.CREATE_IMAGE,
        ],
        locationMenuItems: [
            MENU_ITEMS.UPDATE_DIRECTORY,
            MENU_ITEMS.OPEN_LOCATION,
            MENU_ITEMS.DELETE_LOCATION,
            MENU_ITEMS.VIEW_LOCATION,
        ],
        locationFolderMenuItems: [
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.UPDATE_DIRECTORY,
            MENU_ITEMS.DELETE_DIRECTORY,
            MENU_ITEMS.CREATE_LOCATION,
        ],
        characterMenuItems: [
            // MENU_ITEMS.OPEN_CHARACTER,
            MENU_ITEMS.UPDATE_DIRECTORY,
            MENU_ITEMS.DELETE_CHARACTER,
            MENU_ITEMS.VIEW_CHARACTER,
        ],
        characterFolderMenuItems: [
            MENU_ITEMS.CREATE_DIRECTORY,
            MENU_ITEMS.UPDATE_DIRECTORY,
            MENU_ITEMS.DELETE_DIRECTORY,
            MENU_ITEMS.CREATE_CHARACTER,
        ],
    }),
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    components: {
        AssetView,
    },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    methods: {
        menuHandler(eventName: MENU_ITEM_NAME, itemID: string) {
            switch(eventName) {
                // IMAGES
                case MENU_ITEM_NAME.OPEN_IMAGE: {
                    const dir = directoryStore.get(itemID);
                    const url = this.createImageURL(dir.itemID);
                    const dialog = dialogs.imageViewer;
                    dialog.setState({imageSrc: url});
                    dialog.show();
                    return;
                }
                case MENU_ITEM_NAME.CREATE_IMAGE: {
                    this.pickedDirectoryID = itemID
                    const input = this.$refs.fileInput as HTMLInputElement;
                    input.click();
                    return;
                }
                case MENU_ITEM_NAME.DELETE_IMAGE: {
                    const dir = directoryStore.get(itemID);
                    dispatcher.deleteImage(dir.itemID, dir.id);
                    return;
                }

                // LOCATIONS
                case MENU_ITEM_NAME.OPEN_LOCATION: {
                    const dir = directoryStore.get(itemID);
                    const location = locationStore.get(dir.itemID);

                    const url = this.createImageURL(location.mapImageID);
                    const dialog = dialogs.locationViewer;
                    dialog.setState({mapImageSrc: url, location});
                    dialog.state; // TODO: Edit state
                    dialog.show(null);
                    return;
                }
                case MENU_ITEM_NAME.CREATE_LOCATION: {
                    const dialog = dialogs.createLocation;
                    dialog.state.imageItems = this.imageItems;
                    dialog.show(state => dispatcher.createLocation(state.location, itemID));

                    return;
                }
                case MENU_ITEM_NAME.DELETE_LOCATION: {
                    const dir = directoryStore.get(itemID);
                    const location = locationStore.get(dir.itemID);
                    dispatcher.deleteLocation(location.id, itemID);
                    return;
                }
                case MENU_ITEM_NAME.VIEW_LOCATION: {
                    const dir = directoryStore.get(itemID);
                    const location = locationStore.get(dir.itemID);
                    dispatcher.setActiveLocation(location.id);
                    return;
                }

                // TOKENS
                case MENU_ITEM_NAME.CREATE_TOKEN: {
                    const dialog = dialogs.createToken;
                    const imgID = directoryStore.get(itemID).itemID;
                    dialog.state.token.imageID = imgID;
                    dialog.state.soItems = this.soItems;

                    dialog.show((state) => {
                        const locationID = babylonController.getActiveLocationID();
                        const token = state.token;
                        dispatcher.createToken(locationID, token);
                    });
                    return;
                }

                // DIRECTORIES
                case MENU_ITEM_NAME.CREATE_DIRECTORY: {
                    spawnCreateDirectoryDialog(itemID);
                    return;
                }
                case MENU_ITEM_NAME.UPDATE_DIRECTORY: {
                    spawnUpdateDirectoryDialog(itemID);
                    return;
                }
                case MENU_ITEM_NAME.DELETE_DIRECTORY: {
                    dispatcher.deleteDirectory(itemID);
                    return;
                }
                case MENU_ITEM_NAME.DELETE_CHARACTER: {
                    const dir = directoryStore.get(itemID);
                    // let so = stateObjectStore.get(dir.itemID)
                    dispatcher.deleteStateObject(dir.itemID, dir.id, (reply) => {});
                    return;
                }
                case MENU_ITEM_NAME.CREATE_CHARACTER: {
                    const callback = ({returnPayload}: {returnPayload: EVENT_TYPE.STATE_OBJECT_CREATED}) => {
                        const event = returnPayload;
                        const so = event.keyValue.value;
                        const dialog = dialogs.dynamicComponent;
                        const dcID = campaignStore.bindings.createCharacter.dcID;
                        const dc = dcStore.getAssembledDC(dcID);

                        dialog.state.cds = {header: "", cds: dc.cd};
                        dialog.show((output, eventName: string) => {
                            if (eventName == "dismiss") {
                                return dispatcher.deleteStateObject(event.keyValue.value.id, event.directory.id);
                            }
                            const actionTarget = campaignStore.bindings.createCharacter.actionTarget;
                            output.action.characterID = so.id
                            dispatcher.doAction(actionTarget, output.action, (result) => {
                                let soFinal = result.sos[0];
                                console.log("Final SO: ", soFinal);
                                if (soFinal && soFinal.name) {
                                    dispatcher.updateDirectory(event.directory.id, soFinal.name);
                                }
                            });
                        });
                    }
                    dispatcher.createStateObject({mods: [], name: null}, itemID, callback);
                    return;
                }
                case MENU_ITEM_NAME.VIEW_CHARACTER: {
                    const dir = directoryStore.get(itemID);
                    const so = stateObjectStore.get(dir.itemID);
                    console.info("SO: ", so);
                    const dcID = campaignStore.bindings.viewCharacter.dcID;
                    const dialog = dialogs.dynamicComponent;
                    const dc = dcStore.getAssembledDC(dcID);
                    dialog.state.cds = {
                        header: "",
                        cds: dc.cd,
                    };
                    dialog.global = {so};
                    dialog.show((output: any, eventName: string) => {
                        if (eventName == "dismiss") {
                        }
                        else {

                        }
                    });
                    return;
                }
            }
        },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        createImageURL(imageID: string) {
            const image = imageStore.get(imageID);

            if (!image) return;
            return URL.createObjectURL(new Blob([image.fileBuffer]));
        },
        async createImage(event: HTMLInputEvent) {
            const files = event.target.files;
            if (!files || !files.length) return;
            const file = files[0] as File;
            const fileBuffer = await file.arrayBuffer();
            dispatcher.createImage(file.name, fileBuffer, this.pickedDirectoryID);
            this.files = null;
        },
        imageCreated(id: string) {
            const image = imageStore.get(id);
            this.imageItems.push({
                id: image.id,
                name: image.name,
            });
        },
        imageDeleted(id: string) {
            let index = this.imageItems.findIndex(img => img.id == id);
            this.imageItems.splice(index, 1);
        },
        locationCreated(id: string) {
            const location = locationStore.get(id);
            this.locationItems.push({
                id: location.id,
                name: location.name,
            });
        },
        locationDeleted(id: string) {
            let index = this.locationItems.findIndex(loc => loc.id == id);
            this.locationItems.splice(index, 1);
        },
        stateObjectCreated(id: string) {
            const so = stateObjectStore.get(id);
            this.soItems.push({
                id: so.id,
                name: so.name,
            });
        },
        stateObjectDeleted(id: string) {
            let index = this.soItems.findIndex(so => so.id == id);
            this.soItems.splice(index, 1);
        },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    },
    computed: {
        filter () {
            return this.caseSensitive? (item: Array<string>, search: string, textKey: number) => item[textKey].indexOf(search) > -1 : undefined
        },
    },
    mounted() {
        eventBus.registerHandler(CLIENT_EVENT.IMAGE_ADDED, this.imageCreated);
        eventBus.registerHandler(CLIENT_EVENT.IMAGE_DELETED, this.imageDeleted);
        eventBus.registerHandler(CLIENT_EVENT.LOCATION_ADDED, this.locationCreated);
        eventBus.registerHandler(CLIENT_EVENT.LOCATION_DELETED, this.locationCreated);
        eventBus.registerHandler(CLIENT_EVENT.STATE_OBJECT_ADDED, this.stateObjectDeleted);
        eventBus.registerHandler(CLIENT_EVENT.STATE_OBJECT_DELETED, this.stateObjectDeleted);

        // Pull all assets from the stores and add them to the view
        this.imageItems = imageStore.arrayMap(asset => ({id: asset.id, name: asset.name}));
        this.soItems = stateObjectStore.arrayMap(asset => ({id: asset.id, name: asset.name}));
        // this.locationItems = locationStore.arrayMap(asset => ({id: asset.id, name: asset.name}));

        console.log(directoryStore.root.children);

        this.imageDirectory = directoryStore.root.children[DIR_INDEX.IMAGES];
        this.locationDirectory = directoryStore.root.children[DIR_INDEX.LOCATIONS];
        this.characterDirectory = directoryStore.root.children[DIR_INDEX.CHARACTERS];
    }
});
</script>