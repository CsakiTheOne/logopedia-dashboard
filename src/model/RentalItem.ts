export default class RentalItem {
    id: string;
    name: string;
    description: string;
    image: string;
    state: string;

    constructor(id: string, name: string, description: string, image: string, state: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.state = state;
    }
}