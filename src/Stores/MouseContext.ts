import { CLIENT_EVENT, eventBus } from "./EventBus";

enum MOUSE_CONTEXT {
    DEFAULT,
    TARGETING,
}

const changeCursor = (cur: string, url: string) => (url)? document.body.style.cursor = `url(${url}), ${cur}` : document.body.style.cursor = `${cur}`;

class GlobalMouseContext {
    context: MOUSE_CONTEXT = MOUSE_CONTEXT.DEFAULT;
    setContext(context: MOUSE_CONTEXT, cursorURL?: string) {
        switch(context) {
            case MOUSE_CONTEXT.DEFAULT:
                changeCursor("auto", cursorURL);
                break;
            case MOUSE_CONTEXT.TARGETING:
                changeCursor("crosshair", cursorURL);
                break;
        }
        this.context = context;
        eventBus.dispatch(CLIENT_EVENT.MOUSE_CONTEXT_CHANGED, context);
    }
}

const globalMouseContext = new GlobalMouseContext();
export {
    globalMouseContext,
    MOUSE_CONTEXT,
}