<template>
    <expanding-radio-form :expansionItems="comps"></expanding-radio-form>
    <!-- <div>Ability Score Form</div> -->
</template>

<script lang="ts">
import Vue from "vue";
import ExpandingRadioForm from "../../../components/ExpandingRadioForm.vue"
// import RadioFormElement from "../../../components/RadioFormElement"

export default Vue.extend({
    components: {
        'expanding-radio-form': ExpandingRadioForm
    },
    data() {
        return {
            comps: [],
        }
    },
});
</script>