<template>
    <div class="text-center">
        <v-dialog
            eager
            dark
            scrollable
            v-model="dialog"
            persistent
            width="1000px"
            min-height="800px"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                >
                    Create Character
                </v-btn>
            </template>
            <v-card
                dark
            >
                <v-card-title
                    primary-title
                >
                    Create Character
                </v-card-title>

                <v-card-text
                    style="height: 800px;"
                    ref="tabsRef"
                >
                    <v-tabs
                        dark
                        vertical
                        v-model="tab"
                    >
                        <v-tabs-slider></v-tabs-slider>
                        <v-tab

                            v-for="i in tabData.length"
                            :key="i"
                            :href="`#tab-${i}`"
                        >
                            {{tabData[i - 1].header}}
                        </v-tab>

                        <!-- 1. Race -->
                        <v-tab-item :value="'tab-' + 1">
                            <card-wrapper>
                                <race-list></race-list>
                            </card-wrapper>
                        </v-tab-item>

                        <!-- 2. Background -->
                        <v-tab-item :value="'tab-' + 2">
                            <card-wrapper>
                                <background-list></background-list>
                            </card-wrapper>
                        </v-tab-item>

                        <!-- 3. Alignment -->
                        <v-tab-item :value="'tab-' + 3">
                            <card-wrapper>
                                <alignment-form></alignment-form>
                            </card-wrapper>
                        </v-tab-item>

                        <!-- 4. Class -->
                        <v-tab-item :value="'tab-' + 4">
                            <card-wrapper>
                                <class-list></class-list>
                            </card-wrapper>
                        </v-tab-item>

                        <!-- 5. Ability Scores -->
                        <v-tab-item :value="'tab-' + 5">
                            <card-wrapper>
                                <ability-score-form></ability-score-form>
                            </card-wrapper>
                        </v-tab-item>

                        <!-- 6. Equipment -->
                        <v-tab-item :value="'tab-' + 6">
                            <card-wrapper>
                                <equipment-form></equipment-form>
                            </card-wrapper>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>

                <v-divider />

                <v-card-actions
                    style="margin: 0px 10px"
                >
                    <v-btn
                        text
                        @click="cancel()"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        text
                        @click="submit()"
                    >
                        Submit
                    </v-btn>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="primary"
                        text
                        @click="previousTab()"
                    >
                        Previous
                    </v-btn>
                    <v-btn
                        color="primary"
                        text
                        @click="nextTab()"
                    >
                        Next
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// import Vue from "vue";
import AbilityScoreForm from "./AbilityScore/AbilityScoreForm";
import AlignmentForm from "./Alignment/AlignmentForm";
import BackgroundList from "./Background/BackgroundList";
import ClassList from "./Class/ClassList";
import EquipmentForm from "./Equipment/EquipmentForm";
import RaceList from "./Race/RaceList";
import CardWrapper from "../../components/CardWrapper";
import CreateCharacterStore from "./CreateCharacterStore";

export default {
    components: {
        AbilityScoreForm,
        AlignmentForm,
        BackgroundList,
        ClassList,
        EquipmentForm,
        RaceList,
        CardWrapper,
    },
    data () {
        return {
            dialog: false,
            tab: "tab-1",
            tabData: [
                {header: "Race"},
                {header: "Background"},
                {header: "Alignment"},
                {header: "Class"},
                {header: "Ability Scores"},
                {header: "Equipment"},
            ],
        }
    },
    methods: {
        previousTab() {
            let tabNumber = Number(this.tab.substring(4));
            if (tabNumber == 0) return;
            tabNumber--;
            this.tab = this.tab.substring(0, 4) + tabNumber;
        },
        nextTab() {
            let tabNumber = Number(this.tab.substring(4));
            if (tabNumber == this.tabData.length - 1) return;
            tabNumber++;
            this.tab = this.tab.substring(0, 4) + tabNumber;
        },
        cancel() {
            this.dialog = false;
        },
        submit() {
            this.dialog = false;
        },
    },
    watch: {
        dialog() {
            if (!this.dialog) return;
        }
    },
    created() {
        // console.log("Created");
        this.$store.registerModule("createCharacterStore", CreateCharacterStore);
    },
    mounted() {
        // console.log("Mounted");
        this.$store.commit("setRace", {race: "aasimar", subrace: "scourge"});
    },
    destroyed() {
        // console.log("Destroyed");
        this.$store.unregisterModule("createCharacterStore");
    }
}
</script>