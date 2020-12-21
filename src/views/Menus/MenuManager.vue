<template>
    <div>
        <component
            v-for="(dataObject, i) in dataObjects"
            :key="i"
            :is="dataObject.component"
            :obj="store(dataObject.name, dataObject.prop)"
            :ref="dataObject.name"
        />
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
export default Vue.extend({
    props: {
        dataObjectMap: Object as PropType<Map<string, any>>,
        dataObjects: Object as PropType<any>,
    },
    methods: {
        store(name: string, obj: any) {
            this.dataObjectMap.set(name, obj);
            return obj;
        }
    },
})
</script>