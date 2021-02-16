<script lang="ts">
import Vue, { PropType } from 'vue';
import {
    // COMPONENT_TYPE,
    COMPONENT_PROP,
    ComponentDefinition
} from "../ComponentTypes";
import componentMap from "../ComponentMap";

export interface DynamicElement {
    activeChildren: DynamicElement[];
    isChoiceNode: boolean;
    isActive: boolean;
    traverseActiveChoices: (visit: (node: any) => void) => void;
    setActive: () => void;
}
export default Vue.extend({
    data: () => ({
        activeChildren: [],
        isChoiceNode: false,
        isActive: false,
    }),
    methods: {
        getComponent(cd: ComponentDefinition) {
            const component = componentMap.get(cd.name);
            return component;
        },
        traverseActiveChoices(visit: (node: any) => void) {
            if (!this.isActive) return;
            if (this.isChoiceNode) {
                visit(this);
            }
            for (const key in this.$refs) {
                const refEl = this.$refs[key] as any;
                refEl.forEach((element: any) => {
                    element.traverseActiveChoices(visit);
                });
            }
        },
        resetForm(node: any) {
            node.reset();
            for (const key in this.$refs) {
                const refEl = this.$refs[key] as any;
                refEl.forEach((element: any) => {
                    element.resetForm();
                });
            }
        },
        setActive() {},
        setInactive() {},
        reset() {},
    },
});
</script>