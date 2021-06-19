import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import * as Asset from "@shared/Assets/Asset";


class TurnState extends Asset.TurnData {
    set(turnData: Asset.TurnData) {
        if (turnData) {
            this.round = turnData.round;
            this.turnItems = turnData.turnItems;
            return;
        }
        this.round = null;
        this.turnItems = null;
    }
}

export class State {
    turnState = new TurnState();
}



export const store = {
    state: new State(),
    mutations: {
    },
    actions: {
    },
    modules: {
    },
}

export default new Vuex.Store(store);