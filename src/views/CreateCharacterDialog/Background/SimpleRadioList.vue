<template>
    <v-radio-group dense>
        <!-- test -->
        <v-radio v-for="(label, i) in labels" :key="i" :label="label" />
    </v-radio-group>
</template>

<script>
export default {
    props: [
        "labels"
    ],
}
</script>