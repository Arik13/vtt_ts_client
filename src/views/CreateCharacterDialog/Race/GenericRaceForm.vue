<template>
    <div>
        <expanding-radio-form :expansionItems="propData.subRaces"></expanding-radio-form>
        <template
            v-for="(feature, i) in propData.features"
        >
            <div
                :key="i"
            >
                <b>{{ feature.title }}</b><br>
                {{ feature.info }}
                <br><br>
            </div>
        </template>
    </div>
</template>

<script>
import ExpandingRadioForm from "../../../components/ExpandingRadioForm";

export default {
    props: [
        "propData",
    ],
    components: {
        ExpandingRadioForm,
    },
    computed: {
        subRaces() {
            return this.propData.subRaces;
        },
        features() {
            return this.propData.features;
        }
    },
    data() {
        return {
            radioSelection: 0,
        }
    },
}
</script>