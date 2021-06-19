import * as Asset from "@shared/Assets/Asset";

export let turnViewInterface: TurnViewInterface = null;

export type TurnItem = {id: string, order: number};

interface TurnViewInterface {
    setTurnSequence(turnData: Asset.TurnData): void;
    // startTurnSequence(turnData: Asset.TurnData): void;
    // endTurn(turnData: Asset.TurnData): void;
    moveTurn(index: number): void;
    endTurnSequence(): void;
}

class TurnState extends Asset.TurnData {
    set(turnData: Asset.TurnData) {
        this.round = turnData.round;
        this.turnItems = turnData.turnItems;
    }
}

export let turnState = new TurnState();

export const initTurnViewInterface = (tvi: TurnViewInterface) => {
    turnViewInterface = tvi;
}