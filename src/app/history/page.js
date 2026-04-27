"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

// הכתובת המעודכנת של השרת
const API_BASE_URL = "https://scarce-blah-hungrily.ngrok-free.dev";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // פונקציה למשיכת נתונים מהשרת
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/history`, {
        headers: { 
          "ngrok-skip-browser-warning": "69420",
          "Accept": "application/json"
        }
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      // נתוני דמו לגיבוי במידה והשרת לא זמין
      setHistory([
        { id: 1, plate: "12-345-67", entry: "20/04 08:30", exit: "20/04 10:15", duration: "1:45 שעות", amount: 45, status: "שולם" },
        { id: 2, plate: "88-999-12", entry: "20/04 09:00", exit: "20/04 09:45", duration: "45 דקות", amount: 20, status: "שולם" },
        { id: 3, plate: "55-444-33", entry: "20/04 11:20", exit: "---", duration: "בפעילות", amount: 0, status: "בחניון" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000); // עדכון כל 30 שניות
    return () => clearInterval(interval);
  }, []);

  // לוגיקת הסינון (פותר את ה-ReferenceError)
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.plate?.toString().includes(searchTerm);
    const matchesFilter = filterStatus === "הכל" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* תפריט צד */}
      <Sidebar />

      {/* תוכן מרכזי */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900">ניהול היסטוריה</h1>
            <p className="text-gray-500 mt-2">מעקב כניסות ויציאות בזמן אמת</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 min-w-[120px] text-center">
            <span className="text-gray-400 text-xs block mb-1">רשומות שנמצאו</span>
            <span className="text-2xl font-bold text-blue-600">{filteredHistory.length}</span>
          </div>
        </header>

        {/* סרגל כלים: חיפוש וסינון */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-100">
          <div className="flex-1 min-w-[250px]">
            <input 
              type="text" 
              placeholder="חפש מספר רכב..." 
              // כאן הוספנו text-black ו-font-bold כדי שהחיפוש יהיה כהה וברור
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-mono text-black font-bold placeholder-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="p-3 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-700 cursor-pointer"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="הכל">כל הסטטוסים</option>
            <option value="שולם">שולם</option>
            <option value="בחניון">בחניון (פעיל)</option>
          </select>
        </div>

        {/* טבלת הנתונים */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 font-bold">
                <th className="py-5 px-6">מספר רכב</th>
                <th className="py-5 px-6">כניסה</th>
                <th className="py-5 px-6">יציאה</th>
                <th className="py-5 px-6">משך שהייה</th>
                <th className="py-5 px-6">סכום</th>
                <th className="py-5 px-6 text-center">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-5 px-6">
                    <span className="bg-yellow-100 border-2 border-gray-800 px-3 py-1 rounded-md text-gray-900 font-black font-mono shadow-sm">
                      {item.plate}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-gray-700 text-sm">{item.entry}</td>
                  <td className="py-5 px-6 text-gray-700 text-sm">{item.exit}</td>
                  <td className="py-5 px-6 text-gray-500 text-sm">{item.duration}</td>
                  <td className="py-5 px-6 font-black text-gray-900">₪{item.amount}</td>
                  <td className="py-5 px-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${
                      item.status === "שולם" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredHistory.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-400 font-bold">
              לא נמצאו תוצאות לחיפוש שלך...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}