import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7aLzbBShHZaYuwM8cFnp3ELc_aeOJTaI",
  authDomain: "smart-parking-app-ab59a.firebaseapp.com",
  databaseURL: "https://smartpark-ca8f4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "smart-parking-app-ab59a",
  storageBucket: "smart-parking-app-ab59a.firebasestorage.app",
  messagingSenderId: "1075763227942",
  appId: "1:1075763227942:web:caaf8b4a6aa47c52d7e5e7",
  measurementId: "G-6SDHCP6YGC"
};

// אתחול המערכת
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
