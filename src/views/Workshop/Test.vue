<template>
    <dynamic-list :prop="prop"></dynamic-list>
</template>

<script lang="ts">
import Vue from 'vue'
import "./ComponentMap";
import DynamicList from "./Components/DynamicList.vue";

import cds from "./cds";

export default Vue.extend({
    data: () => ({
        prop: {
            cds,
        }
    }),
    components: {
        DynamicList,
    },
})
</script>