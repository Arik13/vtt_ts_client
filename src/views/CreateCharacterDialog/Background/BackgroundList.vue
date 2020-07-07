<template>
    <expanding-radio-form :expansionItems="backgrounds"></expanding-radio-form>
    <!-- <div>Background Form</div> -->
</template>

<script>
// import Vue from "vue";
import ExpandingRadioForm from "../../../components/ExpandingRadioForm"
import AcolyteData from "./BackgroundData/AcolyteData"
// import RadioFormElement from "../../../components/RadioFormElement"

export default {
    components: {
        'expanding-radio-form': ExpandingRadioForm
    },
    data() {
        return {
            backgrounds: [
                AcolyteData,
            ],
        }
    },
}
</script>