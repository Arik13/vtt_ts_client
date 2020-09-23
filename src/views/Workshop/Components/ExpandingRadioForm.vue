<template>
    <v-card tile style="margin: 0px 0px 20px 0px; padding: 0px;">
        <template v-if="prop.header">
            <v-card-title>
                {{prop.header}}
            </v-card-title>
            <v-divider />
        </template>
        <v-card-text>
            <v-radio-group v-model="radioSelection" :mandatory="false" style="margin: 0px; padding: 0px;">
                <v-expansion-panels accordion flat>
                    <v-expansion-panel
                        v-for="(choice, i) in prop.choices"
                        :key="i"

                    >
                        <!-- style="border: solid 1px #EEEEEE;" -->
                        <!-- Header -->
                        <v-expansion-panel-header style="margin: 0px; padding: 0px 0px 0px 20px">
                            <v-flex class="d-flex flex-row" style="margin: 0px; padding: 0px;">
                                <!--  -->
                                <v-radio style="margin: 0px; padding: 0px;" @click.native.stop :value="i"></v-radio>
                                <h3>{{ choice.header }}</h3>
                            </v-flex>
                        </v-expansion-panel-header>

                        <!-- Content -->
                        <v-expansion-panel-content style="margin: 0px; padding: 0px">
                            <component v-for="(cd, j) in choice.cds" :key="j" :is="getComponent(cd)" :prop="cd.prop"></component>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-radio-group>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export default Vue.extend({
    props: {
        prop: {type: Object as PropType<COMPONENT_PROP.ChooseOneWithSub>}
    },
    data() {
        return {
            radioSelection: 0,
        }
    },
    methods: {
        getComponent(cd: ComponentDefinition) {
            return componentMap.get(cd.name);
        }
    },
});
</script>