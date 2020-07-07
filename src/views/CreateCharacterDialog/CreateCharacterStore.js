// class Node {
//     constructor(
//         ID,
//         data,
//         children,
//     ) {
//         this.ID = data;
//         this.data = data;
//         if (!children) {
//             this.children = [];
//         }
//         else {
//             this.children = children;
//         }
//     }
// }
// class TreeManager {
//     constructor() {
//         this.root = new Node(

//         );
//     }
//     create(parentID, data) {

//     }
//     read(ID) {

//     }
//     update(ID, data) {

//     }
//     delete(ID) {

//     }
// }

export default {
    state: {
        raceForm: {race: "", subrace: ""},
        backgroundForm: {background: ""},
        alignmentForm: {alignment: ""},
        classForm: {class: ""},
        abilityScoresForm: {abilityScores: ""},
        equipmentForm: {equipment: ""},
    },
    mutations: {
        setRace(state, args) {
            state.raceForm.race = args.race;
            state.raceForm.subrace = args.subrace;
        }
    }
};