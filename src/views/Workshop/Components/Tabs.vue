<template>
    <v-card flat dense tile height="100%">
        <v-card-text >
            <v-tabs
                v-model="tabModel"
                width="100%"
                vertical
            >
                <v-tab
                    v-for="(tab, i) in prop.tabs"
                    :key="i"
                    :href="`#${tab.header}`"
                >
                    {{ tab.header }}
                </v-tab>

                <v-tabs-items v-model="tabModel">
                    <v-tab-item v-for="(tab, j) in prop.tabs" :key="j" :value="tab.header">
                        <component v-for="(cd, j) in tab.cds" :key="j" :is="getComponent(cd)" :prop="cd.prop" />
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.Tabs>}
    },
    data: () => ({
        tabModel: null,
    }),
    methods: {
        getComponent(cd: ComponentDefinition) {
            return componentMap.get(cd.name);
        }
    },
})
</script>