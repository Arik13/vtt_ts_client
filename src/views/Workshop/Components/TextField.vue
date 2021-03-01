<template>
    <div>
        <h3 v-if="value.header" style="margin: 0px 0px 10px 0px">{{value.header}}</h3>
        <div v-if="value.paragraphs">
            <p v-for="(paragraph, i) in value.paragraphs" :key="i">
                {{ paragraph }}
            </p>
        </div>
        <v-text-field
            style="margin: 20px 0px 0px 0px"
            v-model="text"
            outlined
            :label="value.label"
            clearable
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
        value: {type: Object as PropType<COMPONENT_PROP.TextField>},
        global: {type: Object as PropType<any>}
    },
    data: () => ({
        text: null
    }),

    methods: {
        getSelectedChoice() {
            let choice: ChoiceData = {
                param: this.value.param,
                value: this.text,
            }
            return choice;
        },
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        validate() {
            return this.text !== null;
        },
        reset() {
            this.init();
        },
        init() {
            this.isChoiceNode = true;
        }
    },
    mounted() {
        this.init();
    }
});
</script>