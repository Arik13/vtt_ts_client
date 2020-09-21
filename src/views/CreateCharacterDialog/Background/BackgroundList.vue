<template>
    <expanding-radio-form :expansionItems="backgrounds"></expanding-radio-form>
    <!-- <div>Background Form</div> -->
</template>

<script lang="ts">
import Vue from "vue";
import ExpandingRadioForm from "@/views/components/ExpandingRadioForm.vue"
import AcolyteData from "./BackgroundData/AcolyteData"

export default Vue.extend({
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
});
</script>