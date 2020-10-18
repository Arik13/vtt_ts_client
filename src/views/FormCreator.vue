<template>
<div>
    <v-row>
        <v-col :cols="6">
            <v-card dark>
                <v-card-text>
                    <v-textarea
                        class="text-no-wrap"
                        dark
                        v-model="input"
                        ref="textarea"
                        @keydown.tab.prevent="tabber($event)"
                    />
                    <v-btn @click="renderForm()">Test</v-btn>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="6">
            <v-toolbar dense>
                <v-btn icon>
                    <v-icon>mdi-format-paragraph</v-icon>
                </v-btn>
            </v-toolbar>
            <dynamic-list
                :value="prop"
                :key="nextKey"
                :registerElement="registerElement"
                ref="form"
            />
            <v-btn @click="submit()">Submit</v-btn>
        </v-col>
    </v-row>
</div>
</template>

<script lang="ts">
// import {VueComponent} from "vue-component";
import Vue from 'vue'
import "./Workshop/ComponentMap";
import DynamicList from "./Workshop/Components/DynamicList.vue";
import cds from "./Workshop/cds";
import {ChoiceData} from "./Workshop/ComponentTypes"

interface FormInterface {
    target: string;
}

export default Vue.extend({
    data: () => ({
        prop: {
            header: "",
            cds: cds,
        },
        input: "test",
        nextKey: 0,
        // choices: {},
        formInterfaces: [],
    }),
    components: {
        DynamicList,
    },
    methods: {
        renderForm() {
            try {
                const json = JSON.parse(this.input);
                console.log(json);

                this.prop.cds = json
                this.nextKey++;
            }
            catch (error) {
                console.log("Error");
            }
        },
        tabber(event: Event) {
            if (!event) return;
            event.preventDefault();
        },
        registerElement(formInterface: any) {
            this.formInterfaces.push(formInterface);
        },
        submit() {
            const form = this.$refs.form as any;
            const choices = [] as any[];
            form.traverseActiveChoices((node: any) => {
                choices.push(node.getSelectedChoice())
            });
            const action = {} as any;
            choices.forEach((choice: ChoiceData) => {
                action[choice.modTarget] = {}
                if (choice.param) {
                    action[choice.modTarget][choice.param] = choice.value;
                }
            });
        }
    }
})
</script>