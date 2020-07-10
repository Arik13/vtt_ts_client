<template>
    <div style="margin: 10px 0px">
        <v-checkbox
            dense
            v-for="(label, i) in propData.labels"
            :key="i"
            :label="label"
            v-model="selected"
            :value="i"
            :disabled="shouldDisable(i)"
            style="margin: 0px; padding: 0px"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    props: [
        "propData",
        // "numberSelectable",
        // "labels"
    ],
    data() {
        return {
            selected: []
        }
    },
    methods: {
        shouldDisable(i: number) {
            const selectionsUsed = this.propData.numberSelectable == this.selected.length;
            const isSelected = this.selected.includes(i);
            return (!isSelected && selectionsUsed);
        }
    },
});
</script>