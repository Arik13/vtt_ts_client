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

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ExpandingRadioForm from "@/views/components/ExpandingRadioForm.vue";

interface PropData {
    subRaces: string;
    features: string;
}

@Component({
    components: {
        ExpandingRadioForm,
    }
})
export default class GenericRaceForm extends Vue {
    @Prop({type: Object as () => PropData})
    public propData: PropData // notice the bang saying to compiler not to warn about no initial value
}
</script>