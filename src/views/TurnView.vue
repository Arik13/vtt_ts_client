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
    <h3>Round: {{ turnState.round }}</h3>
    <br>
    <div :style="getGridStyle()">
        <div v-for="(turnItem, i) in turnState.turnItems" :key="`Order Col ${i}`" :style="getItemStyle({row: i+1, col: 1})">
            {{ turnItem.order }}
        </div>
        <div v-for="(turnItem, i) in turnState.turnItems" :key="`Name Col ${i}`" :style="getItemStyle({row: i+1, col: 2})">
            {{ getName(turnItem.id) }}
        </div>
    </div>
</div>
</template>

<script lang="ts">
// import Vue from 'vue';
import Vue from "@/vue";
import Dispatcher from "@/Dispatcher/Dispatcher";
import {initTurnViewInterface, turnState, TurnItem} from "./TurnViewInterface";
import { stateObjectStore } from '@/Stores/StateObjectStore';
import * as Asset from "@shared/Assets/Asset";
import { campaignStore } from '@/Stores/CampaignStore';
import {Component} from "vue-property-decorator";

@Component({})
export default class TurnView extends Vue {
    get turnState() {return this.state.turnState}
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
    }
    getItemStyle(item: {col: string, row: string}) {
        let styleObj = {
            "grid-column": item.col,
            "grid-row": item.row,
        }
        return styleObj;
    }
    dispatchStartTurnSequence() {
        Dispatcher.doAction(campaignStore.bindings.initTurnSequenceScript, {})
    }
    dispatchEndTurnSequence() {
        Dispatcher.doAction(campaignStore.bindings.endTurnSequenceScript, {})
    }
    dispatchEndTurn() {
        Dispatcher.doAction(campaignStore.bindings.endTurnScript, {})
    }
    dispatchMoveTurn(index: number) {
        Dispatcher.moveTurn();
    }
    setTurnSequence(turnData: Asset.TurnData) {
        this.state.turnState.set(turnData);
    }
    getName(soID: string) {
        return stateObjectStore.get(soID).name;
    }
    mounted()  {
        console.log("State: ", this.state);
    }
}
</script>