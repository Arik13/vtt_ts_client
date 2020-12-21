<script lang="ts">
import Vue, { PropType } from 'vue'
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
    props: {
        // isActive: Boolean,
        registerElement: {type: Function as PropType<(formInterface: any) => void>},
    },
    methods: {
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
        }
    },
});
</script>