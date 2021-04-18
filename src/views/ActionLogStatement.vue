<template>
    <div style="padding: 0 0 5px 0; color: yellow">
        {{ source.text }}
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        index: {type: Number},
        source: {
            type: Object,
            default () {{}}
        }
    }
})
</script>