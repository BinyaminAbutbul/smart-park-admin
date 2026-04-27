"use client";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("התחברת בהצלחה!");
      router.push("/admin"); 
    } catch (error) {
      toast.error("שגיאה: אימייל או סיסמה לא נכונים");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900" dir="rtl">
      <Toaster />
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4 text-blue-600">🅿️</div>
          <h1 className="text-3xl font-black text-gray-900">כניסת מנהל</h1>
          <p className="text-gray-400 mt-2 font-bold">SmartPark Admin System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mr-2 mb-2">אימייל</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 mr-2 mb-2">סיסמה</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg"
          >
            התחבר למערכת
          </button>
        </form>
      </div>
    </div>
  );
}
