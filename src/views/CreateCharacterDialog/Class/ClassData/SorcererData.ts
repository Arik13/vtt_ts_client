import RadioFormElement from "../../../../components/RadioFormElement";
import ExpandingRadioForm from "../../../../components/ExpandingRadioForm.vue";
import ClassForm from "../ClassForm.vue";
import CappedMultipleSelectBox from "../../../../components/CappedMultipleSelectBox.vue";
import {WEAPON_LIST, WEAPON_STRINGS, getSimpleWeaponsStrings} from "../../../../dnd/Weapons";
import {ATTRIBUTE_DATA} from "../../../../dnd/Attribute";
import {ITEM_STRINGS} from "../../../../dnd/Items";
import {getCantripStringsArray} from "../../../../dnd/Spells/Sorcerer/Cantrips";
import {getSpells1StringsArray} from "../../../../dnd/Spells/Sorcerer/Spells1";

const sorcerousOriginData = [
    new RadioFormElement(
        "Draconic Bloodline",
        null,
        null,
    ),
]

export default new RadioFormElement(
        "Sorcerer",     // Radio label
        ClassForm,      // Expansion component
        {               // Prop to be provided to the expansion component
            hpData: {
                title: "Hit Points",
                items: [
                    {title: "Hit Dice", value: "1d6 per sorcerer level"},
                    {title: "Hit Points at 1st Level", value: "8 + your constitution modifier"},
                    {title: "Hit Points at Higher Levels", value: "1d8 (or 5) + your Constitution modifier per monk level after 1st"},
                ]
            },
            proficiencies: [
                {
                    title: "Armor",
                    items: null,
                    component: null,
                    prop: null,
                },
                {
                    title: "Weapons",
                    items: [
                        WEAPON_LIST.DAGGER,
                        WEAPON_LIST.DART,
                        WEAPON_LIST.SLING,
                        WEAPON_LIST.QUARTERSTAFF,
                        WEAPON_LIST.CROSSBOW_LIGHT,
                    ],
                    component: null,
                    prop: null,
                },
                {
                    title: "Tools",
                    items: null,
                    component: null,
                    prop: null,},
                {
                    title: "Saving Throws",
                    items: [
                        ATTRIBUTE_DATA.CHARISMA,
                        ATTRIBUTE_DATA.CONSTITUTION,
                    ],
                    component: null,
                    prop: null,
                },
                {
                    title: "Skills",
                    items: null,
                    component: null,
                    prop: null,
                },
            ],
            equipment: [
                {
                    text: null,
                    component: CappedMultipleSelectBox,
                    prop: {
                        label: "Choose one weapon",
                        items: getSimpleWeaponsStrings().concat(WEAPON_STRINGS.CROSSBOW_LIGHT),
                        numberSelectable: 1,
                    },
                },
                {
                    text: null,
                    component: CappedMultipleSelectBox,
                    prop: {
                        label: "Choose one utility item",
                        items: [
                            ITEM_STRINGS.COMPONENT_POUCH,
                            ITEM_STRINGS.ARCANE_FOCUS,
                        ],
                        numberSelectable: 1,
                    },
                },
                {
                    text: null,
                    component: CappedMultipleSelectBox,
                    prop: {
                        label: "Choose one pack",
                        items: [
                            ITEM_STRINGS.DUNGEONEERS_PACK,
                            ITEM_STRINGS.EXPLORERS_PACK,
                        ],
                        numberSelectable: 1,
                    },
                },
                {
                    text: "Two Daggers",
                    component: null,
                    prop: null,
                },
            ],
            cantrips: {
                text: null,
                component: CappedMultipleSelectBox,
                prop: {
                    label: "Choose four cantrips",
                    items: getCantripStringsArray(),
                    numberSelectable: 4,
                },
            },
            spells: {
                text: null,
                component: CappedMultipleSelectBox,
                prop: {
                    label: "Choose two 1st level spells",
                    items: getSpells1StringsArray(),
                    numberSelectable: 2,
                },
            },
            features: [
                {
                    title: "Test Feature",
                    info: [{paragraphs: ["test"]}, {header: "Cantrips", paragraphs: ["At 1st level..."]}, {header: "Spell Slots", paragraphs: ["You know..."]}],
                    component: null,
                    prop: null
                },
                {
                    title: "Sorcerous Origin",
                    info: null,
                    component: ExpandingRadioForm,
                    prop: sorcerousOriginData
                },
            ],
        },
    );

/*
1st level choices
    - Sorcerous Origin (The most complex, has its own choices)
    - Two skills
    - Four cantrips
    - Two first level spells
*/

/*
    General Class Data Format
        Static
            - Hit points
            - Proficiencies
            - Equipment
            - Features
        Dynamic
            - Tool proficiencies
            - Skill proficiencies
            - Equipment
            - Spells/Cantrips
            - Special features (e.g. sorcerous origin, favored enemy etc.)
*/