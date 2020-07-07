<template>
    <v-card tag="canvas" ref="renderCanvas" width="100%" height="100%" dark tile></v-card>
</template>

<script>
import engineAPI from "../babylon/engineAPI";
export default {
    data: () => ({
        engine: null,
    }),
    props: {
        bus: null,
    },
    mounted() {
        this.engine = engineAPI(this.$refs["renderCanvas"].$el);
        this.bus.$on('resized', () => {
            this.engine.resize();
        });
        setTimeout(() => {this.engine.resize();}, 400);
    }
}
</script>