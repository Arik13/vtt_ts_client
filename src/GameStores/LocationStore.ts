/*


*/

export class Location {
    _id: string;

}

export class LocationStore {
    locations: Location[];
    setLocation(locations: Location[]) {
        this.locations = locations;
    }
    getLoaction(id: string) {
        // Linear search, can be improved later
        // Possibly switch locations to be a hashtable
        this.locations.forEach((location) => {
            if (location._id == id) return location;
        })
    }
}

const locationStore = new LocationStore();

export {locationStore};