import { app } from './firebase';
import { getCurrentUser } from './auth';
import { getFirestore, doc, getDoc, getDocs, collection, query, where, updateDoc, QueryDocumentSnapshot, DocumentData, DocumentReference, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import Work from '../model/Work';
import Appointment from '../model/Appointment';
import RentalItem from '../model/RentalItem';

const db = getFirestore(app);

//
// User
//
export function userIsAdmin(callback: (isAdmin: boolean) => void) {
    const userUid = getCurrentUser()?.uid;
    if (!getCurrentUser() || !userUid) {
        callback(false);
        return;
    }

    const docRef = doc(db, 'users', userUid);
    getDoc(docRef)
        .then(snapshot => {
            console.log(snapshot.data());
            callback(snapshot.data()?.isAdmin);
        })
        .catch(error => {
            console.error(error);
            callback(false);
        });
}
export function setUserEmail(uid: string, email: string) {
    if (!uid) return;
    const docRef = doc(db, 'users', uid);
    setDoc(docRef, { email: email }, { merge: true });
}
export function getUserEmail(uid: string, callback: (email: string) => void) {
    if (!uid) return;
    const docRef = doc(db, 'users', uid);
    getDoc(docRef)
        .then(snapshot => {
            callback(snapshot.data()?.email);
        })
        .catch(error => {
            console.error(error);
            callback('');
        });
}

//
// Works
//
export function getWorks(callback: (works: Work[]) => void) {
    getDocs(collection(db, 'works'))
        .then(querySnapshot => {
            const works: Work[] = [];
            querySnapshot.forEach(document => {
                works.push({ ...new Work(''), ...document.data() });
            });
            callback(works);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

export function updateWork(work: Work, oldTitle: string | undefined, callback: (isSuccesful: boolean) => void) {
    const q = query(collection(db, 'works'), where('title', '==', oldTitle));
    getDocs(q).then(querySnapshot => {
        // If the query returns any documents, update the first one with the new work object
        if (!querySnapshot.empty) {
            updateDoc(querySnapshot.docs[0].ref, { ...work })
                .then(() => callback(true))
                .catch(() => callback(false));
        }
        else {
            addDoc(collection(db, 'works'), { ...work })
                .then(() => callback(true))
                .catch(() => callback(false));
        }
    });
}

export function deleteWork(title: string | undefined, callback: (isSuccesful: boolean) => void) {
    if (!title) {
        callback(false);
        return;
    }

    const q = query(collection(db, 'works'), where('title', '==', title));
    getDocs(q).then(querySnapshot => {
        deleteDoc(querySnapshot.docs[0].ref)
            .then(() => callback(true))
            .catch(() => callback(false));
    });
}

//
// Appointments
//
export function getAppointments(callback: (appointments: Appointment[]) => void) {
    getDocs(collection(db, 'appointments'))
        .then(querySnapshot => {
            const appointments: Appointment[] = [];
            querySnapshot.forEach(document => {
                appointments.push({ ...new Appointment(document.id, '', '', '', ''), ...document.data() });
            });
            callback(appointments);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

export function getAppointmentsByUser(userId: string | undefined, callback: (appointments: Appointment[]) => void) {
    const q = query(collection(db, 'appointments'), where('userId', '==', userId));
    getDocs(q)
        .then(querySnapshot => {
            const appointments: Appointment[] = [];
            querySnapshot.forEach(document => {
                appointments.push({ ...new Appointment(document.id, '', '', '', ''), ...document.data() });
            });
            callback(appointments);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

export function getAppointmentsByDate(date: string, callback: (appointments: Appointment[]) => void) {
    const q = query(collection(db, 'appointments'), where('date', '==', date));
    getDocs(q)
        .then(querySnapshot => {
            const appointments: Appointment[] = [];
            querySnapshot.forEach(document => {
                appointments.push({ ...new Appointment(document.id, '', '', '', ''), ...document.data() });
            });
            callback(appointments);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

export function updateAppointment(appointment: Appointment, oldId: string | undefined, callback: (isSuccesful: boolean) => void) {
    if (oldId) {
        updateDoc(doc(db, 'works', oldId), { ...appointment })
            .then(() => callback(true))
            .catch(() => callback(false));
    }
    else {
        addDoc(collection(db, 'works'), { ...appointment })
            .then(() => callback(true))
            .catch(() => callback(false));
    }
}

export function deleteAppointment(id: string | undefined, callback: (isSuccesful: boolean) => void) {
    if (!id) {
        callback(false);
        return;
    }
    deleteDoc(doc(db, 'appointments', id))
        .then(() => callback(true))
        .catch(() => callback(false));
}

//
// Time
//

/**
 * This function returns the available times for a given date based on the selected work's duration.
 * @param date The day when the user wants to make an appointment.
 * @param workDuration The duration of the selected work.
 * @param callback The callback function that will be called with the available times.
 */
export function getFreeTimes(date: string, workDuration: number, callback: (times: string[]) => void) {
    getAppointmentsByDate(date, (appointments) => {
        //TODO: figure out times based on the incoming data
        callback(['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']);
    });
}

//
// Rental items
//
export function getRentalItems(callback: (items: RentalItem[]) => void) {
    getDocs(collection(db, 'items'))
        .then(querySnapshot => {
            const items: RentalItem[] = [];
            querySnapshot.forEach(document => {
                items.push({ ...new RentalItem(document.id, '', '', '', ''), ...document.data() });
            });
            callback(items);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

export function updateRentalItem(item: RentalItem, oldId: string | undefined, callback: (isSuccesful: boolean) => void) {
    if (oldId) {
        updateDoc(doc(db, 'items', oldId), { ...item })
            .then(() => callback(true))
            .catch(() => callback(false));
    }
    else {
        addDoc(collection(db, 'items'), { ...item })
            .then(() => callback(true))
            .catch(() => callback(false));
    }
}

export function deleteRentalItem(id: string | undefined, callback: (isSuccesful: boolean) => void) {
    if (!id) {
        callback(false);
        return;
    }
    deleteDoc(doc(db, 'items', id))
        .then(() => callback(true))
        .catch(() => callback(false));
}
