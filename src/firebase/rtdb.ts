import { ex } from '@fullcalendar/core/internal-common';
import { app } from './firebase';
import { getDatabase, ref, child, get, set } from 'firebase/database';

const dbRef = ref(getDatabase(app));

const pathAbout = 'meta/about';

export function getAbout(callback: (about: string) => void) {
    get(child(dbRef, pathAbout))
        .then(snapshot => callback(snapshot.val()))
        .catch(error => callback(''));
}

export function setAbout(value: string) {
    set(child(dbRef, pathAbout), value);
}

export function getDayStart(callback: (dayStart: string) => void) {
    get(child(dbRef, 'appointment_settings/day_start'))
        .then(snapshot => callback(snapshot.val()))
        .catch(error => callback('8:00'));
}

export function setDayStart(value: string) {
    set(child(dbRef, 'appointment_settings/day_start'), value);
}

export function getDayEnd(callback: (dayStart: string) => void) {
    get(child(dbRef, 'appointment_settings/day_end'))
        .then(snapshot => callback(snapshot.val()))
        .catch(error => callback('16:00'));
}

export function setDayEnd(value: string) {
    set(child(dbRef, 'appointment_settings/day_end'), value);
}

export function getBreakBetweenWorks(callback: (breakBetweenWorks: number) => void) {
    get(child(dbRef, 'appointment_settings/break_between_works'))
        .then(snapshot => callback(snapshot.val()))
        .catch(error => callback(0));
}