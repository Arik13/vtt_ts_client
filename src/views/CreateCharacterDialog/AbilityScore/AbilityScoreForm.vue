<template>
    <expanding-radio-form :expansionItems="comps"></expanding-radio-form>
    <!-- <div>Ability Score Form</div> -->
</template>

<script>
// import Vue from "vue";
import ExpandingRadioForm from "../../../components/ExpandingRadioForm"
// import RadioFormElement from "../../../components/RadioFormElement"

export default {
    components: {
        'expanding-radio-form': ExpandingRadioForm
    },
    data() {
        return {
            comps: [],
        }
    },
}
</script>