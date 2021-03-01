<template>
    <div>
        <h3 v-if="value.header" style="margin: 0px 0px 10px 0px">{{value.header}}</h3>
        <div v-if="value.paragraphs">
            <p v-for="(paragraph, i) in value.paragraphs" :key="i">
                {{ paragraph }}
            </p>
        </div>
        <v-select
            dark
            outlined
            v-model="selectedItems"
            multiple
            :items="items"
            :label="value.label"
            :max="value.maxSelectable"
            :change="handleSelection()"
            menu-props="auto"
        />
        <br>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import DynamicElement from "./DynamicElement.vue";
import {ChoiceData, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes"

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.ChooseSome>},
        global: {type: Object as PropType<any>}
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
            let selectedValues: any[] = [];
            this.selectedItems.forEach(selection => {
                let choice = this.value.choices.find(choice => {
                    return choice.header == selection;
                })
                selectedValues.push(choice.value);
            });
            let choice: ChoiceData = {
                param: this.value.param,
                value: selectedValues,
            }
            return choice;
        },
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        reset() {
            this.init();
        },
        validate() {
            return this.selectedItems.length == this.value.maxSelectable;
        },
        init() {
            this.isChoiceNode = true;
            this.items = [];
            this.selectedItems = [];
            for (let i = 0; i < this.value.choices.length; i++) {
                this.items.push({
                    text: this.value.choices[i].header,
                    choice: this.value.choices[i],
                    disabled: false,
                });
            }
        }
    },
    mounted() {
        this.init();
    }
});
</script>