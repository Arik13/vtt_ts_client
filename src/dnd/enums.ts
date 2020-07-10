enum WEAPON {
    // SIMPLE MELEE
    CLUB = 1,
    DAGGER = 2,
    GREATCLUB = 3,
    HANDAXE = 4,
    JAVELIN = 5,
    LIGHTHAMMER = 6,
    MACE = 7,
    QUARTERSTAFF = 8,
    SICKLE = 9,
    SPEAR = 10,

    // SIMPLE RANGED
    CROSSBOW_LIGHT = 11,
    DART = 12,
    SHORTBOW = 13,
    SLING = 14,

    // MARTIAL MELEE
    BATTLEAXE = 15,
    FLAIL = 16,
    GLAIVE = 17,
    GREATAXE = 18,
    GREATSWORD = 19,
    HALBERD = 20,
    LANCE = 21,
    LONGSWORD = 22,
    MAUL = 23,
    MORNINGSTAR = 24,
    PIKE = 25,
    RAPIER = 26,
    SCIMITAR = 27,
    SHORTSWORD = 28,
    TRIDENT = 29,
    WARPICK = 30,
    WARHAMMER = 31,
    WHIP = 32,

    // MARTIAL RANGED
    BLOWGUN = 33,
    CROSSBOW_HAND = 34,
    CROSSBOW_HEAVY = 35,
    LONGBOW = 36,
    NET = 37,
}

enum SIZE {
    TINY = 1,
    SMALL = 2,
    MEDIUM = 3,
    LARGE = 4,
    HUGE = 5,
    GARGANTUAN = 6,
}

enum CLASS {
    BARBARIAN = 1,
    BARD = 2,
    CLERIC = 3,
    DRUID = 4,
    FIGHTER = 5,
    MONK = 6,
    PALADIN = 7,
    RANGER = 8,
    ROGUE = 9,
    SORCERER = 10,
    WARLOCK = 12,
    WIZARD = 13,
}

enum RACE {
    DRAGONBORN = 1,
    DWARF = 2,
    ELF = 3,
    GNOME = 4,
    HALFELF = 5,
    HALFLING = 6,
    HALFORC = 7,
    HUMAN = 8,
    TIEFLING = 9,
    AASIMAR = 10,
}

enum ATTRIBUTE {
    STRENGTH = 1,
    DEXTERITY = 2,
    CONSTITUTION = 3,
    CHARISMA = 4,
    INTELLIGENCE = 5,
    WISDOM = 6,
}

enum DAMAGE_TYPE {
    SLASHING = 1,
    PIERCING = 2,
    BLUDGEONING = 3,
    POISON = 4,
    ACID = 5,
    FIRE = 6,
    COLD = 7,
    RADIANT = 8,
    NECROTIC = 9,
    LIGHTNING = 10,
    THUNDER = 11,
    FORCE = 12,
    PSYCHIC = 13,
}

enum LANGUAGE {
    COMMON = 1,
    DWARVISH = 2,
    ELVISH = 3,
    GIANT = 4,
    GNOMISH = 5,
    GOBLIN = 6,
    HALFLING = 7,
    ORC = 8,
    ABYSSAL = 9,
    CELESTIAL = 10,
    DRACONIC = 11,
    DEEP = 12,
    INFERNAL = 13,
    PRIMORDIAL = 14,
    SYLVAN = 15,
    UNDERCOMMON = 16,
}

enum SKILL {
    ACROBATICS = 1,
    ANIMAL_HANDLING = 2,
    ARCANA = 3,
    ATHLETICS = 4,
    DECEPTION = 5,
    HISTORY = 6,
    INSIGHT = 7,
    INTIMIDATION = 8,
    INVESTIGATION = 9,
    MEDICINE = 10,
    NATURE = 12,
    PERCEPTION = 12,
    PERFORMANCE = 13,
    PERSUASION = 14,
    RELIGION = 15,
    SLEIGHT_OF_HAND = 16,
    STEALTH = 17,
    SURVIVAL = 18,
}

enum COMBAT_ACTION_TYPE {
    STANDARD = 1,
    MOVE = 2,
    BONUS = 3,
}

enum ALIGNMENT {
    LAWFUL_GOOD = 1,
    NEUTRAL_GOOD = 2,
    CHAOTIC_GOOD = 3,
    LAWFUL_NEUTRAL = 4,
    TRUE_NEUTRAL = 5,
    CHAOTIC_NEUTRAL = 6,
    LAWFUL_EVIL = 7,
    NEUTRAL_EVIL = 8,
    CHAOTIC_EVIL = 9,
}

export {
    WEAPON,
    SIZE,
    CLASS,
    RACE,
    ATTRIBUTE,
    DAMAGE_TYPE,
    LANGUAGE,
    SKILL,
    COMBAT_ACTION_TYPE,
    ALIGNMENT,
}