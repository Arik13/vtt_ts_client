export enum MENU_ITEM_TITLE {
    CREATE_TOKEN = "Create Token",

    OPEN_IMAGE = "Open Image",
    CREATE_IMAGE = "Create Image",
    DELETE_IMAGE = "Delete Image",

    CREATE_LOCATION = "Create Location",
    OPEN_LOCATION = "Open Location",
    DELETE_LOCATION = "Delete Location",
    VIEW_LOCATION = "View Location",

    CREATE_DIRECTORY = "Create Directory",
    DELETE_DIRECTORY = "Delete Directory",

    CREATE_SCRIPT = "Create Script",
    DELETE_SCRIPT = "Delete Script",
    OPEN_SCRIPT = "Open Script",

    CREATE_CHARACTER = "Create Character",
    DELETE_CHARACTER = "Delete Character",
    VIEW_CHARACTER = "View Character",

    CREATE_COMPONENT = "Create Component",
    DELETE_COMPONENT = "Delete Component",
    VIEW_COMPONENT = "View Component",
}
export enum MENU_ITEM_NAME {
    CREATE_TOKEN = "createToken",

    OPEN_IMAGE = "openImage",
    CREATE_IMAGE = "createImage",
    DELETE_IMAGE = "deleteImage",

    CREATE_LOCATION = "createLocation",
    OPEN_LOCATION = "openLocation",
    DELETE_LOCATION = "deleteLocation",
    VIEW_LOCATION = "viewLocation",

    CREATE_DIRECTORY = "createDirectory",
    DELETE_DIRECTORY = "deleteDirectory",

    CREATE_SCRIPT = "createScript",
    DELETE_SCRIPT = "deleteScript",
    OPEN_SCRIPT = "openScript",

    CREATE_CHARACTER = "createCharacter",
    DELETE_CHARACTER = "deleteCharacter",
    VIEW_CHARACTER = "viewCharacter",

    CREATE_COMPONENT = "createComponent",
    DELETE_COMPONENT = "deleteComponent",
    VIEW_COMPONENT = "viewComponent",
}

interface MENU_ITEM {
    title: MENU_ITEM_TITLE;
    name: MENU_ITEM_NAME;
}

interface MENU_ITEMS {
    [key: string]: MENU_ITEM;
}

const menuItems: MENU_ITEMS = {
    // TOKENS
    CREATE_TOKEN: {
        title: MENU_ITEM_TITLE.CREATE_TOKEN,
        name: MENU_ITEM_NAME.CREATE_TOKEN,
    },

    // IMAGES
    OPEN_IMAGE: {
        title: MENU_ITEM_TITLE.OPEN_IMAGE,
        name: MENU_ITEM_NAME.OPEN_IMAGE,
    },
    CREATE_IMAGE: {
        title: MENU_ITEM_TITLE.CREATE_IMAGE,
        name: MENU_ITEM_NAME.CREATE_IMAGE,
    },
    DELETE_IMAGE: {
        title: MENU_ITEM_TITLE.DELETE_IMAGE,
        name: MENU_ITEM_NAME.DELETE_IMAGE,
    },

    // LOCATIONS
    CREATE_LOCATION: {
        title: MENU_ITEM_TITLE.CREATE_LOCATION,
        name: MENU_ITEM_NAME.CREATE_LOCATION,
    },
    OPEN_LOCATION: {
        title: MENU_ITEM_TITLE.OPEN_LOCATION,
        name: MENU_ITEM_NAME.OPEN_LOCATION,
    },
    DELETE_LOCATION: {
        title: MENU_ITEM_TITLE.DELETE_LOCATION,
        name: MENU_ITEM_NAME.DELETE_LOCATION,
    },
    VIEW_LOCATION: {
        title: MENU_ITEM_TITLE.VIEW_LOCATION,
        name: MENU_ITEM_NAME.VIEW_LOCATION,
    },


    // DIRECTORIES
    CREATE_DIRECTORY: {
        title: MENU_ITEM_TITLE.CREATE_DIRECTORY,
        name: MENU_ITEM_NAME.CREATE_DIRECTORY,
    },
    DELETE_DIRECTORY: {
        title: MENU_ITEM_TITLE.DELETE_DIRECTORY,
        name: MENU_ITEM_NAME.DELETE_DIRECTORY,
    },


    // SCRIPTS
    CREATE_SCRIPT: {
        title: MENU_ITEM_TITLE.CREATE_SCRIPT,
        name: MENU_ITEM_NAME.CREATE_SCRIPT,
    },
    DELETE_SCRIPT: {
        title: MENU_ITEM_TITLE.DELETE_SCRIPT,
        name: MENU_ITEM_NAME.DELETE_SCRIPT,
    },
    OPEN_SCRIPT: {
        title: MENU_ITEM_TITLE.OPEN_SCRIPT,
        name: MENU_ITEM_NAME.OPEN_SCRIPT,
    },

    // CHARACTERS
    CREATE_CHARACTER: {
        title: MENU_ITEM_TITLE.CREATE_CHARACTER,
        name: MENU_ITEM_NAME.CREATE_CHARACTER,
    },
    DELETE_CHARACTER: {
        title: MENU_ITEM_TITLE.DELETE_CHARACTER,
        name: MENU_ITEM_NAME.DELETE_CHARACTER,
    },
    VIEW_CHARACTER: {
        title: MENU_ITEM_TITLE.VIEW_CHARACTER,
        name: MENU_ITEM_NAME.VIEW_CHARACTER,
    },


    // COMPONENTS
    CREATE_COMPONENT: {
        title: MENU_ITEM_TITLE.CREATE_COMPONENT,
        name: MENU_ITEM_NAME.CREATE_COMPONENT,
    },
    DELETE_COMPONENT: {
        title: MENU_ITEM_TITLE.DELETE_COMPONENT,
        name: MENU_ITEM_NAME.DELETE_COMPONENT,
    },
    VIEW_COMPONENT: {
        title: MENU_ITEM_TITLE.VIEW_COMPONENT,
        name: MENU_ITEM_NAME.VIEW_COMPONENT,
    },
}

export {
    menuItems as MENU_ITEMS
};
