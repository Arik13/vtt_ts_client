export class DialogObject<T> {
    on: boolean;
    state: T;
    global: any;
    blankState: T;
    constructor(blankState: T) {
        this.blankState = blankState;
        this.init();
    }
    callback: (state: T, closeType: "submit" | "dismiss") => void;
    init() {
        this.state = this.createState();
        this.on = false;
    }
    show(callback?: (state: T, closeType: "submit" | "dismiss") => void) {
        this.callback = callback;
        this.on = true;
    }
    hide(doCallback: boolean) {
        if (doCallback) {
            this.callback(this.state, "submit");
        }
        this.resetState();
        this.on = false;
    }
    dismiss() {
        this.callback(this.state, "dismiss");
        this.resetState();
        this.on = false;
    }
    resetState() {
        this.state = this.createState();
        this.global = null;
    }
    setState(state: T) {
        this.state = state;
    }
    createState(): T {
        return JSON.parse(JSON.stringify(this.blankState)) as T;
    }
}