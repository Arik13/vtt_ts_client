<template>
<v-container>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col :cols="2">
                    <div v-for="(field, i) in fields" :key=i>
                        <field-test :value="field"></field-test>
                    </div>
                </v-col>
                <v-col :cols="2">
                    <div v-for="(field, i) in fields" :key=i>
                        <field-test :value="field"></field-test>
                    </div>
                </v-col>
            </v-row>
            <v-btn @click="renderForm()">
                Test
            </v-btn>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script lang="ts">


let so = {"id":"6035442d5d677744a4c2200a","name":"YOLO $waggins","property":{"race":"Halfling","subrace":"Lightfoot","alignment":"Chaotic Evil","size":2,"speed":25,"spellcasting":false,"ritualCasting":false,"darkvision":false,"offHandPenalty":true,"proficiencyBonus":2,"carryCapacity":150,"meleeAttackModifier":0},"levels":{"barbarian":0,"bard":0,"cleric":0,"druid":0,"fighter":0,"monk":0,"paladin":0,"ranger":0,"rogue":1,"sorcerer":0,"warlock":0,"wizard":0,"level":1,"spellcaster":0},"maxAbilityScore":30,"minAbilityScore":1,"maxModifier":10,"minModifier":-5,"base":{"strength":10,"dexterity":18,"constitution":14,"intelligence":14,"wisdom":11,"charisma":14},"as":{"strength":10,"dexterity":18,"constitution":14,"intelligence":14,"wisdom":11,"charisma":14},"mod":{"strength":0,"dexterity":4,"constitution":2,"intelligence":2,"wisdom":0,"charisma":2},"equippedSlots":{"mainHand":false,"offHand":false,"armor":false,"shield":false},"ac":{"base":0,"armor":0,"total":14},"hp":{"bonus":0,"max":10,"total":10,"hitDice":[8],"hitDiceRolls":[8]},"attackRollBonuses":{"all":0,"rangedWeapon":0,"meleeWeapon":0},"damageBonuses":{"all":0,"rangedWeapon":0,"meleeWeapon":0},"spellSlots":{"slot1":0,"slot2":0,"slot3":0,"slot4":0,"slot5":0,"slot6":0,"slot7":0,"slot8":0,"slot9":0},"savingThrowProfs":{"strength":false,"dexterity":true,"constitution":false,"intelligence":true,"wisdom":false,"charisma":false},"savingThrows":{"strength":0,"dexterity":7,"constitution":2,"intelligence":5,"wisdom":0,"charisma":2},"statusSavingThrowAdvantage":{"charm":false,"frightened":false,"poison":false},"magicSavingThrows":{"strength":false,"dexterity":false,"constitution":false,"intelligence":false,"wisdom":false,"charisma":false},"weaponProfs":{"simple":true,"martial":false,"club":false,"dagger":false,"greatClub":false,"handaxe":false,"javelin":false,"lightHammer":false,"mace":false,"quarterstaff":false,"sickle":false,"spear":false,"lightCrossbow":false,"dart":false,"shortbow":false,"sling":false,"battleaxe":false,"flail":false,"glaive":false,"greataxe":false,"greatsword":false,"halberd":false,"lance":false,"longsword":true,"maul":false,"morningstar":false,"pike":false,"rapier":true,"scimitar":false,"shortsword":true,"trident":false,"warPick":false,"warhammer":false,"whip":false,"blowgun":false,"handCrossbow":true,"heavyCrossbow":false,"longbow":false,"net":false},"armorProfs":{"light":true,"medium":false,"heavy":false,"shield":false},"skillProfs":{"acrobatics":true,"animalHandling":false,"arcana":false,"athletics":true,"deception":true,"history":false,"insight":true,"intimidation":false,"investigation":false,"medicine":false,"nature":false,"perception":false,"performance":false,"persuasion":false,"religion":true,"sleightOfHand":false,"stealth":false,"survival":false},"skills":{"acrobatics":8,"animalHandling":0,"arcana":2,"athletics":2,"deception":6,"history":2,"insight":2,"intimidation":2,"investigation":2,"medicine":0,"nature":2,"perception":0,"performance":2,"persuasion":2,"religion":4,"sleightOfHand":4,"stealth":4,"survival":0},"toolProfs":{"alchemist":false,"brewer":false,"calligrapher":false,"carpenter":false,"cartographer":false,"cobbler":false,"cook":false,"glassblower":false,"jeweler":false,"leatherworker":false,"mason":false,"navigator":false,"painter":false,"potter":false,"smith":false,"thief":true,"tinker":false,"weaver":false,"woodcarver":false,"dice":false,"playingCards":false},"tools":{"alchemist":0,"brewer":0,"calligrapher":0,"carpenter":0,"cartographer":0,"cobbler":0,"cook":0,"glassblower":0,"jeweler":0,"leatherworker":0,"mason":0,"navigator":0,"painter":0,"potter":0,"smith":0,"thief":2,"tinker":0,"weaver":0,"woodcarver":0,"dice":0,"playingCards":0},"kitProfs":{"herbalism":false,"disguise":false,"forgery":false,"poisoner":false},"kits":{"herbalism":0,"disguise":0,"forgery":0,"poisoner":0},"instrumentProfs":{"bagpipes":false,"drum":false,"dulcimer":false,"flute":false,"lute":false,"lyre":false,"horn":false,"panFlute":false,"shawm":false,"viol":false},"languages":{"common":true,"dwarvish":true,"druidic":false,"elvish":true,"giant":false,"gnomish":false,"goblin":false,"halfling":true,"orc":false,"abyssal":false,"celestial":false,"draconic":false,"deepSpeech":false,"infernal":false,"primordial":false,"sylvan":false,"undercommon":false},"resistances":{"acid":false,"bludgeoning":false,"cold":false,"fire":false,"force":false,"lightning":false,"necrotic":false,"piercing":false,"poison":false,"psychic":false,"radiant":false,"slashing":false,"thunder":false},"immunities":{"acid":false,"bludgeoning":false,"cold":false,"fire":false,"force":false,"lightning":false,"necrotic":false,"piercing":false,"poison":false,"psychic":false,"radiant":false,"slashing":false,"thunder":false},"vulnerabilities":{"acid":false,"bludgeoning":false,"cold":false,"fire":false,"force":false,"lightning":false,"necrotic":false,"piercing":false,"poison":false,"psychic":false,"radiant":false,"slashing":false,"thunder":false},"statusImmunities":{"sleep":false},"features":{"shelterOfTheFaithful":true,"expertise":true,"sneakAttack":true,"thievesCant":true},"abilities":{"sneakAttack":true},"halfling":{"lucky":true,"halflingNimbleness":true,"naturallyStealthy":true}};
// import draggable from 'vuedraggable';

