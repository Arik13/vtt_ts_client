<template>
    <v-container
            height="100%" width="100%"
            class="overflow-y-auto"
        >
        <v-card flat dark style="padding: 0px" max-height="700px" height="100%" width="100%">
            <v-card-title style="margin: 0; padding: 0">{{title}}</v-card-title>
            <v-card-text style="padding: 0" height="100%" width="100%">
                <asset-tree
                    class="assetTree"
                    :directory="directory"
                    :depth="0"
                    :assetViewController="assetViewController"
                    @click="menuBus(assetClickEventName, directory)"
                />
            </v-card-text>
        </v-card>
        <!-- Asset Menu -->
        <v-menu
            dark
            v-if="showAssetMenu"
            v-model="showAssetMenu"
            :position-x="x"
            :position-y="y"
            absolute
            offset-y
            transition="none"
            tile
        >
            <v-list dense striped style="padding: 0px; margin: 0px;">
                <v-list-item-group>
                    <v-list-item v-for="(menuItem, i) in menuItems" :key="i" :style="menuItem.style">
                        <v-list-item-title @click="menuBus(menuItem.name, menuedItemID)">
                            {{ menuItem.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>

        <!-- Folder Menu -->
        <v-menu
            dark
            v-if="showFolderMenu"
            v-model="showFolderMenu"
            :position-x="x"
            :position-y="y"
            absolute
            offset-y
            transition="none"
            tile
        >
            <v-list dense striped style="padding: 0px; margin: 0px;">
                <v-list-item-group>
                    <v-list-item v-for="(menuItem, i) in folderMenuItems" :key="i" :style="menuItem.style" @click="menuBus(menuItem.name, menuedItemID)">
                        <v-list-item-title>
                            {{ menuItem.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>
    </v-container>
</template>

<script lang="ts">
import { Directory } from '@shared/Directories/Directory';
import Vue, { PropType } from 'vue'
import AssetTree from "./AssetTree.vue"
import dispatcher from '@/Dispatcher/Dispatcher';

export interface AssetViewController {
    contextMenuEvent: (e: MouseEvent, directory: Directory) => void;
    dragStartEvent: (e: DragEvent, directory: Directory) => void;
    dragEnterEvent: (e: DragEvent, directory: Directory) => void;
    dropEvent: (e: DragEvent, directory: Directory) => void;
    clickEvent: (directory: Directory) => void;
}

type MenuItem = {
    title: string;
    name: string;
}

export default Vue.extend({
    data: () => ({
        showAssetMenu: false,
        showFolderMenu: false,
        x: 0,
        y: 0,
        open: [1, 2],
        caseSensitive: false,
        menuedItemID: null,
        assetViewController: null as AssetViewController,
        draggedNode: null as Directory,
        draggedOverNode: null as Directory,
    }),
    props: {
        title: null,
        assets: null,
        filter: null,
        search: null,
        folderMenuItems: null,
        menuItems: null,
        menuBus: null as PropType<(eventName: string, itemID: string) => void>,
        assetClickEventName: null as PropType<string>,
        directory: null,
    },
    components: {
        AssetTree,
    },
    mounted() {
        this.assetViewController = {
            contextMenuEvent: (e: MouseEvent, directory: Directory) => {
                this.x = e.x;
                this.y = e.y;
                this.menuedItemID = directory.id;
                if (directory.itemID) {
                    this.showFolderMenu = false;
                    this.showAssetMenu = true;
                }
                else {
                    this.showAssetMenu = false;
                    this.showFolderMenu = true;
                }
            },
            dragStartEvent: (event: DragEvent, dragNode: Directory) => {
                this.draggedNode = dragNode;
            },
            dragEnterEvent: (event: DragEvent, dragNode: Directory) => {
                this.draggedOverNode = dragNode;
            },
            dropEvent: (event: DragEvent, dropNode: Directory) => {
                dispatcher.moveDirectory(this.draggedNode, dropNode);
            },
            clickEvent: (directory: Directory) => {
                if (directory.itemID) {
                    this.menuBus(this.assetClickEventName, directory.id);
                }
            }
        }
    }
})
</script>

<style>
    .zebra {
        background-color: rgba(255, 255, 255, 0.05);
    }
    .assetTree {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .v-list {
        /* height: 600px; */
        height: 100%;
        overflow-y: auto;
        /* position: absolute; */
    }
</style>