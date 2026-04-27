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
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdatePlate = async () => {
    try {
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        carPlate: carPlate
      });
      toast.success("מספר הרכב עודכן בהצלחה!");
    } catch (error) {
      toast.error("שגיאה בעדכון הפרטים");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-black">טוען פרופיל...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black" dir="rtl">
      <Toaster />
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-black text-gray-900">שלום, {user?.name} 👋</h1>
          <p className="text-gray-500 font-bold">כאן תוכל לנהל את פרטי הרכב והחניות שלך</p>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-black text-gray-700 mr-2">מספר הרכב שלך</label>
            <div className="flex gap-4">
               <input 
                type="text" 
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
                placeholder="למשל: 12-345-67"
                className="flex-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-black text-lg text-center font-mono"
              />
              <button 
                onClick={handleUpdatePlate}
                className="bg-blue-600 text-white px-8 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg"
              >
                עדכן
              </button>
            </div>
          </div>
        </div>

        {/* כאן בעתיד נוסיף את טבלת היסטוריית החניות */}
        <div className="bg-gray-100 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-400 font-bold italic">היסטוריית חניות תופיע כאן בקרוב...</p>
        </div>
      </div>
    </div>
  );
}
