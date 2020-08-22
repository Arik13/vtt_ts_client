<template>
    <div>
        <v-row no-gutters>
            <v-col :cols="4" v-for="(alignment, j) in alignments" :key="'element'+j">
                <v-card @click="setAlignment(alignment.ID)" height="150px" hover tile>
                    <v-card-title class="justify-center">
                        {{ alignment.title }}
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import {ALIGNMENT_DATA, ALIGNMENT} from "../../../dnd/Alignment"

export default {
    data() {
        return {
            alignments: ALIGNMENT_DATA
        }
    },
    methods: {
        // setAlignment(alignment: ALIGNMENT) {

        // }
    },
}
</script>