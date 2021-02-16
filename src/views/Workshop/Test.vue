<template>
<v-container>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col :cols="2">
                    <div
                        class="list-group-item"
                        v-for="(element) in labels"
                        :key="element.name"
                    >
                        {{ element.name }}
                    </div>
                </v-col>
                <v-col>
                    <draggable class="list-group" :list="rolls" group="people">
                        <div
                            class="list-group-item"
                            v-for="(element) in rolls"
                            :key="element.name"
                        >
                            {{ element.name }}
                        </div>
                    </draggable>
                </v-col>
            </v-row>
            <v-btn @click="submit()">
                Click
            </v-btn>
        </v-card-text>
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

import draggable from 'vuedraggable';
import Vue from 'vue'
export default Vue.extend({
    data: () => ({
        labels: [
            {id: 1, name: "Strength"},
            {id: 2, name: "Dexterity"},
            {id: 3, name: "Constitution"},
            {id: 4, name: "Intelligence"},
            {id: 5, name: "Wisdom"},
            {id: 6, name: "Charisma"},
        ],
        rolls: [
            {id: 1, name: 15},
            {id: 2, name: 14},
            {id: 3, name: 13},
            {id: 4, name: 12},
            {id: 5, name: 10},
            {id: 6, name: 8},
        ],
    }),
    components: {
        draggable,
    },
    methods: {
        submit() {
            console.log(this.rolls);

        }
    }
})
</script>