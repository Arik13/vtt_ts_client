<template>
    <div>
        <h3>
            {{ value.header }}
        </h3>
        <p v-for="(paragraph, i) in value.paragraphs" :key="i">
            {{ paragraph }}
        </p>
        <br>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {COMPONENT_PROP} from "../ComponentTypes";

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.TextBlock>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
    },
    mounted() {
        this.isActive = false;
    }
})
</script>