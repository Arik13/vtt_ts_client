import { globalMouseContext, MOUSE_CONTEXT } from "./MouseContext";

const disable = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
}

enum MOUSE_EVENT {
    LEFT_CLICK = "click",
    RIGHT_CLICK = "contextmenu",
}

enum MOUSE_ACTION {
    DISABLE_LEFT_CLICK,
}

// window.addEventListener(MOUSE_EVENT.LEFT_CLICK, e => {
//     switch(globalMouseContext.context) {
//     case (MOUSE_CONTEXT.DEFAULT):
//         console.log("MOUSE DEFAULT MODE");
//         return;
//     case (MOUSE_CONTEXT.TARGETING):
//         console.log("MOUSE TARGETING MODE");
//         return;
//     }
// });

type Handler = (e: MouseEvent) => void;

class MouseController {
    handlerMap: Map<string, Handler>;
    disableLeftClick(handleOnce?: boolean) {
        if (handleOnce) {
            this.handleOnce(MOUSE_EVENT.LEFT_CLICK, disable, true);
        }
    }
    enableLeftClick() {
        window.removeEventListener(MOUSE_EVENT.LEFT_CLICK, disable, true);
    }
    handleOnce(eventName: MOUSE_EVENT, handler: Handler, useCapture?: boolean) {
        const wrapper = (e: any) => {
            handler(e);
            window.removeEventListener(eventName, wrapper, true);
        };
        window.addEventListener(eventName, wrapper, useCapture);
    }
    // overrideNextLeftClick(handler: Handler, handleOnce?: boolean) {
    //     let cancelHandlers = () => {
    //         window.removeEventListener(MOUSE_EVENT.LEFT_CLICK, disable, true);
    //         window.removeEventListener(MOUSE_EVENT.LEFT_CLICK, handler, true);
    //         window.removeEventListener(MOUSE_EVENT.RIGHT_CLICK, disable, true);
    //     }
    //     window.addEventListener(MOUSE_EVENT.LEFT_CLICK, e => {
    //         disable(e);
    //         // window.removeEventListener(MOUSE_EVENT.LEFT_CLICK)
    //     }, true);
    //     this.handleOnce(MOUSE_EVENT.LEFT_CLICK, handler, true);
    // }
}

let mouseController = new MouseController();

export {
    mouseController,
    MOUSE_EVENT,
    // MOUSE_ACTION
}