"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';
import { auth, db } from "../../lib/firebase";
import { ref, get } from "firebase/database";
import { useRouter } from "next/navigation";

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
  const [recentCars, setRecentCars] = useState([]); // רשימת רכבים אמיתית
  const [graphData, setGraphData] = useState([]); // נתוני גרף אמיתיים
  const router = useRouter();

  // --- Functions ---

  const fetchData = async () => {
    try {
      // משיכת סטטיסטיקה כללית וגרף
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
      });
      
      // משיכת רכבים אחרונים שנכנסו
      const recentRes = await fetch(`${API_BASE_URL}/api/admin/recent-activity`, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setCarCount(statsData.carCount || 0);
        setRevenue(statsData.revenue || 0);
        // אם ה-API מחזיר נתוני גרף, נעדכן אותם. אם לא, נשתמש במבנה ריק עד שיצטברו נתונים.
        setGraphData(statsData.weeklyStats || []); 
      }

      if (recentRes.ok) {
        const recentData = await recentRes.json();
        setRecentCars(recentData.slice(0, 5)); // לוקחים רק את ה-5 האחרונים
      }

      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const handleQuickSearch = async () => {
    if (!searchPlate) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/parking/status/${searchPlate}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedCar(data);
        setIsModalOpen(true);
      } else {
        toast.error("רכב לא נמצא בחניון");
      }
    } catch (error) {
      toast.error("שגיאה בחיפוש");
    }
  };

  const handleOpenGate = () => {
    setIsGateOpen(true);
    toast.success('המחסום נפתח בהצלחה!');
    setTimeout(() => setIsGateOpen(false), 5000);
  };

  // --- Effects ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists() && snapshot.val().role === 'admin') {
        fetchData();
      } else {
        router.push("/login");
      }
    });

    const interval = setInterval(fetchData, 10000); // רענון נתונים כל 10 שניות
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-blue-600 font-black animate-bounce">
        טוען נתונים חיים...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster position="top-left" />
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 text-black">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900">לוח בקרה חי</h1>
            <p className="text-gray-500 mt-1 font-medium">נתונים בזמן אמת מהחניון</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="חיפוש לוחית..." 
              className="bg-gray-100 border-none rounded-2xl px-4 py-2 text-sm font-bold font-mono w-40 focus:ring-2 focus:ring-blue-500"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
            />
            <button onClick={handleQuickSearch} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-700">חפש</button>
            <button onClick={handleOpenGate} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700">פתח מחסום</button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center gap-6">
            <div className="bg-blue-100 p-5 rounded-3xl text-3xl">🚗</div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider">רכבים כרגע</p>
              <h3 className="text-4xl font-black text-gray-900">{carCount}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center gap-6">
            <div className="bg-green-100 p-5 rounded-3xl text-3xl">💰</div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider">הכנסות מצטברות</p>
              <h3 className="text-4xl font-black text-gray-900">₪{revenue}</h3>
            </div>
          </div>
          <div className={`p-8 rounded-[2.5rem] shadow-xl border ${isGateOpen ? 'bg-green-500' : 'bg-white'}`}>
             <div className="flex items-center gap-6">
                <div className="p-5 rounded-3xl text-3xl">{isGateOpen ? '🔓' : '🔒'}</div>
                <h3 className={`text-2xl font-black ${isGateOpen ? 'text-white' : 'text-gray-900'}`}>סטטוס שער</h3>
             </div>
          </div>
        </div>

        {/* Graph & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graph Real Data */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50">
            <h3 className="text-xl font-black text-gray-800 mb-8">סטטיסטיקת הכנסות</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData.length > 0 ? graphData : [{name: 'ממתין לנתונים', הכנסות: 0}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Real Data */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50">
            <h3 className="text-xl font-black text-gray-800 mb-8">פעילות אחרונה</h3>
            <div className="space-y-4">
              {recentCars.length > 0 ? recentCars.map((car, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 font-bold">{car.entry_time || 'נכנס'}</span>
                  <span className="bg-yellow-100 border-2 border-black px-4 py-1 rounded-lg font-black font-mono">
                    {car.plate}
                  </span>
                </div>
              )) : <p className="text-gray-400 text-center">אין פעילות כרגע</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}