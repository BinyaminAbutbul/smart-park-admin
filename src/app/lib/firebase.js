import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxDEZZ9CgUK576_Oqam5TJP8IGkjyiN0o",
  authDomain: "smartpark-ca8f4.firebaseapp.com",
  projectId: "smartpark-ca8f4",
  storageBucket: "smartpark-ca8f4.firebasestorage.app",
  messagingSenderId: "1034466379117",
  appId: "1:1034466379117:web:d5cd567e05a02dfd20c664",
  measurementId: "G-EW6C93T9WE"
};

// אתחול המערכת
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { db };
