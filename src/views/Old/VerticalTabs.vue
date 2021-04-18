<template>
    <v-container height="100%">
        <v-row>
            <v-tabs
                v-model="model"
                width="100%"
                vertical
            >
                <v-tab
                    v-for="tab in tabs"
                    :key="tab.name"
                    :href="`#${tab.name}`"
                    class="tabNoMargin"
                >
                    <v-icon>
                        {{ tab.icon }}
                    </v-icon>
                </v-tab>
                <v-tabs-items dark v-model="model">
                    <slot />
                </v-tabs-items>
            </v-tabs>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    data: () => ({
        model: 'tab-1',
        name: "vertical-tabs",
    }),
    props: {
        tabs: Array,
    },
});
</script>