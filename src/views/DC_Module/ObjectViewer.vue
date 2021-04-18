<template>
    <div>
        <div v-for="(field, i) in fields" :key=i>
            {{field.key}}: {{field.value}}
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {COMPONENT_PROP} from "./ComponentTypes";

type Field = {key: string, value: any};

export default DynamicElement.extend({
    data: () => ({
        fields: [],
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.ObjectViewer>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        createFields(obj: any, fields: Field[], predicate: (key: string) => boolean) {
            let descs = this.value.descriptions;
            for (let key in obj) {
                if (predicate(key)) {
                    let value = (descs && descs[key])? this.value.descriptions[key] : obj[key];
                    fields.push({key, value});
                }
            }
        }
    },
    mounted()  {
        let path = this.value.path;
        let obj = this.global.so as any;

        for (let i = 0; i < path.length; i++) {
            if (obj && typeof(obj) == "object") obj = obj[path[i]];
            else throw new Error("Something is fucked up");
        }


        if (this.value.whitelist && this.value.blacklist) throw new Error("Cannot have both a whitelist and a blacklist");
        else if (this.value.whitelist) {
            this.createFields(obj, this.fields, (key) => this.value.whitelist.includes(key));
        }
        else if (this.value.blacklist) {
            this.createFields(obj, this.fields, (key) => !this.value.blacklist.includes(key));
        }
        else {
            this.createFields(obj, this.fields, (key) => true);
        }
    }

})
</script>