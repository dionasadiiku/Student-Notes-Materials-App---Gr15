import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDh38fC4m6s1MzgyGrQMsIkaOQ_VfPnyCE",
  authDomain: "bookmanagmentapp.firebaseapp.com",
  projectId: "bookmanagmentapp",
  storageBucket: "bookmanagmentapp.appspot.com",
  messagingSenderId: "267500899327",
  appId: "1:267500899327:web:db9856ace51f36df5935ca",
  measurementId: "G-Y0NEW2HTNV",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;