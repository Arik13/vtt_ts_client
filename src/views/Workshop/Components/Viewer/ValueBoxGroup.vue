<template>
    <div :style="getGridStyle()">
        <div v-for="(item, i) in items" :key="i" :style="getItemStyle(i + 1)">
            <div class="box">
                <div class="titleItem">
                    {{ item.title }}
                </div>
                <div class="mainItem">
                    {{ item.main }}
                </div>
                <div class="subItem">
                    {{ item.sub }}
                </div>
            </div>
        </div>
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
        // createFields(dataObj: any, useKey?: boolean, descs?: any, predicate?: (key: string) => boolean) {
        //     let fields = []
        //     for (let key in dataObj) {
        //         if (!predicate || predicate(key)) {
        //             let value = (descs && descs[key])? descs[key] : dataObj[key];
        //             value = (useKey)? key : value;
        //             fields.push(value);
        //         }
        //     }
        //     return fields;
        // },
        // getPathObj(obj: any, path: string[]) {
        //     let subObj = obj;
        //     for (let i = 0; i < path.length; i++) {
        //         if (subObj && typeof(subObj) == "object") subObj = subObj[path[i]];
        //         else throw new Error("Something is fucked up");
        //     }
        //     return subObj;
        // },
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
        let subArgs = this.value.items.sub;

        let titleData = selectData(titleArgs.data, dataObj);
        let mainData = selectData(mainArgs.data, dataObj);
        let subData;
        if (subArgs) {
            subData = selectData(subArgs.data, dataObj);
            this.subStyle = this.value.items.sub.style;
        }
        this.titleStyle = this.value.items.title.style;
        this.mainStyle = this.value.items.main.style;



        // let titleData = this.getPathObj(dataObj, titleArgs.path);
        // let titles = this.createFields(titleData, titleArgs.useKey);
        // let mainData = this.getPathObj(dataObj, mainArgs.path);
        // let mainVals = this.createFields(mainData);
        // let subVals;
        // if (subArgs) {
        //     let subData = this.getPathObj(dataObj, subArgs.path);
        //     subVals = this.createFields(subData);
        // }

        // // if (titles.length != mainVals.length || titles.length != subVals.length)
        // //     throw new Error("Duo Box Groups must use an equal number of keys from each path");

        let items: Item[] = [];
        if (subData) {
            for (let i = 0; i < titleData.length; i++) {
                items.push({title: titleData[i], main: mainData[i], sub: subData[i]});
            }
        }
        else {
            for (let i = 0; i < titleData.length; i++) {
                items.push({title: titleData[i], main: mainData[i]});
            }
        }
        this.items = items;
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