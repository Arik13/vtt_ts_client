<template>
    <v-card tag="canvas" ref="renderCanvas" width="100%" height="100%" dark tile></v-card>
</template>

<script lang="ts">
import Vue from "vue";
import engineAPI from "../babylon/EngineAPI";

export default Vue.extend({
    data: () => ({
        engineController: null,
    }),
    props: {
        bus: {
            default: null,
            type: Vue,
        },
    },
    mounted() {
        const ref = this.$refs.renderCanvas as Vue;
        const el = ref.$el as HTMLCanvasElement;
        this.engineController = engineAPI(el);
        this.bus.$on('resized', () => {
            this.engineController.resize();
        });
        setTimeout(() => {this.engineController.resize();}, 400);
    }
});
</script>