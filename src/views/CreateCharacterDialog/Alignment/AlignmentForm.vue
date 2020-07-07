<template>
    <div>
        <v-row no-gutters v-for ="(alignmentRow, i) in alignments" :key="'row'+i">
            <v-col :cols="4" v-for="(alignment, j) in alignmentRow" :key="'element'+j">
                <v-card @click="setAlignment(alignment.value)" height="150px" hover tile>
                    <v-card-title class="justify-center">
                        {{ alignment.title }}
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {ALIGNMENT} from "../../../dnd/enums"

export default {
    data() {
        return {
            comps: [],
            alignments: [
                [
                    {title: "Lawful Good", value: ALIGNMENT.LAWFUL_GOOD},
                    {title: "Neutral Good", value: ALIGNMENT.NEUTRAL_GOOD},
                    {title: "Chaotic Good", value: ALIGNMENT.NEUTRAL_GOOD},
                ],
                [
                    {title: "Lawful Neutral", value: ALIGNMENT.LAWFUL_NEUTRAL},
                    {title: "True Neutral", value: ALIGNMENT.TRUE_NEUTRAL},
                    {title: "Chaotic Neutral", value: ALIGNMENT.TRUE_NEUTRAL},
                ],
                [
                    {title: "Lawful Evil", value: ALIGNMENT.LAWFUL_EVIL},
                    {title: "Neutral Evil", value: ALIGNMENT.NEUTRAL_EVIL},
                    {title: "Chaotic Evil", value: ALIGNMENT.NEUTRAL_EVIL},
                ],
            ]
        }
    },
    methods: {
        setAlignment(alignment) {
            console.log("Alignment: ", alignment);
        }
    },
}
</script>