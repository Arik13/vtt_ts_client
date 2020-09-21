<template>
    <div>
        <h3>
            {{ prop.title }}
        </h3>
        <p>
            {{ prop.text }}
        </p>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {COMPONENT_PROP} from "../ComponentTypes";

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.Paragraph>}
    }
})
</script>