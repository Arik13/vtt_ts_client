/*
    This is a singleton store that holds misc. campaign data that doesn't belong in any of the other stores.
    It also provides a way to interface with the campaign serverside
*/

import { Directory, DirectoryMap } from "@shared/Directories/Directory";
import * as Dir from "@shared/Directories/Directory";



// class DirectoryStore {
//     root: Directory = null;
//     directoryMap: Map<string, Directory> = new Map();
//     getRoot(): Directory {
//         return this.root;
//     }
//     getDirectory(dirID: string) {
//         return this.directoryMap.get(dirID);
//     }
//     attachChild(dirSchema: Dir.DirectorySchema) {
//         if (this.directoryMap.get(dirSchema.id)) return;
//         const parent = this.directoryMap.get(dirSchema.parent);
//         const children: Directory[] = [];
//         if (dirSchema.children) {
//             dirSchema.children.forEach((childID: string) => {
//                 children.push(this.directoryMap.get(childID));
//             });
//         }
//         const dir: Directory = {
//             id: dirSchema.id,
//             name: dirSchema.name,
//             parent,
//             children,
//             itemID: dirSchema.itemID,
//             isOpen: true,
//         }
//         parent.children.push(dir);
//         this.directoryMap.set(dir.id, dir);
//         return this.directoryMap.get(dir.id);
//     }
//     delete(dirID: string) {
//         const dir = this.directoryMap.get(dirID);
//         const parent = dir.parent;
//         this.directoryMap.delete(dirID);
//         const index = parent.children.findIndex(subDir => dir.id == subDir.id);
//         parent.children.splice(index, 1);
//         console.log("Deleted: ", dirID, parent);

//     }
//     traverseDirectory(visit: (dir: Directory) => void) {
//         Dir.traverse(this.root, visit);
//     }
//     setRoot(root: Directory) {
//         this.root = root;
//         Dir.traverse(this.root, (dir => {
//             this.directoryMap.set(dir.id, dir);
//         }));
//     }
//     move(moveDirID: string, targetDirID: string) {
//         const moveDir = this.getDirectory(moveDirID);
//         const targetDir = this.getDirectory(targetDirID);
//         Dir.moveDirectory(moveDir, targetDir);
//     }
//     updateName(dirID: string, name: string) {
//         this.directoryMap.get(dirID).name = name;
//     }
// }

// const directoryStore: DirectoryStore = new DirectoryStore();
const directoryStore = new DirectoryMap();

export {
    // DirectoryStore,
    directoryStore,
}