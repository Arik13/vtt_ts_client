<template>
<!-- Asset Manager -->
    <v-card dark height="100%" tile>

        <!-- Search element -->
        <!-- <v-card flat dense tile>
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
        </v-card> -->

        <!-- ---------------------------------------------------------------------------- -->
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
                                v-if="locationDirectory"
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
                                :assetClickEventName="MENU_ITEM_NAME.OPEN_LOCATION"
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

import Vue from "vue";
import AssetView from "@/views/components/AssetView.vue";
import * as Asset from "@shared/Assets/Asset";
import {imageStore} from '@/Stores/ImageStore';
import {locationStore} from '@/Stores/LocationStore';
import {directoryStore} from '@/Stores/DirectoryStore';
import {Subscriber} from "@/Stores/Subscriber";
import {babylonController} from "@/Babylon/Engine/BabylonController";
import dispatcher from "@/Dispatcher/Dispatcher";
import {MENU_ITEMS, MENU_ITEM_NAME} from "@/views/Menus/MenuItems";
import {DIALOG_NAME, dialogMap, ImageViewerState, CreateLocationState, LocationViewerState} from "@/views/Dialogs/Dialog";
import {DialogObject} from "@/views/Dialogs/DialogObject";
import {spawnCreateDirectoryDialog, spawnUpdateDirectoryDialog} from "@/views/Dialogs/DialogFactories";
import { stateObjectStore } from '@/Stores/StateObjectStore';
import { dcStore } from "@/Stores/DynamicComponentStore";
import { campaignStore } from "@/Stores/CampaignStore";
import { EVENT_TYPE } from "@shared/Events/Types";
import { logDepthDeclaration } from "babylonjs/Shaders/ShadersInclude/logDepthDeclaration";


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
        "asset-view": AssetView,
    },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    methods: {
        menuHandler(eventName: MENU_ITEM_NAME, itemID: string) {
            switch(eventName) {
                // IMAGES
                case MENU_ITEM_NAME.OPEN_IMAGE: {
                    const dir = directoryStore.getDirectory(itemID);
                    const url = this.createImageURL(dir.itemID);
                    const dialog = dialogMap.get(DIALOG_NAME.IMAGE_VIEWER);
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
                    const dir = directoryStore.getDirectory(itemID);
                    dispatcher.deleteImage(dir.itemID, dir.id);
                    return;
                }

                // LOCATIONS
                case MENU_ITEM_NAME.OPEN_LOCATION: {
                    const dir = directoryStore.getDirectory(itemID);
                    const location = locationStore.get(dir.itemID);

                    const url = this.createImageURL(location.mapImageID);
                    const dialog = dialogMap.get(DIALOG_NAME.LOCATION_VIEWER) as DialogObject<LocationViewerState>;
                    dialog.setState({
                        mapImageSrc: url,
                        location,
                    });
                    dialog.state; // TODO: Edit state
                    dialog.show(null);
                    return;
                }
                case MENU_ITEM_NAME.CREATE_LOCATION: {
                    const dialog = dialogMap.get(DIALOG_NAME.CREATE_LOCATION) as DialogObject<CreateLocationState>;
                    dialog.state.imageItems = this.imageItems;
                    dialog.show((state: CreateLocationState) => {
                        dispatcher.createLocation(state.location, itemID);
                    });

                    return;
                }
                case MENU_ITEM_NAME.DELETE_LOCATION: {
                    const dir = directoryStore.getDirectory(itemID);
                    const location = locationStore.get(dir.itemID);
                    dispatcher.deleteLocation(location.id, itemID);
                    return;
                }
                case MENU_ITEM_NAME.VIEW_LOCATION: {
                    const dir = directoryStore.getDirectory(itemID);
                    const location = locationStore.get(dir.itemID);
                    dispatcher.setActiveLocation(location.id);
                    return;
                }

                // TOKENS
                case MENU_ITEM_NAME.CREATE_TOKEN: {
                    const dialog = dialogMap.get(DIALOG_NAME.CREATE_TOKEN) as DialogObject<any>;
                    const imgID = directoryStore.getDirectory(itemID).itemID;
                    dialog.state.imageID = imgID;
                    dialog.show((state: any) => {
                        const locationID = babylonController.getActiveLocationID();
                        const token: Asset.Token.Data = {
                            name: state.label,
                            imageID: state.imageID,
                            tokenModel: {
                                position: {
                                    x: state.x,
                                    z: state.z,
                                },
                                dimensions: {
                                    width: state.width,
                                    length: state.length,
                                }
                            },
                        }
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
                    const dir = directoryStore.getDirectory(itemID);
                    let so = stateObjectStore.get(dir.itemID)
                    console.log(so);

                    dispatcher.deleteStateObject(dir.itemID, dir.id, (reply) => {
                        console.log(reply);
                        console.log("DELETED!");
                    });
                    return;
                }
                case MENU_ITEM_NAME.CREATE_CHARACTER: {
                    const callback = (reply: any) => {
                        console.log("Reply: ", reply);

                        const event = reply.returnPayload as EVENT_TYPE.STATE_OBJECT_CREATED;
                        const so = event.keyValue.value;
                        const dialog = dialogMap.get(DIALOG_NAME.DYNAMIC_COMPONENT);
                        const dcID = campaignStore.clientConfig.createCharacter.dcID;
                        // const dc = dcStore.get(dcID);
                        const dc = dcStore.getAssembledDC(dcID);

                        dialog.state.cds = {
                            header: "",
                            cds: dc.cd,
                        };
                        dialog.show((output: any, eventName: string) => {
                            if (eventName == "dismiss") {
                                dispatcher.deleteStateObject(event.keyValue.value.id, event.directory.id, (reply) => {
                                    console.log("State Object Dismissed");
                                });
                            }
                            else {
                                const actionTarget = campaignStore.clientConfig.createCharacter.actionTarget;
                                output.action.characterID = so.id
                                dispatcher.doAction(actionTarget, output.action, (result: any) => {
                                    let soFinal = result.result.sos[0] as any;
                                    if (soFinal && soFinal.name) {
                                        dispatcher.updateDirectory(event.directory.id, soFinal.name);
                                    }
                                });
                            }
                        });
                    }
                    dispatcher.createStateObject({mods: []}, itemID, callback);
                    return;
                }
                case MENU_ITEM_NAME.VIEW_CHARACTER: {
                    const dir = directoryStore.getDirectory(itemID);
                    const so = stateObjectStore.get(dir.itemID);
                    // console.log("SO: ", JSON.stringify(so));
                    console.log("SO: ", so);
                    const dcID = campaignStore.clientConfig.viewCharacter.dcID;
                    const dialog = dialogMap.get(DIALOG_NAME.DYNAMIC_COMPONENT);
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
                    // dispatcher.doAction("CreateCharacter", [], [so.id]);
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
            for (let i = 0; i < this.imageItems.length; i++) {
                if (this.imageItems[i].id == id) {
                    this.imageItems.splice(i, 1);
                }
            }
        },
        locationCreated(id: string) {
            const location = locationStore.get(id);
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
        // Subscribe to changes in the asset stores
        const imageSubscriber: Subscriber = {
            added: this.imageCreated,
            deleted: this.imageDeleted,
        }
        const locationSubscriber: Subscriber = {
            added: this.locationCreated,
            deleted: this.locationDeleted,
        }
        imageStore.subscribe(imageSubscriber);
        locationStore.subscribe(locationSubscriber);

        // Pull all assets from the stores and add them to the view
        imageStore.forEach(image => {
            this.imageItems.push({
                id: image.id,
                name: image.name,
            })
        });
        locationStore.forEach(location => {
            this.locationItems.push({
                id: location.id,
                name: location.name,
            })
        });
        this.imageDirectory = directoryStore.getRoot().children[0];
        this.locationDirectory = directoryStore.getRoot().children[1];
        this.characterDirectory = directoryStore.getRoot().children[3];
    }
});
</script>