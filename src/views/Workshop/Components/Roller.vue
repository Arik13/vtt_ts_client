<template>
<v-container>
    <v-card flat tile>
        <v-row>
            <v-col :cols="3">
                <h3>Ability Scores</h3>
                <div
                    class="list-group-item"
                    v-for="(element) in labels"
                    :key="element.name"
                >
                    {{ element.name }}
                </div>
            </v-col>
            <v-col>
                <h3>Values</h3>
                <draggable :list="values" :move="handleMove" @end="handleDragEnd" group="rolls">
                    <div v-for="value in values" :key="value.id" style="cursor: pointer">{{value.name}}</div>
                </draggable>
            </v-col>
            <v-col>
                <h3>Choices</h3>
                <draggable :list="choices" :move="handleMove" @end="handleDragEnd" group="rolls">
                    <div v-for="choice in choices" :key="choice.id" style="cursor: pointer">{{choice.name}}</div>
                </draggable>
            </v-col>
        </v-row>
        <v-btn @click="roll()">
            Roll
        </v-btn>
    </v-card>
</v-container>
</template>

<script lang="ts">
/*
    Roll variants:
    1. Point buy
    2. Roll random
    3. Roll assignable
    3. Default assignable
*/

/*
    Send 24d6 roll request
    Backend somehow knows to sum the rolls
    Get summed rolls from backend
    Display them
    Let user change their order
    Send new order and rollID to backend when parent dialog closes
*/

import Vue, {PropType} from 'vue';
import DynamicElement from "./DynamicElement.vue";
import {ChoiceData, ComponentDefinition, COMPONENT_NAME, COMPONENT_PROP} from "../ComponentTypes";
import componentMap from "../ComponentMap";
import draggable from 'vuedraggable';
import Dispatcher from '@/Dispatcher/Dispatcher';
import { GAME_EVENT_TYPE } from '@shared/Game/Types';

interface RollChoice {
    id: string;
    index: number;
    name: string;
}

export default DynamicElement.extend({
    data: () => ({
        labels: [],
        choices: [],
        values: [],
        rollID: "",
        toID: "",
        fromID: "",
    }),
    props: {
        value: {type: Object as PropType<COMPONENT_PROP.Roller>},
    },
    components: {
        draggable,
    },
    methods: {
        roll() {
            Dispatcher.doAction(this.value.rollAction, [], (event: any) => {
                let actionEvent = event as {success: boolean, result: GAME_EVENT_TYPE.ACTION_DONE};
                let out = actionEvent.result.out;
                let rolls = out.rolls as number[];
                this.rollID = out.id;
                let choices = [];
                let values = [];
                for (let i = 0; i < rolls.length; i++) {
                    choices.push({id: `c${i+1}`, index: i, name: `${rolls[i]}`})
                    values.push({id: `v${i+1}`, index: i, name: `--`});
                }
                this.values = choices;
                this.choices = values;
            });
        },
        getSelectedChoice() {
            let result = this.values.map(roll => roll.index);
            return [
                {param: this.value.rollParam, value: result},
                {param: this.value.idParam, value: this.rollID}
            ]
        },
        setActive() {
            this.isActive = true;
        },
        setInactive() {
            this.isActive = false;
        },
        validate() {
            if (this.values.length != this.labels.length) return false;
            for (let i = 0; i < this.values.length; i++) {
                if (this.values[i].id.charAt(0) !== "c") return false;
            }
            return true;
        },
        reset() {
            this.choices = [];
            this.values = [];
        },
        handleDragEnd(e: any) {
            let fromIsValues = !!this.values.find(element => element.id == this.fromID);
            let toIsValues = !!this.values.find(element => element.id == this.toID);

            let fromList = (fromIsValues)? this.values : this.choices as [];
            let fromIndex = fromList.findIndex((element: any) => element.id == this.fromID);
            let fromItem = fromList[fromIndex];
            let fromListClone = Object.assign([], fromList);

            let toList = (toIsValues)? this.values : this.choices as [];
            let toIndex = toList.findIndex((element: any) => element.id == this.toID);
            let toItem = toList[toIndex];
            let toListClone = Object.assign([], toList);

            if (fromIsValues && toIsValues) {
                fromListClone[fromIndex] = toItem;
                fromListClone[toIndex] = fromItem;
                this.values = fromListClone;
            }
            else if (fromIsValues && !toIsValues) {
                fromListClone[fromIndex] = toItem;
                toListClone[toIndex] = fromItem;
                this.values = fromListClone;
                this.choices = toListClone;
            }
            else if (!fromIsValues && toIsValues) {
                fromListClone[fromIndex] = toItem;
                toListClone[toIndex] = fromItem;
                this.values = toListClone;
                this.choices = fromListClone;
            }
            else {
                fromListClone[fromIndex] = toItem;
                fromListClone[toIndex] = fromItem;
                this.choices = fromListClone;
            }
        },
        handleMove(e: any) {
            this.fromID = e.draggedContext.element.id;
            this.toID = e.relatedContext.element.id;
            return false; // disable sort
        }
    },
    mounted() {
        this.labels = this.value.headerColumn;
        // let choices = [];
        // let values = [];
        // for (let i = 0; i < this.labels.length; i++) {
        //     choices.push({id: `c${i+1}`, index: i+1, name: `--`});
        //     values.push({id: `v${i+1}`, index: i+1, name: `--`});
        // }
        // this.choices = choices;
        // this.values = values;
        this.isChoiceNode = true;
        this.setActive();
    }
})
</script>