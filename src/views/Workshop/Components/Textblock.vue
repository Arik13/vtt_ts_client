<template>
    <div>
        <h3>
            {{ prop.header }}
        </h3>
        <p v-for="(paragraph, i) in prop.paragraphs" :key="i">
            {{ paragraph }}
        </p>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {COMPONENT_PROP} from "../ComponentTypes";

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.TextBlock>}
    },
})
</script>