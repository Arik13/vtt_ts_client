<template>
    <v-card flat tile style="margin: 0px 0px 20px 0px; padding: 0px;">
        <template v-if="value.header">
            <v-card-title>
                {{value.header}}
            </v-card-title>
            <v-divider />
        </template>
        <v-card-text>
            <v-radio-group v-model="radioSelection" :mandatory="false" style="margin: 0px; padding: 0px;">
                <v-expansion-panels accordion flat>
                    <v-expansion-panel
                        v-for="(choice, i) in value.choices"
                        :key="i"
                        eager
                    >
                        <!-- Header -->
                        <v-expansion-panel-header style="margin: 0px; padding: 0px 0px 0px 20px">
                            <v-flex class="d-flex flex-row" style="margin: 0px; padding: 0px;">
                                <v-radio style="margin: 0px; padding: 0px;" @click.native.stop :value="i"></v-radio>
                                <h3>{{ choice.header }}</h3>
                            </v-flex>
                        </v-expansion-panel-header>

                        <!-- Content -->
                        <v-expansion-panel-content style="margin: 0px; padding: 0px" eager>
                            <component
                                v-for="(cd, j) in choice.cds"
                                :key="j"
                                :is="getComponent(cd)"
                                :global="global"
                                :value="cd.value"
                                :ref="i"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-radio-group>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import DynamicElement from "./DynamicElement.vue";
import {ChoiceData, ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export default DynamicElement.extend({
    data: () => ({
        radioSelection: null,
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.ChooseOneWithSub>},
        global: {type: Object as PropType<any>}
    },
    methods: {
        getSelectedChoice(this) {
            // let choice: ChoiceData = {
            //     param: this.value.param,
            //     value: this.value.choices[this.radioSelection].value
            // }
            return {
                param: this.value.param,
                value: this.value.choices[this.radioSelection].value
            };
        },
        setActive() {
            this.isActive = true;
            const firstElGroup = this.$refs[this.radioSelection] as any;

            for (const key in firstElGroup) {
                const node = firstElGroup[key];
                node.setActive();
            }
        },
        setInactive() {
            this.isActive = false;
            const firstElGroup = this.$refs[this.radioSelection] as any;

            for (const key in firstElGroup) {
                const node = firstElGroup[key];
                node.setInactive();
            }
        },
        reset() {
            this.radioSelection = null;
        },
        validate() {
            return this.radioSelection !== null
        }
    },
    watch: {
        radioSelection(newSelec: number, oldSelec: number) {
            const oldNodeGroup = this.$refs[oldSelec] as any;
            const newNodeGroup = this.$refs[newSelec] as any;

            for (const key in oldNodeGroup) {
                const node = oldNodeGroup[key];
                node.isActive = false;
            }

            for (const key in newNodeGroup) {
                const node = newNodeGroup[key];
                node.setActive();
            }
        }
    },
    mounted() {
        this.isChoiceNode = true;
    }
});
</script>