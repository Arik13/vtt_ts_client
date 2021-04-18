<template>
<v-card>
    <v-card-text>
        <turn-view />
    </v-card-text>
</v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import TurnView from "./TurnView.vue";

export default Vue.extend({
    components: {
        TurnView,
    },
});
</script>