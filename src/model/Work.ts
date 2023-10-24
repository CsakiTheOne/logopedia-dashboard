export default class Work {
    title: string;
    description: string;
    durationMinutes: number;
    tags: string[] = [];

    constructor(title: string, description: string = '', durationMinutes: number = 0, tags: string[] = []) {
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.tags = tags;
    }

    static TAG_HIDDEN = 'hidden';
}