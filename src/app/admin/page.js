"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';

// חיבור ל-Firebase
import { db } from "@/lib/firebase";
import { ref, get, onValue } from "firebase/database";

const API_BASE_URL = "https://parking-api-vixl2yrebq-uc.a.run.app";

export default function AdminPage() {
  // --- States ---
  const [carCount, setCarCount] = useState(0); 
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchPlate, setSearchPlate] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [isGateOpen, setIsGateOpen] = useState(false);
  
  // הגדרות מה-Firebase
  const [settings, setSettings] = useState({ pricePerHour: 15, blacklist: [] });

  const weeklyData = [
    { name: 'א', הכנסות: 400 }, { name: 'ב', הכנסות: 700 }, { name: 'ג', הכנסות: 500 },
    { name: 'ד', הכנסות: 1200 }, { name: 'ה', הכנסות: 1850 }, { name: 'ו', הכנסות: 300 }, { name: 'ש', הכנסות: 100 },
  ];

  // --- Functions ---

  // משיכת הגדרות מ-Firebase בזמן אמת
  useEffect(() => {
    const settingsRef = ref(db, 'system/settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettings({
          pricePerHour: data.pricePerHour || 15,
          blacklist: data.blacklist || []
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // פונקציית בדיקת אבטחה מול ה-Blacklist האמיתי מה-DB
  const checkSecurity = (plate) => {
    if (settings.blacklist.includes(plate)) {
      const newAlert = {
        id: Date.now(),
        msg: `רכב חסום זוהה! לוחית: ${plate}`,
        time: new Date().toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 3));
      toast.error(`אבטחה: רכב חסום ${plate} בשער!`, { 
        duration: 8000,
        style: { border: '2px solid #ef4444', padding: '16px', color: '#7f1d1d' }
      });
      return true; // רכב חסום
    }
    return false; // רכב תקין
  };

  const handleQuickSearch = async () => {
    if (!searchPlate) return;
    
    // בדיקת אבטחה ראשונית לפני פנייה לשרת
    const isBlocked = checkSecurity(searchPlate);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/parking/status/${searchPlate}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedCar(data);
        setIsModalOpen(true);
      } else if (!isBlocked) {
        toast.error("רכב לא נמצא בחניון");
      }
    } catch (error) {
      toast.error("שגיאה בתקשורת עם השרת");
    }
  };

  const handleOpenGate = () => {
    setIsGateOpen(true);
    toast.success('המחסום נפתח בהצלחה!');
    setTimeout(() => setIsGateOpen(false), 5000);
  };

  // --- Effects ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { 'ngrok-skip-browser-warning': '69420' },
        });
        if (!response.ok) throw new Error("Server Error");
        const data = await response.json();
        
        setCarCount(data.carCount);
        // חישוב הכנסות לפי המחיר שנקבע ב-Firebase
        setRevenue(data.carCount * settings.pricePerHour);
        
        setLoading(false);
      } catch (error) {
        console.error("Connection failed:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // רענון כל 10 שניות
    return () => clearInterval(interval);
  }, [settings.pricePerHour]); // מתעדכן אם המחיר משתנה

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster position="top-left" />
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-8">
        
        {/* 1. Header עם חיפוש */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900">לוח בקרה</h1>
            <p className="text-gray-500 mt-1 font-medium italic">תעריף נוכחי: ₪{settings.pricePerHour} לשעה</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-50 rounded-2xl p-1.5 border border-gray-200 shadow-inner">
              <input 
                type="text" 
                placeholder="חיפוש לוחית..." 
                className="bg-transparent border-none focus:outline-none px-4 py-2 text-sm font-bold text-black font-mono w-40 text-center"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
              />
              <button onClick={handleQuickSearch} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-700 transition-all">חפש</button>
            </div>

            <button 
              onClick={handleOpenGate}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
            >
              <span>{isGateOpen ? '🔓' : '🔒'}</span>
              <span>פתח מחסום</span>
            </button>
          </div>
        </header>

        {/* 2. התראות אבטחה */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <h3 className="text-red-800 font-black text-xl">אבטחה: רכבים חסומים זוהו</h3>
              </div>
              <button onClick={() => setAlerts([])} className="text-red-400 hover:text-red-700 text-xs font-bold bg-white px-3 py-1 rounded-full shadow-sm">נקה התראות</button>
            </div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border-r-8 border-red-600">
                  <span className="text-red-600 font-black text-lg">{alert.msg}</span>
                  <span className="text-gray-400 text-sm font-mono font-bold bg-gray-50 px-2 py-1 rounded-lg">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. כרטיסי סטטיסטיקה */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 flex items-center gap-6">
            <div className="bg-blue-100 p-5 rounded-3xl text-3xl shadow-inner">🚗</div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider">רכבים בחניון</p>
              <h3 className="text-4xl font-black text-gray-900">{carCount} <span className="text-base text-gray-300 font-normal">/ 100</span></h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 flex items-center gap-6">
            <div className="bg-green-100 p-5 rounded-3xl text-3xl shadow-inner">💰</div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider">הכנסה משוערת</p>
              <h3 className="text-4xl font-black text-green-600">₪{revenue}</h3>
            </div>
          </div>

          <div className={`p-8 rounded-[2.5rem] shadow-xl transition-all duration-500 border ${isGateOpen ? 'bg-green-500 border-green-400 scale-105' : 'bg-white border-gray-50 shadow-gray-200/40'}`}>
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-3xl text-3xl transition-all ${isGateOpen ? 'bg-white rotate-12' : 'bg-orange-100'}`}>
                {isGateOpen ? '🔓' : '🔒'}
              </div>
              <div>
                <p className={`text-xs font-black uppercase tracking-wider ${isGateOpen ? 'text-green-100' : 'text-gray-400'}`}>סטטוס מחסום</p>
                <h3 className={`text-2xl font-black ${isGateOpen ? 'text-white' : 'text-green-500'}`}>
                  {isGateOpen ? 'פתוח כעת' : 'נעול / תקין'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 4. גרף ורכבים אחרונים */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <h3 className="text-xl font-black text-gray-800 mb-8">סיכום הכנסות שבועי</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="הכנסות" fill="#3b82f6" radius={[12, 12, 12, 12]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-800">רכבים אחרונים</h3>
              <span className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-full animate-pulse">LIVE</span>
            </div>
            <div className="space-y-4">
              {[ {p: '12-345-67', t: '11:12'}, {p: '88-999-12', t: '11:05'}, {p: '55-444-33', t: '10:58'} ].map((car, i) => (
                <div key={i} className={`flex justify-between items-center p-5 rounded-[1.5rem] border transition-all group ${settings.blacklist.includes(car.p) ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100 hover:bg-blue-50/50'}`}>
                  <span className="text-gray-400 font-bold text-sm group-hover:text-blue-400">{car.t}</span>
                  <div className="flex items-center gap-3">
                    {settings.blacklist.includes(car.p) && <span className="text-red-500 font-black text-xs">חסום!</span>}
                    <span className={`border-2 px-4 py-1.5 rounded-xl font-black font-mono shadow-sm ${settings.blacklist.includes(car.p) ? 'bg-red-600 text-white border-red-800' : 'bg-yellow-100 text-gray-900 border-gray-800'}`}>
                      {car.p}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Modal חיפוש רכב */}
        {isModalOpen && selectedCar && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className={`${settings.blacklist.includes(selectedCar.plate) ? 'bg-red-600' : 'bg-blue-600'} p-8 text-center relative`}>
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-white/50 hover:text-white font-bold">✕</button>
                <div className="bg-yellow-400 border-4 border-black inline-block px-6 py-2 rounded-xl mb-4 shadow-lg">
                  <span className="text-2xl font-black font-mono text-black">{selectedCar.plate}</span>
                </div>
                <h2 className="text-white text-xl font-black">
                  {settings.blacklist.includes(selectedCar.plate) ? '⚠️ רכב חסום במערכת' : 'פרטי רכב נוכחי'}
                </h2>
              </div>
              <div className="p-8 space-y-6 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold mb-1 mr-1">זמן שהייה</p>
                    <p className="text-lg font-black text-gray-900">{selectedCar.minutes_parked} דקות</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold mb-1 mr-1">לתשלום (לפי ₪{settings.pricePerHour})</p>
                    <p className="text-lg font-black text-green-600">₪{Math.ceil(selectedCar.minutes_parked / 60 * settings.pricePerHour)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { handleOpenGate(); setIsModalOpen(false); }}
                  className={`w-full p-4 rounded-2xl font-black transition-all ${settings.blacklist.includes(selectedCar.plate) ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'} text-white`}
                >
                  {settings.blacklist.includes(selectedCar.plate) ? 'פתח מחסום למרות החסימה' : 'פתח מחסום לרכב זה'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
