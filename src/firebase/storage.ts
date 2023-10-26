import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "./firebase";
import dayjs from "dayjs";

const storage = getStorage(app);

export function uploadImage(file: File | null | undefined, callback: (url: string) => void) {
    const path = `images/${dayjs().format("YYYY-MM-DDTHH:mm:ss")}_${file?.name}`;
    console.log(`Uploading image to ${path}`);
    const fileRef = ref(storage, path);
    uploadBytes(fileRef, file as Blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            callback(url);
        });
    });
}