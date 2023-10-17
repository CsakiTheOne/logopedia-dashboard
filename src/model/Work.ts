export default class Work {
    title: string;
    description: string;
    durationMinutes: number;

    constructor(title: string, description: string = '', durationMinutes: number = 0) {
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
    }
}