<template>
    <div>
        <component
            v-for="(cd, i) in prop.cds"
            :key="i"
            :is="getComponent(cd)"
            :prop="getProp(cd)"
        />
    </div>
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
            const component = componentMap.get(cd.componentType);
            return component;
        },
        getProp(cd: ComponentDefinition) {
            // console.log(cd);
            return cd.componentProp;
        },
    },
    mounted() {
        // console.log(this.prop);
    }
})
</script>