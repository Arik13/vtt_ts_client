<template>
    <div>
        <!-- HP Information -->
        <h3>{{ propData.hpData.title }}</h3>
        <div v-for="(hpItem, i) in propData.hpData.items" :key="'hpItem' + i">
            <b>{{ hpItem.title }}:</b> {{ hpItem.value }}
        </div>
        <br>

        <v-divider /><br>

        <!-- Proficiencies -->
        <h3>Proficiencies</h3>
        <div v-for="(proficiency, i) in propData.proficiencies" :key="'proficiency' + i">
            <div v-if="proficiency.items">
                <component v-if="proficiency.component" :is="proficiency.component" :propData="proficiency.prop"></component>
                <div v-else>
                    <b>{{ proficiency.title }}:</b>
                    <span v-for="(proficiencyItem, i) in proficiency.items" :key="'proficiency' + i">
                        {{ proficiencyItem.title }},
                    </span>
                </div>
            </div>
        </div>
        <br>

        <v-divider /><br>

        <!-- Equipment -->
        <h3>Equipment</h3>
        <div v-for="(equipmentChoice, i) in propData.equipment" :key="'equipment' + i">
            <component v-if="equipmentChoice.component" :is="equipmentChoice.component" :propData="equipmentChoice.prop"></component>
            <div v-else> {{ equipmentChoice.text }}</div>
        </div>
        <br>

        <v-divider /><br>

        <!-- Cantrips -->
        <div v-if="propData.cantrips">
            <h3>Cantrips</h3>
            <component v-if="propData.cantrips.component" :is="propData.cantrips.component" :propData="propData.cantrips.prop"></component>
            <div v-else> {{ propData.cantrips.text }}</div>
        </div>

        <!-- Spells -->
        <div v-if="propData.spells">
            <h3>Spells</h3>
            <component v-if="propData.spells.component" :is="propData.spells.component" :propData="propData.spells.prop"></component>
            <div v-else> {{ propData.spells.text }}</div>
        </div>

        <v-divider /><br>

        <!-- Features -->
        <div v-if="propData.features">
            <div v-for="(feature, i) in propData.features" :key="'feature-' + i">
                <h3>{{ feature.title }}</h3>
                <div v-for="(infoItem, i) in feature.info" :key="'featureInfo-' + i">
                    <h4>
                        {{ infoItem.header }}
                    </h4>
                    <p v-for="(paragraph, j) in infoItem.paragraphs" :key="feature.title + '-paragraph-' + j">
                        {{ paragraph }}
                    </p>
                </div>
                <component v-if="feature.component" :is="feature.component" :propData="feature.prop"></component>
                <div v-else> {{ feature.text }}</div>
                <v-divider /><br>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: [
        "propData"
    ],
}

/*
    General Class Data Format
        Static
            - Hit points
            - Proficiencies
            - Equipment
            - Features
        Dynamic
            - Tool proficiencies
            - Skill proficiencies
            - Equipment
            - Spells/Cantrips
            - Special features (e.g. sorcerous origin, favored enemy etc.)
*/
</script>
