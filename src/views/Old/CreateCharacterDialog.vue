<template>
    <v-dialog v-model="d.on" dark max-width="400px" width="100%">
        <v-card>
            <v-card-title>
                Create Directory
            </v-card-title>
            <v-card-text>
                <v-text-field label="Name" v-model="d.state.name" />
                <v-btn @click="d.hide(true)">Create</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {DialogObject} from "../Dialogs/DialogObject";

export default Vue.extend({
    props: {
        d: Object as PropType<DialogObject<any>>
    },
})
</script>