<template>
    <expanding-radio-form :expansionItems="races"></expanding-radio-form>
</template>

<script>
import ExpandingRadioForm from "../../../components/ExpandingRadioForm"

// Races
import AasimarData from "./RaceData/Aasimar"
import DragonbornData from "./RaceData/Dragonborn"
import DwarfData from "./RaceData/Dwarf"
import ElfData from "./RaceData/Elf"
import GnomeData from "./RaceData/Gnome"
import HalfElfData from "./RaceData/HalfElf"
import HalflingData from "./RaceData/Halfling"
import HalfOrcData from "./RaceData/HalfOrc"
import HumanData from "./RaceData/Human"
import TieflingData from "./RaceData/Tiefling"

export default {
    components: {
        'expanding-radio-form': ExpandingRadioForm
    },
    data() {
        return {
            races: [
                AasimarData,
                DragonbornData,
                DwarfData,
                ElfData,
                GnomeData,
                HalfElfData,
                HalflingData,
                HalfOrcData,
                HumanData,
                TieflingData,
            ],
        }
    },
}
</script>