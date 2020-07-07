export class BackgroundData {
    constructor(skillProficiencies, toolProficiencies, languages, equipment, features, speciality, characteristics) {
        this.skillProficiencies = skillProficiencies;
        this.toolProficiencies = toolProficiencies;
        this.languages = languages;
        this.equipment = equipment;
        this.features = features;
        this.speciality = speciality;
        this.characteristics = characteristics;
        // skillProficiencies: "Insight, Religion",
        //     toolProficiencies: "Two of your choice",
        //     languages: null,
        //     equipment: "",
        //     features: [
        //         {
        //             title: "Shelter of the Faithful",
        //             info: [
        //                 "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.",
        //                 "You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple."
        //             ],
        //         },
        //     ],
        //     speciality: {

        //     },
        //     characteristics: [
        //         new RadioFormElement(
        //             "Protector",
        //             Subrace,
        //             {
        //                 title: "Protector Aasimar",
        //                 features: [
        //                     {
        //                         title: "Ability Score Increase",
        //                         info: "Your Wisdom score increases by 1.",
        //                     },
        //                     {
        //                         title: "Radiant Soul",
        //                         info: "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.\n\nYour transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level. Once you use this trait, you can't use it again until you finish a long rest.",
        //                     },
        //                 ],
        //             }
        //         ),
        //     ],
    }
}