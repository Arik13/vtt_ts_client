<template>
        <v-card tag="canvas" ref="renderCanvas" width="100%" height="100%" dark tile />
</template>

<script lang="ts">
/*
    This is the component in which the game is viewed.
    The WebGL canvas attached to the v-card component is the target for the babylon graphics engine.

*/
import Vue from "vue";
import {initializeBabylon, BabylonController} from "@/Babylon/Engine/BabylonController";

export default Vue.extend({
    data: () => ({
        engineController: null as BabylonController,
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
        this.engineController = initializeBabylon(el);
        this.bus.$on('resized', () => {
            this.engineController.resize();
        });
        setTimeout(() => {this.engineController.resize();}, 400);
    }
});
</script>