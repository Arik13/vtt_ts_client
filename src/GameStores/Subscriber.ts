export interface Subscriber {
    added(id: string): void;
    deleted(id: string): void;
}