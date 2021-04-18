<template>
    <div
        style="
            background-color: #202224;
            border: 1px solid #545557;
            border-radius: 10px;
            overflow: hidden;
        "
    >
        <virtual-scroll-list
            ref="vScrollList"
            :data-key="'uid'"
            :data-sources="lines"
            :data-component="ActionLogStatement"
            :style="style"
        />
    </div>
</template>

<script lang="ts">
// @ts-ignore
import VirtualScrollList from "vue-virtual-scroll-list";
import { CLIENT_EVENT, eventBus } from '@/Stores/EventBus';
import Vue from 'vue';
import ActionLogStatement from "./ActionLogStatement.vue";


export default Vue.extend({
    data: () => ({
        lines: [
            // {uid: 0, text: 'Test'},
            // {uid: 1, text: 'Test'},
            // {uid: 2, text: 'Test'},
            // {uid: 3, text: 'Test'},
            // {uid: 4, text: 'Test'},
            // {uid: 5, text: 'Test'},
            // {uid: 6, text: 'Test'},
            // {uid: 7, text: 'Test'},
            // {uid: 8, text: 'Test'},
            // {uid: 9, text: 'Test'},
            // {uid: 10, text: 'Test'},
        ],
        style: {
            "overflow-y": "auto",
            margin: "10px",
            height: "0px",
        },
        maxHeight: 0,
        ActionLogStatement,
    }),
    components: {
        VirtualScrollList,
    },
    props: {
        bus: {
            default: null,
            type: Vue,
        },
    },
    methods: {
        updateHeight() {
            let elDistanceToTop = window.pageYOffset + this.$el.getBoundingClientRect().top;
            let height = window.innerHeight - elDistanceToTop - 40;
            this.style.height = height + "px";
        }
    },
    mounted() {
        eventBus.registerHandler(CLIENT_EVENT.ACTION_LOG_STATEMENT_ADDED, (statements: string[]) => {
            let i = this.lines.length - 1;
            this.lines.push(...statements.map(statement => ({uid: i++, text: statement})));
            this.updateHeight();
            let list = this.$refs.vScrollList
            // @ts-ignore
            list.scrollToBottom();
        });

        this.bus.$on('resized', () => {
            this.updateHeight();
        });
    }
});
</script>