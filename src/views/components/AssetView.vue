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
                />
            </v-card-text>
        </v-card>
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
                        <v-list-item-title @click="menuBus(menuItem.eventName, menuedItemID)">
                            {{ menuItem.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>
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
                    <v-list-item v-for="(menuItem, i) in folderMenuItems" :key="i" :style="menuItem.style" @click="menuBus(menuItem.eventName, menuedItemID)">
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
import Vue from 'vue'
import AssetTree from "./AssetTree2.vue"
import dispatcher from '@/Dispatcher/Dispatcher';

export interface AssetViewController {
    contextMenuEvent: (e: MouseEvent, directory: Directory) => void;
    dragStartEvent: (e: DragEvent, directory: Directory) => void;
    dragEnterEvent: (e: DragEvent, directory: Directory) => void;
    dropEvent: (e: DragEvent, directory: Directory) => void;
}

type MenuItem = {
    title: string;
    eventName: string;
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
        menuBus: null,
        assetClickEventName: null,
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
                // let insertionIndex = 0;
                // if (dropNode.itemID) {
                //     insertionIndex = dropNode.parent.children.findIndex(node => {
                //         return node.id == dropNode.id;
                //     }) + 1;
                //     dropNode = dropNode.parent;
                // }

                // let dragNode = this.draggedNode;
                // // directoryStore.moveDirectory(dropNode.id, dragNode.id);
                // let isAncestor = (superNode: Directory, subNode: Directory): boolean => {
                //     if (superNode.id == subNode.id) return true;
                //     if (!subNode.parent) return false;
                //     return isAncestor(superNode, subNode.parent);
                // }
                // if (isAncestor(dragNode, dropNode)) return;

                // let dragParentNode = dragNode.parent;
                // let dragIndex = dragParentNode.children.findIndex((dropNode: Directory) => {
                //     return dropNode.id == this.draggedNode.id;
                // });
                // dragParentNode.children.splice(dragIndex, 1);
                // dropNode.children.splice(insertionIndex, 0, dragNode);
                // dragNode.parent = dropNode;
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