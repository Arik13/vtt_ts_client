import { State } from "@/Stores";
import Vue from "vue";
import Component from "vue-class-component";


@Component
export default class VueMod extends Vue {
    get state(): State {
        return this.$store.state;
    }
}