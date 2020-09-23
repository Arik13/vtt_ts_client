<template>
    <div>
        <v-row no-gutters v-for="row in prop.rows" :key="row">
            <v-col v-for="col in prop.columns" :key="col">
                <v-card @click="clicked(row, col)" height="150px" hover tile>
                    <v-card-title class="justify-center">
                        {{ getButton(row, col).header }}
                    </v-card-title>
                </v-card>
            </v-col>
            <!-- <v-col :cols="4" v-for="(alignment, j) in alignments" :key="'element'+j">
            </v-col> -->
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";
// import {ALIGNMENT_DATA, ALIGNMENT} from "@/dnd/Alignment";

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.GridButtons>}
    },
    methods: {
        clicked(row: number, col: number) {
            const button = this.getButton(row, col);
            console.log(button);
        },
        getButton(row: number, col: number) {
            const i = (row - 1) * (col) + (col - 1);
            const button = this.prop.buttons[i];
            return button;
        },
    },
    mounted() {
        console.log("Mounted Grid Buttons: ", this.prop);

    }
})
</script>