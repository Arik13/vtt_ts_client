import {Subscriber} from "./Subscriber";

type SubscriberData = {
    subscriber: Subscriber;
    index: number;
    id: number;
}

export class Store {
    // subscribers: SubscriberData[] = [];
    subscribers: Map<number, SubscriberData> = new Map();
    nextID = 1;
    getNextID() {
        return this.nextID++;
    }
    subscribe(subscriber: Subscriber) {
        const id = this.getNextID();
        this.subscribers.set(id, {subscriber, index: 0, id: id});
        return id;
    }
}