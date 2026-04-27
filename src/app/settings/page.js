"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, set, onValue } from "firebase/database";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [price, setPrice] = useState(15);
  const [blacklist, setBlacklist] = useState("");
  const [loading, setLoading] = useState(true);

  // משיכת נתונים קיימים מה-Firebase ברגע שהדף נטען
  useEffect(() => {
    const settingsRef = ref(db, 'system/settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPrice(data.pricePerHour || 15);
        // הפיכת המערך חזרה לטקסט מופרד בפסיקים לצורך התצוגה
        setBlacklist(data.blacklist ? data.blacklist.join(", ") : "");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      // הפיכת הטקסט של הרשימה השחורה למערך (Array) של לוחית רישוי
      const blacklistArray = blacklist
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");
      
      // שמירה ב-Realtime Database
      await set(ref(db, 'system/settings'), {
        pricePerHour: Number(price),
        blacklist: blacklistArray,
        lastUpdated: new Date().toISOString()
      });
      
      toast.success("ההגדרות נשמרו בהצלחה בשרת!");
    } catch (error) {
      toast.error("שגיאה בשמירת הנתונים: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster position="top-left" />
      <Sidebar />
      
      <main className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900">הגדרות מערכת</h1>
          <p className="text-gray-500 mt-2 font-medium">ניהול תעריפים ואבטחת חניון</p>
        </header>
        
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 max-w-2xl border border-gray-100">
          <div className="space-y-8">
            
            {/* הגדרת מחיר */}
            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-700 mr-2 uppercase tracking-wide">
                מחיר לשעת חניה (₪)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-4 flex items-center text-gray-400 font-bold">₪</span>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-4 pr-10 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-black text-lg text-gray-900"
                />
              </div>
            </div>

            {/* רשימה שחורה */}
            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-700 mr-2 uppercase tracking-wide">
                רשימה שחורה (לוחיות חסומות)
              </label>
              <textarea 
                value={blacklist}
                onChange={(e) => setBlacklist(e.target.value)}
                placeholder="למשל: 12-345-67, 88-999-00"
                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-red-400 focus:bg-white transition-all outline-none font-bold text-gray-700 h-40 resize-none"
              />
              <p className="text-xs text-gray-400 mr-2">* הפרד לוחיות רישוי באמצעות פסיק (,)</p>
            </div>

            {/* כפתור שמירה */}
            <button 
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <span>💾</span>
              שמור שינויים ב-Firebase
            </button>
            
          </div>
        </div>
      </main>
    </div>
  );
}
