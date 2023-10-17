import { app } from './firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    User,
} from 'firebase/auth';
import { setUserEmail } from './firestore';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
let onAuthStateChangedListeners: ((user: User | null) => void)[] = [];
let currentUser: User | null = null;

onAuthStateChanged(auth, user => {
    currentUser = user;
    onAuthStateChangedListeners.forEach(listener => listener(user));
    if (user) {
        setUserEmail(user.uid, user.email || '');
    }
});

function addOnAuthStateChangedListener(listener: (user: User | null) => void) {
    onAuthStateChangedListeners.push(listener);
}

function removeOnAuthStateChangedListener(listener: (user: User | null) => void) {
    onAuthStateChangedListeners.filter(l => l !== listener);
}

function getCurrentUser(): User | null {
    return currentUser;
}

function register(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password);
}

function logIn(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password);
}

function logInGoogle(useRedirectInstead: boolean = false) {
    if (useRedirectInstead) {
        signInWithRedirect(auth, googleProvider);
    }
    else {
        signInWithPopup(auth, googleProvider);
    }
}

function logOut() {
    signOut(auth);
}

export {
    addOnAuthStateChangedListener,
    removeOnAuthStateChangedListener,
    getCurrentUser,
    register,
    logIn,
    logInGoogle,
    logOut,
};
