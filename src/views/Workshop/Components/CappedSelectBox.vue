<template>
    <div>
        <h3 v-if="prop.header" style="margin: 0px 0px 10px 0px">{{prop.header}}</h3>
        <v-select
            outlined
            v-model="selectedItems"
            multiple
            :items="items"
            :label="prop.label"
            :max="prop.maxSelectable"
            :change="handleSelection()"
        />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes"

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.ChooseSome>}
    },
    data: () => ({
        selectedItems: [],
        items: [],
    }),

    methods: {
        handleSelection() {
            // Selections are not used up, enable all items
            if (this.selectedItems.length != this.prop.maxSelectable) {
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
        for (let i = 0; i < this.prop.choices.length; i++) {
            this.items.push({
                text: this.prop.choices[i].text,
                disabled: false,
            });
        }
    }
});
</script>