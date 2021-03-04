<template>
    <div>
        <v-expansion-panels accordion dense>
            <v-expansion-panel v-for="(item, i) in items" :key=i style="background-color: gray">
                <v-expansion-panel-header class="title">
                    {{ item.title }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <div v-if="Array.isArray(item.main)">
                        <p v-for="(paragraph, j) in item.main" :key="j">
                            {{ paragraph }}
                        </p>
                    </div>
                    <p v-else>
                        {{ item.main }}
                    </p>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "../DynamicElement.vue";
import {COMPONENT_PROP} from "../../ComponentTypes";
import {selectData} from "./DataSelector"

type Item = {title: string | number, main: string | number, sub?: string | number};

export default DynamicElement.extend({
    data: () => ({
        items: null as Item[],
        titleStyle: null,
        mainStyle: null,
        subStyle: null,
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.ValueBoxGroup>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        getGridStyle() {
            let styleObj = {
                display: "grid",
                gap: (this.value.vertical)? `${this.value.itemGap}px 0px` : `0px ${this.value.itemGap}px`,
                // "align-items": "start",
                "justify-content": "start",
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
                "grid-column": (this.value.vertical)? 1 : index,
                "grid-row": (this.value.vertical)? index : 1,
            }
            return styleObj;
        },
    },
    mounted()  {
        let dataObj = this.global.so as any;

        let titleArgs = this.value.items.title;
        let mainArgs = this.value.items.main;

        let titleData = selectData(titleArgs.data, dataObj);
        let mainData = selectData(mainArgs.data, dataObj);

        this.titleStyle = this.value.items.title.style;
        this.mainStyle = this.value.items.main.style;

        let items: Item[] = [];
        for (let i = 0; i < titleData.length; i++) {
            items.push({title: titleData[i], main: mainData[i]});
        }
        this.items = items;
        console.log(items);

    }
})
</script>

<style scoped>
.titleItem {
    text-align: center;
    text-transform: capitalize;
    font-size: 1.2em;
}
.mainItem {
    text-align: center;
    font-size: 2em;
}
.subItem {
    text-align: center;
}
.containerItem {
    display: grid;
}
</style>