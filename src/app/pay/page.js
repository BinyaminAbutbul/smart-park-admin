"use client";
import { useState } from "react";

// כתובת השרת המעודכנת של חבר שלך
const API_BASE_URL = "https://scarce-blah-hungrily.ngrok-free.dev";

export default function PayPage() {
  const [plate, setPlate] = useState("");
  const [parkingData, setParkingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!plate) return alert("נא להזין מספר רכב");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/parking/status/${plate}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (!response.ok) throw new Error("רכב לא נמצא");
      const data = await response.json();
      setParkingData(data);
    } catch (error) {
      alert("שגיאה: לא הצלחנו למצוא את הרכב או שהשרת לא זמין");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-right" dir="rtl">
      {/* לוגו / כותרת */}
      <header className="w-full max-w-md mb-8 text-center">
        <div className="inline-block bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
          <span className="text-2xl">🚗</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">תשלום מהיר</h1>
        <p className="text-slate-500 font-medium">הכנס מספר רכב כדי לראות את הסכום</p>
      </header>

      <main className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
        {!parkingData ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 mr-1">מספר לוחית רישוי</label>
              <input 
                type="text" 
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="00-000-00"
                // כאן הגדרנו טקסט שחור בולט (text-black font-black)
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none text-center text-3xl font-black tracking-widest text-black transition-all"
              />
            </div>
            <button 
              onClick={checkStatus}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              {loading ? "מעבד נתונים..." : "הצג סכום לתשלום"}
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl">
              <p className="text-blue-600 font-bold mb-1">סכום סופי</p>
              <p className="text-6xl font-black text-slate-900">₪{parkingData.total_price}</p>
            </div>
            
            <div className="space-y-3 text-right bg-slate-50 p-5 rounded-2xl">
              <div className="flex justify-between">
                <span className="font-black text-slate-900">{parkingData.plate}</span>
                <span className="text-slate-500 font-bold">מספר רכב</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-black text-slate-900">{parkingData.minutes_parked} דקות</span>
                <span className="text-slate-500 font-bold">זמן חניה</span>
              </div>
            </div>

            <button className="w-full bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl font-black text-xl shadow-xl shadow-green-100 active:scale-95 transition-all">
              שלם עכשיו
            </button>
            
            <button 
              onClick={() => setParkingData(null)} 
              className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              חזרה לחיפוש
            </button>
          </div>
        )}
      </main>

      <footer className="mt-10 text-slate-400 text-sm font-medium">
        © 2026 SmartPark - חניון מרכז העיר
      </footer>
    </div>
  );
}