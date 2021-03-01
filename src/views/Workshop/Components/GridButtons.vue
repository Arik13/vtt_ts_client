<template>
    <div>
        <v-row no-gutters v-for="row in value.rows" :key="row">
            <v-col v-for="col in value.columns" :key="col">
                <v-card @click="clicked(row, col)" height="150px" hover tile>
                    <v-card-title class="justify-center">
                        {{ getChoice(row, col).header }}
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
import DynamicElement from "./DynamicElement.vue";
import {ChoiceData, ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";
// import {ALIGNMENT_DATA, ALIGNMENT} from "@/dnd/Alignment";

export default DynamicElement.extend({
    data: () => ({
        choice: null,
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.GridButtons>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        clicked(row: number, col: number) {
            this.choice = this.getChoice(row, col);
        },
        getChoice(row: number, col: number) {
            const i = (row - 1) * (col) + (col - 1);
            const choice = this.value.choices[i];
            return choice;
        },
        getSelectedChoice(): ChoiceData {
            // return this.choice.data;
            return {
                param: this.value.param,
                value: this.choice.value,
            };
        },
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        validate() {
            return this.choice !== null;
        },
        reset() {
            // this.choice = this.getChoice(1, 1);
            this.choice = null
        }
    },
    mounted() {
        this.isChoiceNode = true;
        // this.choice = this.getChoice(1, 1);
        // this.registerElement(this.getSelectedChoice);
    }
})
</script>