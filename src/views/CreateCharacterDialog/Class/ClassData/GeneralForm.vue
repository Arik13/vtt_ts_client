<template>
    <div>
        <component
            v-for="(item, i) in propData.items"
            :is="componentList[item.componentName]"
            :key="'' + i"
        >

        </component>
    </div>
</template>


<script>
import {COMPONENT} from "./GeneralFormData"
// import RadioFormElement from "../../../../components/RadioFormElement";
// import ExpandingRadioForm from "../../../../components/ExpandingRadioForm";

export default {
    props: ["propData"],
    data: () => ({
        componentEnum: COMPONENT,
        componentList: {
            // (this.COMPONENT.EXPANDING_RADIO_FORM): ExpandingRadioForm,
        }
    })
    // elements
}
</script>