export type RentalItemStatus = 'available' | 'requested' | 'rented' | 'unavailable';

/*
available: item is available to be rented
requested: item has been requested by a user but not yet approved so it can be requested by other users
rented: item is currently rented by a user and not available
unavailable: item is not available to be rented
*/

export default class RentalItem {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    status: RentalItemStatus;
    currentHolderEmail: string = '';

    constructor(id: string, name: string, description: string, imageUrl: string, status: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status as RentalItemStatus;
    }
}