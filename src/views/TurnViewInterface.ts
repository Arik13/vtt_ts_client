export let turnViewInterface: TurnViewInterface = null;

export type TurnItem = {soID: string, order: number};

interface TurnViewInterface {
    startTurnSequence(turnItems: TurnItem[], round: number): void;
    endTurn(turnItems: TurnItem[], round: number): void;
    moveTurn(index: number): void;
    endTurnSequence(): void;
}

export const initTurnViewInterface = (tvi: TurnViewInterface) => {
    turnViewInterface = tvi;
}