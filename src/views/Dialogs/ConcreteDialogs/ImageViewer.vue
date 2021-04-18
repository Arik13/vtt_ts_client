<template>
    <!-- Image Viewer -->
    <v-dialog v-model="d.on" dark max-width="400px" width="100%">

        <v-img :src="d.state.imageSrc" />
    </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {DialogObject} from "../DialogObject";

export default Vue.extend({
    props: {
        d: Object as PropType<DialogObject<any>>
    },
    mounted() {

    }
})
</script>