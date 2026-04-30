"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [carPlate, setCarPlate] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ניהול מצב התחברות ומשיכת נתונים
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUser(data);
          setCarPlate(data?.carPlate || "");
          setLoading(false);
        });
      } else {
        router.push("/login/"); // הפניה לדף התחברות אם לא מחובר
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdatePlate = async () => {
    // בדיקת תקינות קלט
    if (!carPlate || carPlate.trim() === "") {
      toast.error("נא להזין מספר רכב");
      return;
    }

    try {
      const cleanPlate = carPlate.trim();

      // 1. עדכון ב-Firebase (בסיס הנתונים שלך)
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      await update(userRef, {
        carPlate: cleanPlate
      });
      
      toast.success("מספר הרכב עודכן במערכת!");

      // 2. שליחה לשרת החיצוני של איש השרת לפי הפורמט שביקש
      const API_URL = "https://parking-api-vixl2yrebq-uc.a.run.app/api/parking/report";
      
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          },
          body: JSON.stringify({
            car_id: cleanPlate,      // מספר הלוחית
            floor_id: "1",           // קומה ברירת מחדל
            source: "Web-App"        // מקור הדיווח
          }),
        });

        if (response.ok) {
          console.log("הדיווח נחת בהצלחה בשרת החיצוני");
        } else {
          console.warn("השרת החיצוני החזיר שגיאה, אך המידע נשמר ב-Firebase");
        }
      } catch (fetchError) {
        console.error("נכשלה התקשורת עם השרת החיצוני:", fetchError);
      }

    } catch (error) {
      console.error("Update error:", error);
      toast.error("שגיאה בשמירת הנתונים");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-black animate-pulse">
      טוען פרופיל...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black" dir="rtl">
      <Toaster />
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900">שלום, {user?.name || 'אורח'} 👋</h1>
            <p className="text-gray-500 font-bold">נהל את פרטי הרכב שלך לגישה מהירה</p>
          </div>
          <button 
            onClick={() => auth.signOut()} 
            className="text-red-500 font-black text-sm hover:underline p-2"
          >
            התנתק
          </button>
        </header>

        {/* Card: Update Plate */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-black text-gray-700 mr-2">מספר הרכב שלך</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
                placeholder="למשל: 12-345-67"
                className="flex-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-black text-lg text-center font-mono text-black"
              />
              <button 
                onClick={handleUpdatePlate}
                className="bg-blue-600 text-white px-8 py-4 md:py-0 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                עדכן פרטים
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-blue-200 shadow-2xl">
          <h3 className="text-xl font-black mb-2 flex items-center gap-2">
            <span>🛡️</span> סטטוס מנוי פעיל
          </h3>
          <p className="opacity-90 font-bold text-sm leading-relaxed">
            המערכת תזהה את הלוחית שלך באופן אוטומטי בכניסה לחניון. אין צורך להוציא כרטיס או להמתין.
          </p>
        </div>
      </div>
    </div>
  );
}