export default class RadioFormElement<T> {
    title: string;
    component: Vue.Component;
    prop: T;
    constructor(title: string, component: Vue.Component, prop: T) {
        this.title = title;
        this.component = component;
        this.prop = prop;
    }
}