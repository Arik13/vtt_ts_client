<template>
    <div>
        <v-card flat tile>
            <v-card-text>
                <div>
                    <!-- Skill proficiencies -->
                    <div v-if="propData.skillProficiencies">
                        <component v-if="propData.skillProficiencies.component" :is="propData.skillProficiencies.component" :propData="propData.skillProficiencies.prop"></component>
                        <div v-else><b>Skill Proficiencies: </b> {{ this.propData.skillProficiencies.title }}<br></div>
                    </div>

                    <!-- Tool Proficiencies -->
                    <div v-if="propData.toolProficiencies">
                        <component v-if="propData.toolProficiencies.component" :is="propData.toolProficiencies.component" :propData="propData.toolProficiencies.prop"></component>
                        <div v-else><b>Tool Proficiencies: </b> {{ this.propData.toolProficiencies.title }}<br></div>
                    </div>

                    <!-- Languages -->
                    <div v-if="propData.languages">
                        <component v-if="propData.languages.component" :is="propData.languages.component" :propData="propData.languages.prop"></component>
                        <div v-else><b>Languages: </b> {{ this.propData.languages.title }}<br></div>
                    </div>

                    <!-- Equipment -->
                    <div v-if="propData.equipment">
                        <component v-if="propData.equipment.component" :is="propData.equipment.component" :propData="propData.equipment.prop"></component>
                        <div v-else><b>Equipment: </b> {{ this.propData.equipment.title }}<br></div>
                    </div>
                </div>
                <br>

                <!-- Features -->
                <div v-for="(feature, i) in propData.features" :key="'feature_'+i">

                    <!-- Feature title -->
                    <h3>
                        {{ feature.title }}
                    </h3>

                    <!-- Feature information paragraphs -->
                    <p v-for="(infoEl, i) in feature.info" :key="'infoEl_'+i">
                        {{ infoEl }}
                    </p>
                </div>

                <!-- Characteristics -->
                <div v-if="propData.characteristics">
                    <!-- Characteristic Header -->
                    <h3>
                        Suggested Characteristics
                    </h3>

                    <!-- Characteristic information paragraphs -->
                    <p v-for="(infoEl, i) in propData.characteristics.info" :key="'characteristicInfo_'+i">
                        {{ infoEl }}
                    </p>

                    <v-select
                        v-for="(characteristic, i) in propData.characteristics.characteristics" :key="'characteristic_'+i"
                        dark
                        v-model="selections[i]"
                        :items="characteristic.items"
                        :label="characteristic.title"
                        multiple
                        menu-props="dark"
                     />
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: [
        "propData"
    ],
    data() {
        return {
            selections: [],
        }
    },
    mounted() {
        for (let i = 0; i < this.propData.characteristics.length; i++) {
            this.selections.push([]);
        }
    }
});
</script>