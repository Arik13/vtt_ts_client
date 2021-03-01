<template>
    <v-dialog v-model="d.on" dark max-width="400px" width="100%">
        <v-card>
            <v-card-title>
                Rename
            </v-card-title>
            <v-card-text>
                <v-text-field label="Name" v-model="d.state.name" @focus="$event.target.select()" />
                <v-btn @click="d.hide(true)">Rename</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import { UpdateDirectoryState } from '../Dialog';
import {DialogObject} from "../DialogObject";

export default Vue.extend({
    props: {
        d: Object as PropType<DialogObject<UpdateDirectoryState>>
    },
})
</script>