import Vue from 'vue'
import { dialogMap, DIALOG_NAME } from '../Dialogs/Dialog';
import * as Asset from "@shared/Assets/Asset";
import { dcStore } from '@/Stores/DynamicComponentStore';
import FieldTest from "./FieldTest.vue";
import { COMPONENT_PROP } from './ComponentTypes';

const cd = [
    {
        name: "Object Viewer",
        value: {
            path: ["as"],
            descriptions: {
                sneakAttack: "It's a motha fucking sneak attack!"
            }
        }
    },
];

const genBlankCD = () => {
    return {id: "", name: "", cd};
}
const assembleCD = (cd: any) => {
    for (let key in cd) {
        if (
            cd[key] &&
            (typeof(cd[key]) == "object" ||
            Array.isArray(cd[key]))
        ) {
            let cdID = null;
            let cdKey = null;
            if (cd[key].cds && typeof(cd[key].cds) == "string") {
                cdID = cd[key].cds;
                cdKey = "cds";
            }
            else if (cd[key].choices && typeof(cd[key].choices) == "string") {
                cdID = cd[key].choices;
                cdKey = "choices";
            }
            if (cdID) {
                let storeCD = dcStore.get(cdID).cd;
                let subCD = JSON.parse(JSON.stringify(storeCD));
                assembleCD(subCD);
                cd[key][cdKey] = subCD;
            }
            else {
                assembleCD(cd[key]);
            }
        }
    }
}

export default Vue.extend({
    data: () => ({
        nextKey: 0,
        activeCD: genBlankCD() as Asset.DynamicComponent.Data,
        fields: [],
        value: {
            displayable: [],
            path: ["as"],
            descriptions: {
                sneakAttack: "It's a motha fucking sneak attack!"
            } as any
        },
        global: {
            so,
        }
    }),
    components: {
        FieldTest,
        // draggable,
    },
    methods: {
        renderForm() {
            try {
                this.nextKey++;
                const dialog = dialogMap.get(DIALOG_NAME.DYNAMIC_COMPONENT);
                let cdOriginal = this.activeCD.cd;
                let cd = JSON.parse(JSON.stringify(cdOriginal))
                assembleCD(cd);
                dialog.state.cds = {
                    header: "",
                    cds: cd,
                };

                dialog.show((state) => {
                    const action = state.action;
                })
            }
            catch (error) {
                console.log(error);
            }
        },

    },
    mounted()  {
        let path = this.value.path;
        let obj = this.global.so as any;
        for (let i = 0; i < path.length; i++) {
            if (obj && typeof(obj) == "object") obj = obj[path[i]];
            else throw new Error("Something is fucked up");
        }
        for (let key in obj) {
            if (!this.value.displayable.length || this.value.displayable.includes(key)) {
                let value = (this.value.descriptions[key])? this.value.descriptions[key] : obj[key];
                this.fields.push({key, value});
            }
        }
    }
})
</script>