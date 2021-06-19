<template>
    <div>
        <!-- <vue-dialog
            v-for="(dialog, i) in dialogs"
            :key="i"
            :d="storeDialog(dialog.name, dialog.dialogObject)"
        /> -->
        <component
            v-for="(dialog, i) in dialogArray"
            :key="i"
            :is="dialog.component"
            :d="dialog.prop"
            :ref="dialog.name"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {dialogs, dialogArray} from "./Dialog";
export default Vue.extend({
    data: () => ({
        dialogs,
    }),
    computed: {
        dialogArray() {
            return dialogArray;
        }
    },
})
</script>