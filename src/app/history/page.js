"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://parking-api-vixl2yrebq-uc.a.run.app";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // בדיקת חיבור בסיסית
    auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/history`, {
          headers: { 'ngrok-skip-browser-warning': '69420' },
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster />
      <Sidebar />
      <main className="flex-1 p-8 text-black">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">היסטוריית חניות</h1>
          <p className="text-gray-500">יומן כניסות ויציאות מלא של החניון</p>
        </header>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-right">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-5 font-black">לוחית רישוי</th>
                <th className="p-5 font-black">זמן כניסה</th>
                <th className="p-5 font-black">זמן יציאה</th>
                <th className="p-5 font-black">תשלום</th>
                <th className="p-5 font-black">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length > 0 ? history.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-all">
                  <td className="p-5 font-mono font-bold text-lg">{row.plate}</td>
                  <td className="p-5 text-gray-600">{row.entry_time}</td>
                  <td className="p-5 text-gray-600">{row.exit_time || "—"}</td>
                  <td className="p-5 font-bold text-green-600">₪{row.total_price || 0}</td>
                  <td className="p-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black ${
                      row.exit_time ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-600"
                    }`}>
                      {row.exit_time ? "יצא" : "בחניון"}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400 font-bold">טוען נתונים מהשרת...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}