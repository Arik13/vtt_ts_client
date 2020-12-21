

<template>
    <v-dialog v-model="d.on" dark max-width="400px" width="100%">
        <v-card>
            <v-card-title>
                Create Token
            </v-card-title>
            <v-card-text>
                <v-text-field label="Label" v-model="d.state.label" />
                <v-text-field label="Rank" v-model="d.state.x" />
                <v-text-field label="File" v-model="d.state.z" />
                <v-text-field label="Width" v-model="d.state.width" />
                <v-text-field label="Length" v-model="d.state.length" />
                <v-btn @click="d.hide(true)">Create</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {DialogObject} from "../DialogObject";

export default Vue.extend({
    props: {
        d: Object as PropType<DialogObject<any>>
    },
})
</script>