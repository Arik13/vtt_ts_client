<template>
    <div>
        <div :style="getGridStyle()">
            <div v-for="(item, i) in value.items" :key="i" :style="getItemStyle(item)">
                <component
                    v-for="(cd, j) in item.cds"
                    :key="j"
                    :is="getComponent(cd)"
                    :value="cd.value"
                    :global="global"
                    :ref="j"
                />
                <!-- {{ item.cds }} -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "../DynamicElement.vue";
import {COMPONENT_PROP} from "../../ComponentTypes";

export default DynamicElement.extend({
    data: () => ({
        fields: [],
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.GridLayout>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        getGridStyle() {
            let styleObj = {
                display: "grid",
                gap: `${this.value.vGap}px ${this.value.hGap}px`,
                // "justify-content": "start",
                "align-items": "start",
                "grid-template-columns": "",
                "grid-template-rows": "",
                // "grid-auto-rows": `minmax(100px, auto)`
            }
            for (let i = 0; i < this.value.cols - 1; i++) {
                styleObj['grid-template-columns'] += " auto";
            }

            for (let i = 0; i < this.value.rows - 1; i++) {
                styleObj['grid-template-rows'] += " auto";
            }
            return styleObj;
        },
        getItemStyle(item: {col: string, row: string}) {
            let styleObj = {
                "grid-column": item.col,
                "grid-row": item.row,
            }
            return styleObj;
        },
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
    },
    mounted()  {

    }

})
</script>