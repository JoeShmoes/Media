
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "bizmaster-ai-ml7xt",
  "appId": "1:1004488839639:web:85aaa91a0137a385b43b92",
  "storageBucket": "bizmaster-ai-ml7xt.firebasestorage.app",
  "apiKey": "AIzaSyANrDr9qysGjm0dYDTZPb5V7TmhsQsMIdo",
  "authDomain": "bizmaster-ai-ml7xt.firebaseapp.com",
  "messagingSenderId": "1004488839639"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn(
        'Firestore persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.'
      );
    } else if (err.code == 'unimplemented') {
      console.warn(
        'Firestore persistence failed: The current browser does not support all of the features required to enable persistence.'
      );
    }
  });
}


export { app, auth, db };
