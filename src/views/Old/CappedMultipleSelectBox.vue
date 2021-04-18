<template>
    <v-select
        dark
        outlined
        v-model="selectedItems"
        multiple
        menu-props="dark"
        :items="items"
        :label="propData.label"
        :max="propData.maxSelectable"
        :change="handleSelection()"
      >
      </v-select>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: [
        "propData"
        /*
            propData expects:
                - items (an array of strings)
                - label (The label shown on the component before any selections are made)
                - maxSelectable (The max number of items that can be selected)
        */
    ],
    data: () => ({
        selectedItems: [],
        items: [],
    }),

    methods: {
        handleSelection() {
            // Selections are not used up, enable all items
            if (this.selectedItems.length != this.propData.numberSelectable) {
                for (let i = 0; i < this.items.length; i++) {
                    this.items[i].disabled = false;
                }
            }
            // Selections are used up, disable all non selected items
            else {
                for (let i = 0; i < this.items.length; i++) {
                    if (!this.selectedItems.includes(this.items[i].text)) {
                        this.items[i].disabled = true;
                    }
                }
            }
        }
    },
    mounted() {
        for (let i = 0; i < this.propData.items.length; i++) {
            this.items.push({
                text: this.propData.items[i],
                disabled: false,
            });
        }
    }
});
</script>