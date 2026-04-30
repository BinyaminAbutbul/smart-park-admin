"use client";
import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false); // הוספת מצב טעינה
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (loading) return; // מניעת לחיצות כפולות

    setLoading(true);
    try {
      let user;
      
      if (isLogin) {
        // --- התחברות ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        // --- הרשמה ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // שמירת פרטי המשתמש ב-Database
        await set(ref(db, `users/${user.uid}`), {
          name: name,
          email: email,
          role: "user",
          createdAt: new Date().toISOString()
        });
      }

      // --- בדיקת תפקיד וניתוב חכם ---
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.role === "admin") {
          toast.success(`שלום מנהל, ${userData.name || ''}`);
          router.push("/admin"); 
        } else {
          toast.success(`ברוך הבא, ${userData.name || 'משתמש'}`);
          router.push("/profile"); 
        }
      } else {
        // מקרה קצה: המשתמש קיים ב-Auth אבל לא ב-DB (קורה כשיוצרים ידנית ב-Console)
        toast.success("התחברת בהצלחה");
        router.push("/profile");
      }

    } catch (error) {
      console.error(error);
      // תרגום שגיאות נפוצות לעברית
      let errorMessage = "שגיאה לא ידועה";
      if (error.code === 'auth/user-not-found') errorMessage = "משתמש לא קיים";
      if (error.code === 'auth/wrong-password') errorMessage = "סיסמה שגויה";
      if (error.code === 'auth/email-already-in-use') errorMessage = "האימייל כבר בשימוש";
      
      toast.error(errorMessage + " (" + error.message + ")");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-black" dir="rtl">
      <Toaster />
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🅿️</div>
          <h1 className="text-3xl font-black text-gray-900">
            {isLogin ? "כניסה למערכת" : "הרשמה למשתמש חדש"}
          </h1>
          <p className="text-gray-400 mt-2 font-bold italic">SmartPark Security System</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-black mr-2 text-gray-500 uppercase">שם מלא</label>
              <input 
                type="text" placeholder="ישראל ישראלי" required
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-black"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-black mr-2 text-gray-500 uppercase">אימייל</label>
            <input 
              type="email" placeholder="name@company.com" required
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black mr-2 text-gray-500 uppercase">סיסמה</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "מעבד..." : (isLogin ? "התחבר עכשיו" : "צור חשבון חדש")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-black text-sm hover:underline"
          >
            {isLogin ? "עדיין אין לך חשבון? הירשם כאן" : "כבר רשום במערכת? התחבר כאן"}
          </button>
        </div>
      </div>
    </div>
  );
}