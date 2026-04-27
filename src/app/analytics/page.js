"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Clock, DollarSign, Download } from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7_days");

  // נתוני דמו לגרפים
  const revenueData = [
    { name: 'א', הכנסות: 4200, רכבים: 120 },
    { name: 'ב', הכנסות: 3800, רכבים: 110 },
    { name: 'ג', הכנסות: 5100, רכבים: 145 },
    { name: 'ד', הכנסות: 4900, רכבים: 130 },
    { name: 'ה', הכנסות: 6200, רכבים: 180 },
    { name: 'ו', הכנסות: 2500, רכבים: 60 },
    { name: 'ש', הכנסות: 1200, רכבים: 35 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900">ניתוח נתונים ותובנות</h1>
            <p className="text-gray-500 mt-2 font-medium">סקירה מעמיקה של ביצועי החניון והכנסות</p>
          </div>
          
          <div className="flex gap-4">
            <select 
              className="bg-white border-none p-3 rounded-2xl font-bold text-black shadow-sm outline-none cursor-pointer"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7_days">7 ימים אחרונים</option>
              <option value="30_days">30 יום אחרונים</option>
              <option value="year">שנה נוכחית</option>
            </select>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-black transition-all">
              <Download size={18} />
              ייצוא דוח PDF
            </button>
          </div>
        </header>

        {/* כרטיסי סיכום בכיר */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "סה״כ הכנסות", value: "₪27,900", icon: <DollarSign />, color: "text-green-600", bg: "bg-green-50" },
            { label: "ממוצע יומי", value: "₪3,985", icon: <TrendingUp />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "זמן חניה ממוצע", value: "142 דק׳", icon: <Clock />, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "לקוחות חוזרים", value: "24%", icon: <Users />, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-50">
              <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <p className="text-gray-400 text-xs font-black uppercase mb-1">{item.label}</p>
              <h3 className={`text-2xl font-black text-black`}>{item.value}</h3>
            </div>
          ))}
        </div>

        {/* גרפים מרכזיים */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* גרף הכנסות משולב */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <h3 className="text-xl font-black text-black mb-8">הכנסות מול כמות רכבים</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000', fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="הכנסות" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* שעות עומס חזויות */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <h3 className="text-xl font-black text-black mb-8">תפוסת חניון לפי שעות (ממוצע)</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {h: '08:00', v: 45}, {h: '10:00', v: 85}, {h: '12:00', v: 95}, 
                  {h: '14:00', v: 70}, {h: '16:00', v: 90}, {h: '18:00', v: 50}, {h: '20:00', v: 20}
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fill: '#000', fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px'}} />
                  <Bar dataKey="v" fill="#1e293b" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* טבלת "מנויים הכי פעילים" */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50">
          <h3 className="text-xl font-black text-black mb-6">מנויים הכי פעילים החודש</h3>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-right">
              <thead className="bg-gray-50">
                <tr className="text-gray-400 text-xs font-black uppercase">
                  <th className="p-4">שם מנוי</th>
                  <th className="p-4">מספר כניסות</th>
                  <th className="p-4">זמן מצטבר</th>
                  <th className="p-4">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { n: "ישראל ישראלי", c: 24, t: "48 שעות", s: "VIP" },
                  { n: "חברת אלביט", c: 156, t: "320 שעות", s: "תאגיד" },
                  { n: "אבי לוי", c: 12, t: "18 שעות", s: "רגיל" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-black">{row.n}</td>
                    <td className="p-4 font-black text-blue-600">{row.c}</td>
                    <td className="p-4 font-bold text-black">{row.t}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-black text-black">{row.s}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}