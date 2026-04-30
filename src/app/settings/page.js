"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';
import { auth, db } from "../../lib/firebase";
import { ref, get, update } from "firebase/database";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [hourlyRate, setHourlyRate] = useState(20);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push("/login");
          return;
        }
        
        // משיכת נתוני מנהל מה-Database
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAdminName(data.name || "");
          // נניח שיש לנו שדה הגדרות כלליות ב-DB
          setHourlyRate(data.hourlyRate || 20);
        }
        setLoading(false);
      });
    };
    fetchSettings();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await update(ref(db, `users/${user.uid}`), {
          name: adminName,
          hourlyRate: hourlyRate
        });
        toast.success("ההגדרות נשמרו בהצלחה!");
      }
    } catch (error) {
      toast.error("שגיאה בשמירה: " + error.message);
    }
  };

  if (loading) return <div className="p-10 text-center font-black">טוען הגדרות...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster />
      <Sidebar />
      <main className="flex-1 p-8 text-black">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">הגדרות מערכת</h1>
          <p className="text-gray-500">ניהול פרמטרים ופרטי מנהל</p>
        </header>

        <div className="max-w-2xl bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* הגדרות פרופיל */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-gray-800 border-b pb-2">פרופיל מנהל</h3>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 mr-2">שם מלא</label>
                <input 
                  type="text" 
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                />
              </div>
            </div>

            {/* הגדרות חניון */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-gray-800 border-b pb-2">תעריפי חניון</h3>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 mr-2">מחיר לשעה (₪)</label>
                <input 
                  type="number" 
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg active:scale-95">
              שמור שינויים
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}