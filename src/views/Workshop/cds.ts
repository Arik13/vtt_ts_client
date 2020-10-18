import { Component } from 'vue';
import {
    COMPONENT_NAME,
    COMPONENT_PROP,
    ComponentDefinition,
    TextBlockDefinition,
    DynamicListDefinition,
    TabsDefinition,
    ChooseSomeDefinition,
    ChooseOneWithSubDefinition,
    GridButtonsDefinition,
} from "./ComponentTypes";

const tabs: TabsDefinition = {
    name: COMPONENT_NAME.TABS,
    value: {
        header: "Tabs Component",
        tabs: [
            {header: "Race", cds: []},
            {header: "Background", cds: []},
            {header: "Alignment", cds: []},
            {header: "Class", cds: []},
            {header: "Ability Scores", cds: []},
            {header: "Equipment", cds: []},
        ]
    },
}

const raceForm: ChooseOneWithSubDefinition = {
    name: COMPONENT_NAME.CHOOSE_ONE_W_SUB,
    value: {
        header: "Choose a Race",
        // modTarget: "Race",
        // param: ""
        choices: [
            {data: {modTarget: "aasimar", param: null, value: null}, cds: [], header: "Aasimar"},
            {data: {modTarget: "dragonborn", param: null, value: null}, cds: [], header: "Dragonborn"},
            {data: {modTarget: "dwarf", param: null, value: null}, cds: [], header: "Dwarf"},
            {data: {modTarget: "elf", param: null, value: null}, cds: [], header: "Elf"},
            {data: {modTarget: "gnome", param: null, value: null}, cds: [], header: "Gnome"},
            {data: {modTarget: "halfelf", param: null, value: null}, cds: [], header: "HalfElf"},
            {data: {modTarget: "halfling", param: null, value: null}, cds: [], header: "Halfling"},
            {data: {modTarget: "halforc", param: null, value: null}, cds: [], header: "HalfOrc"},
            {data: {modTarget: "human", param: null, value: null}, cds: [], header: "Human"},
            {data: {modTarget: "tiefling", param: null, value: null}, cds: [], header: "Tiefling"},

        ]
    },
}
const aasimarSubRaceForm: ChooseOneWithSubDefinition = {
    name: COMPONENT_NAME.CHOOSE_ONE_W_SUB,
    value: {
        header: "Choose a Sub Race",
        // modTarget: "AasimarSubRace",
        // modTarget: "AasimarSubRace",
        choices: [
            {data: {modTarget: "protector", param: null, value: null}, cds: [], header: "Protector"},
            {data: {modTarget: "scourge", param: null, value: null}, cds: [], header: "Scourge"},
            {data: {modTarget: "fallen", param: null, value: null}, cds: [], header: "Fallen"},
        ]
    },
}
const protectorASI: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Ability Score Increase",
        paragraphs: ["Your Wisdom Score increases by 1."],
    },
}
const protectorAbility: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Radiant Soul",
        paragraphs: ["Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one modTarget when you deal damage to it with an attack or a spell. The extra radiant damage equals your level. Once you use this trait, you can't use it again until you finish a long rest."],
    },
}
const scourgeASI: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Ability Score Increase",
        paragraphs: ["Your Constitution Score increases by 1."],
    },
}
const scourgeAbility: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Radiant Consumption",
        paragraphs: ["Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one modTarget when you deal damage to it with an attack or a spell. The extra radiant damage equals your level. Once you use this trait, you can't use it again until you finish a long rest."],
    },
}
const fallenASI: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Ability Score Increase",
        paragraphs: ["Your Strength Score increases by 1."],
    },
}
const fallenAbility: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Necrotic Shroud",
        paragraphs: ["Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must each succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one modTarget when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level. Once you use this trait, you can't use it again until you finish a long rest."],
    },
}

const aasimarASI: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Ability Score Increase",
        paragraphs: ["Your Charisma score increases by 2."],
    },
}
const age: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Age",
        paragraphs: ["Aasimar mature at the same rate as humans, but they can live up to 160 years"],
    },
}
const alignment: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Alignment",
        paragraphs: ["Imbued with celestial power, most aasimar are good. Outcast aasimar are most often neutral or even evil"],
    },
}
const size: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Size",
        paragraphs: ["Aasimar have the same range of height and weight as humans. Your size is Medium"],
    },
}
const speed: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Speed",
        paragraphs: ["Your base walking speed is 30 feet"],
    },
}
const darkvision: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Darkvision",
        paragraphs: ["Blessed with a radiant soul, your vision can easily cut through darkness. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray"],
    },
}
const celestialResistance: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Celestial Resistance",
        paragraphs: ["You have resistance to necrotic damage and radiant damage"],
    },
}
const healingHands: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Healing Hands",
        paragraphs: ["As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest"],
    },
}
const lightBearer: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Light Bearer",
        paragraphs: ["You know the Light cantrip. Charisma is your spellcasting ability for it"],
    },
}
const languages: TextBlockDefinition = {
    name: COMPONENT_NAME.TEXT_BLOCK,
    value: {
        header: "Languages",
        paragraphs: ["You can speak, read, and write Common and Celestial"],
    },
}
const alignmentButtons: GridButtonsDefinition = {
    name: COMPONENT_NAME.GRID_BUTTONS,
    value: {
        header: "Alignment",
        // modTarget: "Alignment",
        rows: 3,
        columns: 3,
        choices: [
            {data: {modTarget: "alignment", param: "alignment", value: "lawful_good"}, header: "Lawful Good"},
            {data: {modTarget: "alignment", param: "alignment", value: "neutral_good"}, header: "Neutral Good"},
            {data: {modTarget: "alignment", param: "alignment", value: "chaotic_good"}, header: "Chaotic Good"},
            {data: {modTarget: "alignment", param: "alignment", value: "lawful_neutral"}, header: "Lawful Neutral"},
            {data: {modTarget: "alignment", param: "alignment", value: "true_neutral"}, header: "True Neutral"},
            {data: {modTarget: "alignment", param: "alignment", value: "chaotic_neutral"}, header: "Chaotic Neutral"},
            {data: {modTarget: "alignment", param: "alignment", value: "lawful_evil"}, header: "Lawful Evil"},
            {data: {modTarget: "alignment", param: "alignment", value: "neutral_evil"}, header: "Neutral Evil"},
            {data: {modTarget: "alignment", param: "alignment", value: "chaotic_evil"}, header: "Chaotic Evil"},
        ]
    }
}

tabs.value.tabs[0].cds.push(raceForm);
tabs.value.tabs[2].cds.push(alignmentButtons);
aasimarSubRaceForm.value.choices[0].cds.push(protectorASI, protectorAbility);
aasimarSubRaceForm.value.choices[1].cds.push(scourgeASI, scourgeAbility);
aasimarSubRaceForm.value.choices[2].cds.push(fallenASI, fallenAbility);
raceForm.value.choices[0].cds.push(aasimarSubRaceForm);
raceForm.value.choices[0].cds.push(aasimarASI);
raceForm.value.choices[0].cds.push(age);
raceForm.value.choices[0].cds.push(alignment);
raceForm.value.choices[0].cds.push(size);
raceForm.value.choices[0].cds.push(speed);
raceForm.value.choices[0].cds.push(darkvision);
raceForm.value.choices[0].cds.push(celestialResistance);
raceForm.value.choices[0].cds.push(healingHands);
raceForm.value.choices[0].cds.push(lightBearer);
raceForm.value.choices[0].cds.push(languages);

export default [
    // raceForm,
    tabs,
];