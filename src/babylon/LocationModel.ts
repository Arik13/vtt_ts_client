import { Asset } from '@shared/Assets/Asset';

export class LocationModel {
    gridElementWidth: number;
    gridElementHeight: number;
    files: number;
    ranks: number;
    worldSpaceWidth: number;
    worldSpaceHeight: number;
    // locationData: Asset.LocationData
    // tokens: PositionedToken[];
    constructor(
        worldSpaceWidth: number,
        worldSpaceHeight: number,
        ranks: number,
        files: number,
        // locationData: Asset.LocationData,
        )
    {
        this.worldSpaceWidth = worldSpaceWidth;
        this.worldSpaceHeight = worldSpaceHeight;
        this.ranks = ranks;
        this.files = files;
        this.gridElementHeight = worldSpaceHeight / ranks;
        this.gridElementWidth = worldSpaceWidth / files;
        // this.locationData = locationData;
    }
    getWidth(): number {
        return this.worldSpaceWidth;
    }
    getHeight(): number {
        return this.worldSpaceHeight;
    }
    getRanks(): number {
        return this.ranks;
    }
    getFiles(): number {
        return this.files;
    }
    getGridElementWidth(): number {
        return this.gridElementWidth;
    }
    getGridElementHeight(): number {
        return this.gridElementHeight;
    }
    calcPosition(rank: number, file: number): BABYLON.Vector3 {
        return new BABYLON.Vector3(
            -(this.worldSpaceWidth/2) + rank * this.gridElementWidth + this.gridElementWidth/2,
            -(this.worldSpaceHeight/2) + rank * this.gridElementHeight + this.gridElementHeight/2,
            0
        );
    }
    findClosestTileCenter(position: BABYLON.Vector3): BABYLON.Vector3 {
        const positiveX = position.x + this.worldSpaceWidth / 2 - this.gridElementWidth/2;
        const positiveY = position.z + this.worldSpaceHeight / 2 - this.gridElementWidth/2;
        const newRank = Math.round(positiveX / this.gridElementWidth);
        const newFile = Math.round(positiveY / this.gridElementHeight);
        const newX = (newRank * this.gridElementWidth) - this.worldSpaceWidth/2 + this.gridElementWidth/2;
        const newY = (newFile * this.gridElementHeight) - this.worldSpaceHeight/2  + this.gridElementHeight/2;
        return new BABYLON.Vector3(newX, 0, newY);
    }
}