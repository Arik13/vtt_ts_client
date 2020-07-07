import RadioFormElement from "../../../../components/RadioFormElement"
import GenericRaceForm from "../GenericRaceForm";
import Subrace from "../Subrace"

export default new RadioFormElement(
        "Halfling",
        // "Has the blood of angels, a holy fuck",
        // AasimarForm,
        GenericRaceForm,
        {
            subRaces: [
                new RadioFormElement(
                    "Protector",
                    Subrace,
                    {
                        title: "Protector Aasimar",
                        features: [
                            {
                                title: "Ability Score Increase",
                                info: "Your Wisdom score increases by 1.",
                            },
                            {
                                title: "Radiant Soul",
                                info: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.\n\nYour transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level. Once you use this trait, you can't use it again until you finish a long rest.",
                            },
                        ],
                    }
                ),
                new RadioFormElement(
                    "Scourge",
                    Subrace,
                    {
                        title: "Scourge Aasimar",
                        features: [
                            {
                                title: "Ability Score Increase",
                                info: "Your Constitution score increases by 1.",
                            },
                            {
                                title: "Radiant Consumption",
                                info: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level. Once you use this trait, you can't use it again until you finish a long rest.",
                            },
                        ],
                    },
                ),
                new RadioFormElement(
                    "Fallen",
                    Subrace,
                    {
                        title: "Fallen Aasimar",
                        features: [
                            {
                                title: "Ability Score Increase",
                                info: "Your Strength score increases by 1.",
                            },
                            {
                                title: "Necrotic Shroud",
                                info: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must each succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level. Once you use this trait, you can't use it again until you finish a long rest.",
                            },
                        ],
                    },
                ),
            ],
            radioSelection: 0,
            features: [
                {
                    title: "Ability Score Increase ",
                    info: "Your Charisma score increases by 2."
                },
                {
                    title: "Age",
                    info: "Aasimar mature at the same rate as humans, but they can live up to 160 years",
                },
                {
                    title: "Alignment",
                    info: "Imbued with celestial power, most aasimar are good. Outcast aasimar are most often neutral or even evil",
                },
                {
                    title: "Size",
                    info: "Aasimar have the same range of height and weight as humans. Your size is Medium",
                },
                {
                    title: "Speed",
                    info: "Your base walking speed is 30 feet",
                },
                {
                    title: "Darkvision",
                    info: "Blessed with a radiant soul, your vision can easily cut through darkness. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray",
                },
                {
                    title: "Celestial Resistance",
                    info: "You have resistance to necrotic damage and radiant damage",
                },
                {
                    title: "Healing Hands",
                    info: "As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest",
                },
                {
                    title: "Light Bearer",
                    info: "You know the Light cantrip. Charisma is your spellcasting ability for it",
                },
                {
                    title: "Languages",
                    info: "You can speak, read, and write Common and Celestial",
                },
            ],
        }
    );