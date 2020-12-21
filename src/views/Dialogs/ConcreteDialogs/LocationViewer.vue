<template>
    <v-dialog v-model="d.on" dark max-width="600px" width="100%">
        <v-card v-if="d.state.location">
            <v-card-title>
                {{ d.state.location.name }}
            </v-card-title>
            <!-- <v-col>

            </v-col> -->
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="6"><b>Ranks:</b></v-col>
                            <v-col cols="6">{{ d.state.location.locationModel.ranks }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6"><b>Files:</b></v-col>
                            <v-col cols="6">{{ d.state.location.locationModel.files }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6"><b>Tile Width:</b></v-col>
                            <v-col cols="6">{{ d.state.location.locationModel.tileWidth }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6"><b>Tile Length:</b></v-col>
                            <v-col cols="6">{{ d.state.location.locationModel.tileLength }}</v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-img
                            :src="d.state.mapImageSrc"
                        />
                    </v-col>
                </v-row>
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