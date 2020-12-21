<template>
    <v-card dark flat dense tile height="100%">
        <v-card-text >
            <v-tabs
                v-model="tabModel"
                width="100%"
                vertical
                dark
            >
                <v-tab
                    v-for="(tab, i) in value.tabs"
                    :key="i"
                    :href="`#${tab.header}`"
                >
                    {{ tab.header }}
                </v-tab>
                <v-tabs-items v-model="tabModel" dark>
                    <v-tab-item v-for="(tab, j) in value.tabs" :key="j" :value="tab.header" eager dark>
                        <component
                            v-for="(cd, j) in tab.cds"
                            :key="j"
                            :is="getComponent(cd)"
                            :value="cd.value"
                            :registerElement="registerElement"
                            :ref="j"
                        />
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export default DynamicElement.extend({
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.Tabs>},
    },
    data: () => ({
        tabModel: null,
    }),
    methods: {
        getComponent(cd: ComponentDefinition) {
            return componentMap.get(cd.name);
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