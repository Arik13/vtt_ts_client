
<template>
    <div>
        <div
            v-for="(feature, i) in data.features"
            :key="i"
        >
            <b>{{ feature.title }}</b><br>
            {{ feature.info }}<br><br>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        "data"
    ],
}
</script>