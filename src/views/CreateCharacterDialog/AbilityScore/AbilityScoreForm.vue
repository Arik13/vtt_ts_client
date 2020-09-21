<template>
    <expanding-radio-form :expansionItems="comps"></expanding-radio-form>
    <!-- <div>Ability Score Form</div> -->
</template>

<script lang="ts">
import Vue from "vue";
import ExpandingRadioForm from "@/views/components/ExpandingRadioForm.vue"

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