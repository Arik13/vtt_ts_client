<template>
    <div>
        <h3>
            {{ value.header }}
        </h3>
        <p v-for="(paragraph, i) in value.paragraphs" :key="i">
            {{ paragraph }}
        </p>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {COMPONENT_PROP} from "../ComponentTypes";

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.TextBlock>},
    },
    methods: {
        setActive() {
            this.isActive = true;
        }
    },
    mounted() {
        this.isActive = false;
    }
})
</script>