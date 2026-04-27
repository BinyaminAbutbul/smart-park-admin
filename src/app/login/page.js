"use client";
import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // התחברות
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("ברוך הבא!");
      } else {
        // הרשמה
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // שמירת פרטי המשתמש ב-Database עם תפקיד ברירת מחדל
        await set(ref(db, `users/${user.uid}`), {
          name: name,
          email: email,
          role: "user", // כולם נרשמים כמשתמשים רגילים
          createdAt: new Date().toISOString()
        });
        toast.success("החשבון נוצר בהצלחה!");
      }
      router.push("/dashboard"); 
    } catch (error) {
      toast.error("שגיאה: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-black" dir="rtl">
      <Toaster />
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black">{isLogin ? "כניסה למערכת" : "הרשמה למשתמש חדש"}</h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="שם מלא" required
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input 
            type="email" placeholder="אימייל" required
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="סיסמה" required
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black">
            {isLogin ? "התחבר" : "צור חשבון"}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-blue-600 font-bold text-sm"
        >
          {isLogin ? "אין לך חשבון? הירשם כאן" : "כבר רשום? התחבר כאן"}
        </button>
      </div>
    </div>
  );
}
