<template>
    <v-container>
        <v-card>
            <v-card-title v-if="value.header">
                {{ value.header }}
            </v-card-title>
            <v-card-text>
                <component
                    v-for="(cd, i) in value.cds"
                    :key="i"
                    :is="getComponent(cd)"
                    :value="getProp(cd)"
                    :registerElement="registerElement"
                    :ref="i"
                />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import DynamicElement from "./DynamicElement.vue";
import {
    // COMPONENT_TYPE,
    COMPONENT_PROP,
    ComponentDefinition
} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.DynamicList>},
    },
    methods: {
        getComponent(cd: ComponentDefinition) {
            const component = componentMap.get(cd.name);
            return component;
        },
        getProp(cd: ComponentDefinition) {
            return cd.value;
        },
        setActive() {
            this.isActive = true;
            for (const key in this.$refs) {
                const elGroup = this.$refs[key] as any;
                for (const groupKey in elGroup) {
                    const el = elGroup[groupKey] as any;
                    el.setActive();
                }
            }
        }
    },
    mounted() {
        this.setActive();
    }
})
</script>