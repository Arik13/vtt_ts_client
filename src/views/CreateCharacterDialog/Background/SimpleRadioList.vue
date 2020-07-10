<template>
    <v-radio-group dense>
        <v-radio v-for="(label, i) in labels" :key="i" :label="label" />
    </v-radio-group>
</template>

<script lang="ts">
export default {
    props: [
        "labels"
    ],
}
</script>