<template>
    <v-container
            height="100%" width="100%"
            class="overflow-y-auto"
        >
        <v-card flat dark style="padding: 0px" max-height="700px" height="100%" width="100%">
            <v-card-title style="margin: 0; padding: 0">{{title}}</v-card-title>
            <v-card-text style="padding: 0" height="100%" width="100%">
                <v-list dense striped height="100%">
                    <v-list-item-group height="100%">
                        <v-list-item
                            v-for="(element, i) in assets"
                            :key="element.id"
                            :class="zebraStyle(i)"
                            @contextmenu="show(element.id, $event)"
                            @click="menuBus(assetClickEventName, element.id)"
                        >
                            {{ element.name }}
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card-text>
        </v-card>
        <v-menu
            dark
            v-model="showMenu"
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
    </v-container>
</template>

<script lang="ts">
/*
    The asset tree does not currently display a tree of assets, but a list of assets.
    A folder system view will provided in the future. This component is passed a list of
    menu items, each with a name and handler. Each asset can be right clicked, and a menu
    will be provided. Clicking a menu item will pass the ID of the right clicked asset to
    the menu item handler.
*/

import Vue from "vue"

type MenuItem = {
    title: string;
    eventName: string;
}

export default Vue.extend({
    data: () => ({
        showMenu: false,
        x: 0,
        y: 0,
        open: [1, 2],
        caseSensitive: false,
        menuedItemID: null,
    }),
    props: {
        title: null,
        assets: null,
        filter: null,
        search: null,
        menuItems: null,
        menuBus: null,
        assetClickEventName: null,
    },
    methods: {
        show(id: string, event: MouseEvent) {
            this.menuedItemID = id;
            event.preventDefault()
            this.showMenu = false
            this.x = event.clientX
            this.y = event.clientY
            this.$nextTick(() => {
                this.showMenu = true
            })
        },
        zebraStyle(rowIndex: number) {
            if (rowIndex % 2 == 0) {
                return "zebra"
            }
        },
    },
})
</script>

<style>
    .zebra {
        background-color: rgba(255, 255, 255, 0.05);
    }
    .v-list {
        /* height: 600px; */
        height: 100%;
        overflow-y: auto;
        /* position: absolute; */
    }
</style>