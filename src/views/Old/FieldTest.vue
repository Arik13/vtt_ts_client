<template>
    <div>
        {{ value.key }}: {{ value.value }}
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "../DC_Module/DynamicElement.vue";
import {COMPONENT_PROP} from "../DC_Module/ComponentTypes";

interface FieldTest {
    key: string;
    value: string | number;
}

export default Vue.extend({
    props: {
        value: {type: Object as PropType<FieldTest>}
    }
})
</script>