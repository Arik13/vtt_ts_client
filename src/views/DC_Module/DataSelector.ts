
import {DataSelection} from "./ComponentTypes"
import * as Caser from "change-case";
import { dcStore } from "@/Stores/DynamicComponentStore";
type DataType = DataSelection | DataSelection[] | string | number | boolean | string[] | number[] | boolean[];
export const selectData = (selectors: DataType, json: any) => {
    let fields: string[] = [];
    if (Array.isArray(selectors)) {
        for (let i = 0; i < selectors.length; i++) {
            if (typeof(selectors[i]) != "object") {
                let dataString = selectors[i] as string;
                fields.push(dataString);
            }
            else {
                let selector = selectors[i] as DataSelection
                fields.push(...doSelection(selector, json));
            }
        }
    }
    else {
        selectors = selectors as DataSelection;
        fields.push(...doSelection(selectors, json));
    }
    return fields;
}
export const doSelection = (selector: DataSelection, json: any) => {
    let fields = [];
    let dataObj = getPathObj(json, selector.path);
    if (typeof(dataObj) == "object") {
        fields.push(...createFields(dataObj, selector));
    }
    else {
        let value;
        if (selector.useKey) {
            value = selector.path[selector.path.length - 1];
        }
        else {
            value = dataObj;
        }
        let field = transformField(value, selector);
        fields.push(field);
    }
    return fields;
}

const getPathObj = (obj: any, path: string[]) => {
    let subObj = obj;
    for (let i = 0; i < path.length; i++) {
        subObj = subObj[path[i]]
        if (!subObj || typeof(subObj) != "object") return subObj;
    }
    return subObj;
}
const createFields = (dataObj: any, selector: DataSelection, predicate?: (key: string) => boolean) => {
    let fields = []
    for (let key in dataObj) {
        if (!predicate || predicate(key)) {
            let value = (selector.useKey)? key : dataObj[key];
            let field = transformField(value, selector);
            fields.push(field);
        }
    }
    return fields;
}

export const transformField = (value: string, selector: DataSelection) => {
    if (value == null) return "";
    if (typeof(value) != "string") return value;

    if (selector.replaceList) {
        let replaceList = selector.replaceList
        if (typeof(selector.replaceList) == "string") {
            replaceList = dcStore.getAssembledDC(selector.replaceList).cd;
        }
        value = replaceList[value];
    }
    switch (selector.case) {
    case "titleCase":
        return Caser.capitalCase(value);
    case "camelCase":
        return Caser.camelCase(value);
    case "kebabCase":
        return Caser.headerCase(value);
    case "snakeCase":
        return Caser.snakeCase(value);
    case "sentenceCase":
        return Caser.sentenceCase(value);
    }
    return value;
}