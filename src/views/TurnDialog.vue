<template>
<draggable-dialog
    id="dialog-1"
    class="dialog-1"
    title="Turn Order"
    :eventCb="handleDialogEvent"
    :options="{
        x: 10,
        y: 10,
        z: 100,
        width: 0,
        height: 0,
        buttonPin: false,
        buttonClose: true,
        dragCursor: '',
        centered: '',
        pinned: false,
        dropEnabled: true,
    }"
    @load="load"
    @focus="focus"
    @pin="pin"
    @drag-start="dragStart"
    @move="move"
    @drag-end="dragEnd"
    @close="close"
>
    <div :style="getGridStyle()">
        <div v-for="(turnItem, i) in turnItems" :key="`Order Col ${i}`" :style="getItemStyle({row: i+1, col: 1})">
            {{ turnItem.order }}
        </div>
        <div v-for="(turnItem, i) in turnItems" :key="`Name Col ${i}`" :style="getItemStyle({row: i+1, col: 2})">
            {{ turnItem.name }}
        </div>
    </div>
</draggable-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
// @ts-ignore
import DraggableDialog from 'vue-dialog-drag'

import "vue-dialog-drag/dist/vue-dialog-drag.css";
// import "vue-dialog-drag/dist/drop-area.css";
// import "vue-dialog-drag/dist/dialog-styles.css";

export default Vue.extend({
    data: () => ({
        turnItems: [
            {
                order: 10,
                name: "Ikra",
            },
            {
                order: 10,
                name: "YOLO $waggin$",
            },
        ]
    }),
    components: {
        DraggableDialog,
    },
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
        handleDialogEvent(e: any) {
            return e;
        },
        load(e: any) {
            // console.log("load: ", e);
        },
        focus(e: any) {
            // console.log("focus: ", e);
        },
        pin(e: any) {
            // console.log("pin: ", e);
        },
        dragStart(e: any) {
            // console.log("dragStart: ", e);
        },
        move(e: any) {
            // console.log("move: ", e);
        },
        dragEnd(e: any) {
            // console.log("dragEnd: ", e);
        },
        close(e: any) {
            // console.log("close: ", e);
        },
    },
    mounted()  {

    }
})
</script>

<style>
.dialog-drag {
    min-width: 10em;
    background-color: #e6eee9;
    box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.5)
}

.dialog-1.dialog-drag {
    border: #14131c solid 2px;
    background-color: #5f5f5f;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.dialog-1.dialog-drag .dialog-header {
    background-color: transparent;
}

.dialog-1.dialog-drag .dialog-header .buttons button {
    color: #14131c
}

/* .dialog-1.dialog-drag .dialog-header .title {

} */

.dialog-drag.dialog-1.fixed {
    border: #1aad8d solid 2px
}
</style>