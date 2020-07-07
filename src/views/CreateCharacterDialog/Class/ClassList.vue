<template>
    <expanding-radio-form :expansionItems="classes"></expanding-radio-form>
</template>

<script>
import ExpandingRadioForm from "../../../components/ExpandingRadioForm"
import SorcererData from "./ClassData/SorcererData"

export default {
    components: {
        'expanding-radio-form': ExpandingRadioForm
    },
    data() {
        return {
            classes: [
                SorcererData,
            ],
        }
    },
}
</script>