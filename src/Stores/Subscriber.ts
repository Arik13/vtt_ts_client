export interface Subscriber {
    added(id: string): void;
    deleted(id: string): void;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    updated?(id: string, ...args: any[]): void;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    notify?(eventName: string, event: any): void;
}