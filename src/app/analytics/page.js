"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://parking-api-vixl2yrebq-uc.a.run.app";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { 'ngrok-skip-browser-warning': '69420' },
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
        setLoading(false);
      } catch (error) {
        console.error("Analytics fetch error:", error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-black">
      מנתח נתונים מהחניון...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-8 text-black overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">ניתוח נתונים</h1>
          <p className="text-gray-500">תובנות בזמן אמת על בסיס {data?.carCount || 0} רכבים</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* גרף הכנסות - נתונים אמיתיים */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black mb-6 text-gray-800">מגמת הכנסות (₪)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.weeklyStats || []}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* פילוח תפוסה - נתונים אמיתיים */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black mb-6 text-gray-800">תפוסת חניון</h3>
            <div className="h-[300px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'תפוס', value: data?.carCount || 0 },
                      { name: 'פנוי', value: 100 - (data?.carCount || 0) },
                    ]}
                    innerRadius={80}
                    outerRadius={110}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f3f4f6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-blue-600">{data?.carCount || 0}</span>
                <span className="text-gray-400 text-xs font-bold uppercase">רכבים</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}