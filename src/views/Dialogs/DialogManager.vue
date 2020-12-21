<template>
    <div>
        <!-- <vue-dialog
            v-for="(dialog, i) in dialogs"
            :key="i"
            :d="storeDialog(dialog.name, dialog.dialogObject)"
        /> -->
        <component
            v-for="(dialog, i) in dialogs"
            :key="i"
            :is="dialog.component"
            :d="storeDialog(dialog.name, dialog.prop)"
            :ref="dialog.name"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {dialogs, DIALOG_NAME, dialogMap} from "./Dialog";
import { DialogObject } from './DialogObject';
export default Vue.extend({
    data: () => ({
        dialogs,
    }),
    methods: {
        storeDialog(name: string, d: DialogObject<any>) {
            dialogMap.set(name, d);
            return d;
        }
    },
})
</script>