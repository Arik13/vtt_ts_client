<template>
    <!-- Credit to jacekkarczmarczyk, https://gist.github.com/jacekkarczmarczyk/eca6015c176e85ea78706e63383bbe5c -->
    <v-container>
        <v-row>
            <div
                :style="containerStyle"
                class="vertical-tabs"
                :class="{'vertical-tabs--vertical-text': verticalText, 'vertical-tabs--horizontal-text': !verticalText}"
            >
                <v-tabs
                    v-model="model"
                    :show-arrows="verticalText"
                    :style="tabsStyle"
                >
                    <v-tab
                        v-for="tabName in tabNames"
                        :key="tabName"
                        :href="`#${tabName}`"
                    >
                        {{tabName}}
                    </v-tab>
                </v-tabs>
            </div>
            <v-tabs-items dark v-model="model">
                <slot></slot>
            </v-tabs-items>
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
        color: String,
        height: {
            type: [Number, String],
            default: 460,
        },
        tabNames: Array,
        sliderColor: String,
        value: null,
        verticalText: Boolean,
    },
    computed: {
        containerStyle() {
            return {height: isNaN(Number(this.height)) ? this.height : `${this.height}px`};
            // return this.verticalText ? {
            //     height: isNaN(Number(this.height)) ? this.height : `${this.height}px`,
            // } : {
            //     height: (48 * this.items.length) + 'px',
            // }
        },
        tabsStyle () {
            return this.verticalText ? {width: isNaN(Number(this.height)) ? this.height : `${this.height}px`,} : {}
        },
    },
});
</script>

<style scoped>
    .vertical-tabs {
        overflow: hidden;
    }
    .vertical-tabs--horizontal-text .v-tabs {
        transform: rotate(90deg);
        transform-origin: 100px 100px;
        height: 200px;
    }
    .vertical-tabs--horizontal-text .v-tabs >>> .v-tabs__container {
        height: 200px;
    }
    .vertical-tabs--horizontal-text .v-tabs >>> .v-tabs__div {
        width: 48px;
        height: 200px;
        display: inline-block;
    }
    .vertical-tabs--horizontal-text .v-tabs >>> .v-tabs__item {
        transform: rotate(-90deg);
        transform-origin: 100px 100px;
        width: 200px;
        height: 48px;
        display: block;
        text-align: left;
        line-height: 36px;
        white-space: pre;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vertical-tabs--vertical-text {
        width: 48px;
    }
    .vertical-tabs--vertical-text .v-tabs {
        transform: rotate(90deg);
        transform-origin: 24px 24px;
    }
    .vertical-tabs--vertical-text .v-tabs >>> .v-tabs__item {
        transform: rotate(180deg);
    }
    .vertical-tabs--vertical-text .v-tabs >>> .v-tabs__slider-wrapper {
        top: 0;
        bottom: auto;
    }
</style>