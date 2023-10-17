export default class Appointment {
    id: string;
    userId: string;
    workTitle: string;
    date: string;
    startTime: string;
    
    constructor(id: string, userId: string, workTitle: string, date: string, startTime: string) {
        this.id = id;
        this.userId = userId;
        this.workTitle = workTitle;
        this.date = date;
        this.startTime = startTime;
    }
}