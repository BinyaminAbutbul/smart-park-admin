"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';
import { Save, ShieldAlert, BadgeDollarSign, BellRing } from "lucide-react";

export default function SettingsPage() {
  const [hourlyRate, setHourlyRate] = useState(20);
  const [isParkingOpen, setIsParkingOpen] = useState(true);
  const [blacklist, setBlacklist] = useState(["12-345-67", "99-888-77"]);
  const [newBlacklistPlate, setNewBlacklistPlate] = useState("");

  const handleSaveSettings = () => {
    toast.success("ההגדרות נשמרו בהצלחה!");
  };

  const addToBlacklist = () => {
    if (!newBlacklistPlate) return;
    setBlacklist([...blacklist, newBlacklistPlate]);
    setNewBlacklistPlate("");
    toast.error("רכב נוסף לרשימה השחורה");
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster position="top-left" />
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-8">
        <header>
          <h1 className="text-4xl font-black text-gray-900">הגדרות מערכת</h1>
          <p className="text-gray-500 mt-2 font-medium">ניהול תעריפים, אבטחה והרשאות חניון</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* כרטיס תעריפים */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><BadgeDollarSign size={24} /></div>
              <h3 className="text-xl font-black text-gray-800">תעריפי חניה</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 mr-1">מחיר לשעה (₪)</label>
                <input 
                  type="number" 
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-black text-xl"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                <div>
                  <p className="font-bold text-blue-900">סטטוס חניון פעיל</p>
                  <p className="text-xs text-blue-700">כשהחניון סגור, המחסום לא ייפתח אוטומטית</p>
                </div>
                <button 
                  onClick={() => setIsParkingOpen(!isParkingOpen)}
                  className={`w-14 h-8 rounded-full transition-all relative ${isParkingOpen ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isParkingOpen ? 'left-1' : 'left-7'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* כרטיס רשימה שחורה */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-red-100 p-3 rounded-2xl text-red-600"><ShieldAlert size={24} /></div>
              <h3 className="text-xl font-black text-gray-800">רשימה שחורה (חסימת רכבים)</h3>
            </div>

            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="מספר רכב לחסימה..."
                value={newBlacklistPlate}
                onChange={(e) => setNewBlacklistPlate(e.target.value)}
                className="flex-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
              />
              <button onClick={addToBlacklist} className="bg-red-600 text-white px-6 rounded-2xl font-black hover:bg-red-700 transition-all">
                חסום
              </button>
            </div>

            <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
              {blacklist.map((plate, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="font-mono font-black text-red-700">{plate}</span>
                  <button onClick={() => setBlacklist(blacklist.filter(p => p !== plate))} className="text-red-300 hover:text-red-600 font-bold text-xs">הסר</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* כפתור שמירה כללי */}
        <div className="flex justify-end">
          <button 
            onClick={handleSaveSettings}
            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl"
          >
            <Save size={20} />
            שמור את כל השינויים
          </button>
        </div>
      </main>
    </div>
  );
}