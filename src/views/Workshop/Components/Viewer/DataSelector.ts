
import {DataSelection} from "../../ComponentTypes"
export const selectData = (selectors: DataSelection | DataSelection[] | string | number | boolean, json: any) => {
    let fields = [];
    if (Array.isArray(selectors)) {
        selectors as DataSelection[];
        for (let i = 0; i < selectors.length; i++) {
            if (typeof(selectors[i]) != "object") {
                fields.push(selectors[i]);
            }
            else {
                fields.push(...doSelection(selectors[i], json));
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
        fields.push(...createFields(dataObj, selector.useKey));
    }
    else {
        if (selector.useKey) {
            fields.push(selector.path[selector.path.length - 1]);
        }
        else {
            fields.push(dataObj);
        }
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
const createFields = (dataObj: any, useKey?: boolean, descs?: any, predicate?: (key: string) => boolean) => {
    let fields = []
    for (let key in dataObj) {
        if (!predicate || predicate(key)) {
            let value = (descs && descs[key])? descs[key] : dataObj[key];
            value = (useKey)? key : value;
            fields.push(value);
        }
    }
    return fields;
}