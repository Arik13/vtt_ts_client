
export class MenuObject<T> {
    on: boolean;
    state: T;
    blankState: T;
    constructor(blankState: T) {
        this.blankState = blankState;
        this.init();
    }
    callback: (state: T) => void;
    init() {
        this.state = this.createState();
        this.on = false;
    }
    show(callback: (state: T) => void) {
        this.callback = callback;
        this.on = true;
    }
    hide(doCallback: boolean) {
        if (doCallback) {
            this.callback(this.state);
        }
        this.resetState();
        this.on = false;
    }
    resetState() {
        this.state = this.createState();
    }
    setState(state: T) {
        this.state = state;
    }
    createState(): T {
        return JSON.parse(JSON.stringify(this.blankState)) as T;
    }
}