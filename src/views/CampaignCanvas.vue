<template>
    <v-card tag="canvas" ref="renderCanvas" width="100%" height="100%" dark tile></v-card>
</template>

<script lang="ts">
import Vue from "vue";
import engineAPI from "../babylon/engineAPI";

export default Vue.extend({
    data: () => ({
        engine: null,
    }),
    props: {
        bus: {
            default: null,
            type: Vue,
        },
    },
    mounted() {
        const ref = this.$refs["renderCanvas"] as Vue;
        this.engine = engineAPI(ref.$el);
        this.bus.$on('resized', () => {
            this.engine.resize();
        });
        setTimeout(() => {this.engine.resize();}, 400);
    }
});
</script>