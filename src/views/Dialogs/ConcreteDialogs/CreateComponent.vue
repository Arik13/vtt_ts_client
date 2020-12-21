<template>
    <v-dialog v-model="d.on" dark max-width="400px" width="100%">
        <v-card>
            <v-card-title>
                Create Component
            </v-card-title>
            <v-card-text>
                <v-text-field label="Name" v-model="d.state.name" />
                <!-- <v-text-field label="Type" v-model="d.state.type" /> -->
                <!-- <v-select
                    label="Type"
                    :items="types"
                    v-model="d.state.type"
                /> -->
                <v-btn @click="d.hide(true)">Create</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {DialogObject} from "../DialogObject";

export default Vue.extend({
    // data: () => ({
    //     types: [
    //         "MODIFICATION",
    //         "ACTION",
    //     ],
    // }),
    props: {
        d: Object as PropType<DialogObject<any>>
    },
})
</script>