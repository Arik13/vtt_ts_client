<template>
    <v-dialog v-model="d.on" dark max-width="400px" width="100%">
            <v-card>
                <v-card-title>
                    Create Location
                </v-card-title>
                <v-card-text>
                    <v-select
                        :items="d.state.imageItems"
                        item-text="name"
                        item-value="id"
                        v-model="d.state.location.mapImageID"
                        label="Image"
                    />
                    <v-text-field label="Name" v-model="d.state.location.name" />
                    <v-text-field label="Ranks" v-model="d.state.location.locationModel.ranks" />
                    <v-text-field label="Files" v-model="d.state.location.locationModel.files" />
                    <v-text-field label="Tile Length" v-model="d.state.location.locationModel.tileLength" />
                    <v-text-field label="Tile Width" v-model="d.state.location.locationModel.tileWidth" />
                    <v-btn @click="d.hide(true)">Create</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {DialogObject} from "../DialogObject";

export default Vue.extend({
    data: () => ({
        imageItems: [],
    }),
    props: {
        d: Object as PropType<DialogObject<any>>,
    },
})
</script>