
<template>
    <div>
        <div
            v-for="(feature, i) in propData.features"
            :key="i"
        >
            <b>{{ feature.title }}</b><br>
            {{ feature.info }}<br><br>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: [
        "propData"
    ],
}
</script>