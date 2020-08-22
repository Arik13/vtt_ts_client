import {Asset} from "@shared/Assets/Asset";

export class LocationStore {
    locations: Asset.LocationData[];
    getLocation(id: string) {
        // Linear search, can be improved later to binary search or hashtables
        for (let i = 0; i < this.locations.length; i++) {
            if (this.locations[i].locationID == id) {
                return this.locations[i];
            }
        }
    }
    setLocations(locations: Asset.LocationData[]) {
        this.locations = locations;
    }
    forEach(handler: (value: Asset.LocationData) => void) {
        this.locations.forEach(handler);
    }
}

const locationStore = new LocationStore();

export {locationStore};