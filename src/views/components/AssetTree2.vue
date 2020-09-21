<template>
    <div>
        <div
            class="treeRow"
            draggable
            @contextmenu="handleContextMenu($event)"
            @dragstart="handleDragStart($event)"
            @dragenter="handleDragEnter($event)"
            @drop="handleDrop($event)"
        >
            <div v-if="isFolder" :style="folderIndent">
                <v-btn icon @click="toggleOpen()" small>
                    <v-icon>
                        {{ arrowIcon }}
                    </v-icon>
                </v-btn>
                <v-icon small>{{ folderIcon }}</v-icon>
                {{ directory.name }}
            </div>
            <div v-else :style="assetIndent">
                {{ directory.name }}
            </div>
        </div>
        <transition-group name="fade">
            <!-- The + 1 to i is just to make the vue compiler shutup -->
                <!-- :nodes="node.nodes"
                :label="node.item.label" -->
                <!-- :root="node" -->
            <asset-tree
                v-show="directory.isOpen"
                v-for="(subDirectory, i) in directory.children"
                :depth="depth + 1"
                :key="i + 1"
                :assetViewController="assetViewController"
                :directory="subDirectory"
            />
        </transition-group>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {AssetViewController} from "./AssetView.vue";
import {Component, Prop} from 'vue-property-decorator';
import { Directory } from '@shared/Directories/Directory';

type MenuItem = {
    title: string;
    eventName: string;
}

@Component({})
export default class AssetTree extends Vue{

    @Prop({type: Number})
    public depth: number;

    @Prop({type: Object as () => Directory})
    public directory: Directory;

    @Prop({type: Object as () => AssetViewController})
    public assetViewController: AssetViewController;

    // DATA ___________________________________________________
    name: "asset-tree";
    indentWidth = 22;
    assetExtraIndent = 27;

    // COMPUTED ___________________________________________________
    get folderIndent() {
        const indentWidth = this.indentWidth * this.depth;
        return { transform: `translate(${indentWidth}px)` }
    }
    get assetIndent() {
        const indentWidth = this.indentWidth * this.depth + this.assetExtraIndent;
        return { transform: `translate(${indentWidth}px)` }
    }
    get arrowIcon() {
        return this.directory.isOpen? "mdi-chevron-down" : "mdi-chevron-right";
    }
    get folderIcon() {
        return this.directory.isOpen? "mdi-folder-open" : "mdi-folder";
    }
    get isFolder() {
        return !(this.directory.itemID);
    }

    // METHODS ___________________________________________________
    toggleOpen() {
        this.directory.isOpen = !this.directory.isOpen;
    }
    handleContextMenu(event: MouseEvent) {
        event.preventDefault();
        console.log("Context Directory: ", this.directory);
        this.assetViewController.contextMenuEvent(event, this.directory);
    }
    handleDragStart(event: DragEvent) {
        this.assetViewController.dragStartEvent(event, this.directory);
    }
    handleDragEnter(event: DragEvent) {
        this.assetViewController.dragEnterEvent(event, this.directory);
    }
    handleDrop(event: DragEvent) {
        event.preventDefault();
        this.assetViewController.dropEvent(event, this.directory);
    }
}
</script>

<style scoped>
    .treeRow {
        background-color: rgb(52, 52, 52);
        box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.3);
        padding: 3px 0px 3px 5px;
    }
</style>