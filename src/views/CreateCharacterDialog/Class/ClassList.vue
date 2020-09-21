<template>
    <expanding-radio-form :expansionItems="classes"></expanding-radio-form>
</template>

<script lang="ts">
import Vue from 'vue';

import ExpandingRadioForm from "@/views/components/ExpandingRadioForm.vue";
import SorcererData from "./ClassData/SorcererData";

export default Vue.extend({
    components: {
        'expanding-radio-form': ExpandingRadioForm
    },
    data() {
        return {
            classes: [
                SorcererData,
            ],
        }
    },
});
</script>