<template>
    <div>
        <h3>
            {{ value.header }}
        </h3>
        <p v-for="(paragraph, i) in value.paragraphs" :key="i">
            {{ paragraph }}
        </p>
        <v-simple-table dark dense>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left" v-for="(header, i) in value.headers" :key="i" :width="value.widths[i] + '%'">
                            {{ header }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, i) in value.rows"
                        :key="i"
                        :width="value.widths[i] + '%'"
                    >
                        <td class="text-left" v-for="(datum, i) in row" :key="i">
                            {{ datum }}
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <br>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {COMPONENT_PROP} from "../ComponentTypes";

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.Table>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
    },
    mounted() {
        this.isActive = false;
    }
})
</script>