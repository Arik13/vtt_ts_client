<template>
    <v-container>
        <v-card>
            <v-card-title v-if="prop.header">
                {{ prop.header }}
            </v-card-title>
            <v-card-text>
                <component
                    v-for="(cd, i) in prop.cds"
                    :key="i"
                    :is="getComponent(cd)"
                    :prop="getProp(cd)"
                />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
    // COMPONENT_TYPE,
    COMPONENT_PROP,
    ComponentDefinition
} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.DynamicList>}
    },
    methods: {
        getComponent(cd: ComponentDefinition) {
            const component = componentMap.get(cd.name);
            return component;
        },
        getProp(cd: ComponentDefinition) {
            return cd.prop;
        },
    },
})
</script>