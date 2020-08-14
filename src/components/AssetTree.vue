<template>
    <v-container
            height="100%" width="100%"
            class="overflow-y-auto"
        >
        <v-card flat dark style="padding: 0px" height="100%" width="100%">
            <v-card-title style="margin: 0; padding: 0">{{title}}</v-card-title>
            <v-card-text style="padding: 0" height="100%" width="100%">
                <v-list dense striped>
                    <v-list-item-group>
                        <v-list-item
                            v-for="(element, i) in items" :key="element.id" @contextmenu="show(element.id, $event)" :class="zebraStyle(i)"
                            @click="menuBus(assetClickEventCode, element.id)"
                        >
                            {{ element.name }}
                        </v-list-item>
                    </v-list-item-group>

                </v-list>
            </v-card-text>
        </v-card>
        <v-menu
            v-model="showMenu"
            :position-x="x"
            :position-y="y"
            absolute
            offset-y
            transition="none"
            tile
        >
            <v-list dense flat style="padding: 0px; margin: 0px;">
                <v-list-item-group>
                    <v-list-item v-for="(menuItem, i) in menuItems" :key="i">
                        <v-list-item-title @click="menuBus(menuItem.eventCode, menuedItemID)">
                            {{ menuItem.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import draggable from 'vuedraggable';

type MenuItem = {
    title: string;
    eventCode: string;
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
        items: null,
        filter: null,
        search: null,
        menuItems: null,
        menuBus: null,
        assetClickEventCode: null,
    },
    methods: {
        show(id: string, e: any) {
            this.menuedItemID = id;
            e.preventDefault()
            this.showMenu = false
            this.x = e.clientX
            this.y = e.clientY
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
</style>