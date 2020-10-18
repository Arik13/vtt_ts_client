<template>
    <div>
        <h3 v-if="value.header" style="margin: 0px 0px 10px 0px">{{value.header}}</h3>
        <v-select
            outlined
            v-model="selectedItems"
            multiple
            :items="items"
            :label="value.label"
            :max="value.maxSelectable"
            :change="handleSelection()"
        />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import DynamicElement from "./DynamicElement.vue";
import {COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes"

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.ChooseSome>},
    },
    data: () => ({
        selectedItems: [],
        items: [],
    }),

    methods: {
        handleSelection() {
            // Selections are not used up, enable all items
            if (this.selectedItems.length != this.value.maxSelectable) {
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
        },
        getSelectedChoice() {
            // return this.selectedItems
        }
    },
    mounted() {
        this.isChoiceNode = true;
        for (let i = 0; i < this.value.choices.length; i++) {
            this.items.push({
                text: this.value.choices[i].header,
                disabled: false,
            });
        }
    }
});
</script>