/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

import { serverProxy, ServerProxy } from './ServerProxy';
import {Directory} from "@shared/Directories/Directory";
import * as Dir from "@shared/Directories/Directory";
import {Subscriber} from "./Subscriber";

export enum CAMPAIGN_EVENT {
    ACTIVE_LOCATION_UPDATED = "ActiveLocationUpdated",
}
export interface CampaignSubscriber extends Subscriber {
    updated?(id: string, eventName: CAMPAIGN_EVENT): void;
}

class DirectoryStore {
    subscribers: Subscriber[] = [];
    serverProxy: ServerProxy = serverProxy;
    root: Directory = null;
    directoryMap: Map<string, Directory> = new Map();
    getRoot(): Directory {
        return this.root;
    }
    getDirectory(dirID: string) {
        return this.directoryMap.get(dirID);
    }
    attachChild(dir: Directory, parentID: string) {
        const parentDir = this.directoryMap.get(parentID);
        dir.parent = parentDir;
        parentDir.children.push(dir);
        this.directoryMap.set(dir.id, dir);
    }
    delete(dirID: string) {
        const dir = this.directoryMap.get(dirID);
        const parentDir = dir.parent;
        this.directoryMap.delete(dirID);
        const index = parentDir.children.findIndex(subDir => {
            return dir.id == subDir.id;
        })
        parentDir.children.splice(index, 1);
    }
    traverseDirectory(visit: (dir: Directory) => void) {
        Dir.traverse(this.root, visit);
    }
    setRoot(root: Directory) {
        this.root = root;
        Dir.traverse(this.root, (dir => {
            this.directoryMap.set(dir.id, dir);
        }));
    }
    addSubscriber(subscriber: Subscriber) {
        this.subscribers.push(subscriber);
    }
}

const directoryStore: DirectoryStore = new DirectoryStore();

export {
    DirectoryStore,
    directoryStore,
}