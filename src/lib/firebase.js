import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // שינינו מ-database ל-firestore
import { getAuth } from "firebase/auth";

// כאן תדביק את ה-firebaseConfig המדויק שהעתקת מה-General Settings בגוגל
const firebaseConfig = {
  apiKey: "AIzaSy...", // תוודא שזה ה-key שלך
  authDomain: "smart-parking-app-ab59a.firebaseapp.com",
  projectId: "smart-parking-app-ab59a",
  storageBucket: "smart-parking-app-ab59a.firebasestorage.app",
  messagingSenderId: "1075763227942",
  appId: "1:1075763227942:web:...",
  measurementId: "G-..."
};

// אתחול האפליקציה
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// חיבור ל-Firestore (בסיס הנתונים שלך)
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };