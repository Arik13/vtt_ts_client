<script lang="ts">
import Vue, { PropType } from 'vue'
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
        test() {
            console.log("test");
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
        }
    },
});
</script>