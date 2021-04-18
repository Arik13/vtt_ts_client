<template>
    <div :style="getGridStyle()">
        <div v-for="(title, i) in titles" :key="i" :style="getItemStyle(i + 1)">
            <div class="title">
                {{ title }}
            </div>
            <div>
                {{ fields[i] }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {COMPONENT_PROP} from "./ComponentTypes";
import { selectData } from './DataSelector';

export default DynamicElement.extend({
    data: () => ({
        titles: null,
        fields: null,
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.TitleFieldGroup>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        getPathObj(obj: any, path: string[]) {
            let subObj = obj;
            for (let i = 0; i < path.length; i++) {
                if (subObj && typeof(subObj) == "object") subObj = subObj[path[i]];
                else throw new Error("Something is fucked up");
            }
            return subObj;
        },
        getGridStyle() {
            let styleObj = {
                display: "grid",
                // gap: (this.value.vertical)? `${this.value.itemGap}px 0px` : `0px ${this.value.itemGap}px`,
                "grid-auto-columns": `minmax(0, 1fr)`,
                "grid-auto-rows": `minmax(0, 1fr)`,
                "background-color": "gray",
                "border-radius": "10px",
                padding: "10px",
            } as any;
            return styleObj;
        },
        getItemStyle(index: number) {
            let styleObj = {
                // "grid-column": (this.value.vertical)? 1 : index,
                // "grid-row": (this.value.vertical)? index : 1,
                "grid-column": index,
                "grid-row": 1,
            }
            return styleObj;
        },
    },
    mounted()  {
        let titles = selectData(this.value.title, this.global.so);
        let fields = selectData(this.value.field, this.global.so);

        this.titles = titles;
        this.fields = fields;
    }
})
</script>

<style scoped>
/* .title {
    text-transform: capitalize;
} */
</style>