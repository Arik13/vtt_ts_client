import RadioFormElement from "../../../../components/RadioFormElement";
import BackgroundForm from "../BackgroundForm";
// import BackgroundData from "./BackgroundData";
// import {SKILL} from "../../../../dnd/enums";
// import SimpleRadioList from "../SimpleRadioList";
// import SelectGroup from "../SelectGroup";
import CappedMultipleSelectBox from "../../../../components/CappedMultipleSelectBox";
import {TOOL_STRINGS} from "../../../../dnd/Toolsjs";

// Skill proficiencies
// Tool Proficiencies
// Languages
// Equipment
// Features
// Characteristics
// Specialty
export default new RadioFormElement(
    "Acolyte",
    BackgroundForm,
    {
        skillProficiencies: {title: "Insight, Religion", component: null, prop: null},
        toolProficiencies: null,
        languages: {title: "Two of your choice", component: CappedMultipleSelectBox, prop: {
            label: "Select Two Languages",
            items: TOOL_STRINGS,
            numberSelectable: 2,
        }},
        equipment: {title: "A holy symbol (a gift to you when you entered the priesthood), a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a belt pouch containing 15 gp", component: null, prop: null},
        features: [
            {
                title: "Shelter of the Faithful",
                info: [
                    "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.",
                    "You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple."
                ],
            },
        ],
        speciality: null,
        characteristics: {
            info: ["Acolytes are shaped by their experience in temples or other religious communities. Their study of the history and tenets of their faith and their relationships to temples, shrines, or hierarchies affect their mannerisms and ideals. Their flaws might be some hidden hypocrisy or heretical idea, or an ideal or bond taken to an extreme."],
            characteristics: [
                {
                    title: "Personality Trait",
                    items: [
                        "I idolize a particular hero of my faith, and constantly refer to that person's deeds and example.",
                        "I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.",
                        "I see omens in every event and action. The gods try to speak to us, we just need to listen.",
                        "Nothing can shake my optimistic attitude.",
                        "I quote (or misquote) sacred texts and proverbs in almost every situation.",
                        "I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods.",
                        "I've enjoyed fine food, drink, and high society among my temple's elite. Rough living grates on me.",
                        "I've spent so long in the temple that I have little practical experience dealing with people in the outside world.",
                    ]
                },
                {
                    title: "Ideal",
                    items: [
                        "Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)",
                        "Charity. I always try to help those in need, no matter what the personal cost. (Good)",
                        "Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)",
                        "Power. I hope to one day rise to the top of my faith's religious hierarchy. (Lawful)",
                        "Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)",
                        "Aspiration. I seek to prove myself worthy of my god's favor by matching my actions against his or her teachings. (Any)",
                    ]
                },
                {
                    title: "Bond",
                    items: [
                        "I would die to recover an ancient relic of my faith that was lost long ago.",
                        "I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.",
                        "I owe my life to the priest who took me in when my parents died.",
                        "Everything I do is for the common people.",
                        "I will do anything to protect the temple where I served.",
                        "I seek to preserve a sacred text that my enemies consider heretical and seek to destroy.",
                    ]
                },
                {
                    title: "Flaw",
                    items: [
                        "I judge others harshly, and myself even more severely.",
                        "I put too much trust in those who wield power within my temple's hierarchy.",
                        "My piety sometimes leads me to blindly trust those that profess faith in my god.",
                        "I am inflexible in my thinking.",
                        "I am suspicious of strangers and expect the worst of them.",
                        "Once I pick a goal, I become obsessed with it to the detriment of everything else in my life.",
                    ]
                },
            ]
        },
    }
);