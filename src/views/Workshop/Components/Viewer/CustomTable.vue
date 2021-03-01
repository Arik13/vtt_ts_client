<template>
    <div>
        <div :style="getGridStyle()">
            <div v-for="(i) in fieldCount" :key="i" :style="getItemStyle(i)">
                <div v-if="getItemType(i - 1) == 'label'" class="labelField">
                    {{ getItem(i - 1) }}
                </div>
                <div v-if="getItemType(i - 1) == 'value'" class="valueField">
                    {{ getItem(i - 1) }}
                </div>
                <div v-if="getItemType(i - 1) == 'checkbox'" class="checkboxField">
                    <div v-if="getItem(i - 1)">
                        ✓
                    </div>
                    <div v-else>
                        X
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "../DynamicElement.vue";
import {COMPONENT_PROP} from "../../ComponentTypes";
import { selectData } from './DataSelector';
import { Style } from '../../ComponentTypes';

export default DynamicElement.extend({
    data: () => ({
        table: [[]],
        columnStyles: [] as Style[],
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.CustomTable>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        createFields(dataObj: any, useKey?: boolean, descs?: any, predicate?: (key: string) => boolean) {
            let fields = []
            for (let key in dataObj) {
                if (!predicate || predicate(key)) {
                    let value = (descs && descs[key])? descs[key] : dataObj[key];
                    value = (useKey)? key : value;
                    fields.push(value);
                }
            }
            return fields;
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
            let columnStyle = "";
            for (let i = 0; i < this.columnStyles.length; i++) {
                let item = this.columnStyles[i];
                if (item.styleType == "label") columnStyle += "auto ";
                else if (item.styleType == "value") columnStyle += `minmax(0, ${(item.width)? item.width : 'auto'}px) `;
                else if (item.styleType == "checkbox") columnStyle += `minmax(0, ${(item.width)? item.width : 'auto'}px) `;
            }

            let styleObj = {
                display: "grid",
                gap: (this.value.horizontal)? `${this.value.vGap}px ${this.value.hGap}px` : `${this.value.hGap}px ${this.value.vGap}px`,
                "grid-auto-columns": columnStyle, //`minmax(0, auto)`,
                "grid-auto-rows": `minmax(0, auto)`,
                "background-color": "gray",
                "border-radius": "10px",
                padding: "10px",
                // "grid-auto-columns": `auto`,
                // "grid-auto-rows": `auto`
            } as any;
            return styleObj;
        },
        getItemStyle(index: number) {
            let tableIndex = this.getIndex(index - 1);
            // let itemStyle = this.columnStyles[tableIndex.j];

            tableIndex.i++;
            tableIndex.j++;

            let styleObj = {
                "grid-column": (this.value.horizontal)? tableIndex.i: tableIndex.j,
                "grid-row": (this.value.horizontal)? tableIndex.j: tableIndex.i,
            }
            return styleObj;
        },
        getIndex(counter: number) {
            let rowCount = this.table[0].length;
            let i = counter % rowCount;
            let j = Math.floor(counter / rowCount);
            return {i, j};
        },
        getItem(counter: number) {
            let tableIndex = this.getIndex(counter);
            return this.table[tableIndex.j][tableIndex.i];
        },
        getItemType(counter: number) {
            let tableIndex = this.getIndex(counter);
            return this.columnStyles[tableIndex.j].styleType;
        }
    },
    computed: {
        fieldCount() {
            return this.table[0].length * this.table.length;
        }
    },
    mounted()  {
        let items = this.value.items;

        let dataObj = this.global.so as any;
        let table: any[][] = [];
        let columnStyles = [];
        for (let i = 0; i < items.length; i++) {
            let dataColumn = selectData(items[i].data, dataObj);
            table.push(dataColumn);
            columnStyles.push(items[i].style);
        }
        this.table = table;
        this.columnStyles = columnStyles;
    }
})
</script>

<style scoped>
.labelField {
    text-transform: capitalize;
    justify-self: start;
}
.valueField {
    justify-self: start;
}
.checkboxField {
    justify-self: start;
}
.containerItem {
    display: grid;
}
</style>