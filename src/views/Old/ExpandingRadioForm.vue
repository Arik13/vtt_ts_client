<template>
    <v-radio-group v-model="radioSelection" :mandatory="false" style="margin: 0px;" >
        <v-expansion-panels accordion>
            <v-expansion-panel
                v-for="(expansionItem, i) in expansionItems"
                :key="i"
            >
                <!-- Header -->
                <v-expansion-panel-header>
                    <v-flex class="d-flex flex-row">
                        <!--  -->
                        <v-radio @click.native.stop :value="i"></v-radio>
                        <h3>{{ expansionItem.title }}</h3>
                    </v-flex>
                </v-expansion-panel-header>

                <!-- Content -->
                <v-expansion-panel-content
                    style="margin: 0px; padding: 0px"
                >
                    <v-card
                        flat
                        tile
                        :ref="'ref' + i"
                    >
                        <v-card-text>
                            <component :is="expansionItems[i].component" :propData="expansionItems[i].prop"></component>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-radio-group>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    props: [
        "expansionItems",
    ],
    data() {
        return {
            radioSelection: 0,
        }
    },
});
</script>