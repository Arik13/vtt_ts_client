<template>
<div>
    <v-btn @click="dispatchStartTurnSequence()">
        Start
    </v-btn>
    <v-btn @click="dispatchEndTurnSequence()">
        End
    </v-btn>
    <v-btn @click="dispatchEndTurn()">
        End Turn
    </v-btn>
    <br>
    <br>
    <h3>Round: {{ round }}</h3>
    <br>
    <div :style="getGridStyle()">
        <div v-for="(turnItem, i) in turnItems" :key="`Order Col ${i}`" :style="getItemStyle({row: i+1, col: 1})">
            {{ turnItem.order }}
        </div>
        <div v-for="(turnItem, i) in turnItems" :key="`Name Col ${i}`" :style="getItemStyle({row: i+1, col: 2})">
            {{ getName(turnItem.soID) }}
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Dispatcher from "@/Dispatcher/Dispatcher";
import {initTurnViewInterface, TurnItem} from "./TurnViewInterface";
import { stateObjectStore } from '@/Stores/StateObjectStore';

export default Vue.extend({
    data: () => ({
        turnItems: [],
        round: null,
    }),
    methods: {
        getGridStyle() {
            let styleObj = {
                display: "grid",
                padding: "10px",
                // gap: `${10}px ${10}px`,
                "align-items": "start",
                "border": "solid 1px black",
                "grid-auto-rows": `minmax(40px, auto)`,
                "grid-auto-columns": `minmax(40px, auto)`,
            }
            return styleObj;
        },
        getItemStyle(item: {col: string, row: string}) {
            let styleObj = {
                "grid-column": item.col,
                "grid-row": item.row,
            }
            return styleObj;
        },
        dispatchStartTurnSequence() {
            Dispatcher.createTurnSequence();
        },
        dispatchEndTurnSequence() {
            Dispatcher.endTurnSequence();
        },
        dispatchEndTurn() {
            Dispatcher.goNextTurn();
        },
        dispatchMoveTurn(index: number) {
            Dispatcher.moveTurn();
        },
        startTurnSequence(turnItems: TurnItem[], round: number) {
            this.turnItems = turnItems;
            this.round = round;
        },
        endTurnSequence() {
            this.turnItems = [];
            this.round = null;
        },
        getName(soID: string) {
            return stateObjectStore.get(soID).name;
        },
        endTurn(turnItems: TurnItem[], round: number) {
            this.turnItems = turnItems;
            this.round = round;
        },
        moveTurn(index: number) {

        },
    },
    mounted()  {
        initTurnViewInterface(this as any);
    }
})
</script>