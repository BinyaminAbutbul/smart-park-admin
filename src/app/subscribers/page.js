"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';
import { UserCheck, UserPlus, Trash2, AlertTriangle } from "lucide-react";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([
    { id: 1, name: "ישראל ישראלי", plate: "11-222-33", type: "VIP", addedDate: "01/01/2026" },
    { id: 2, name: "משה כהן", plate: "88-777-66", type: "עובד", addedDate: "15/02/2026" },
  ]);

  const [newSub, setNewSub] = useState({ name: "", plate: "", type: "מנוי רגיל" });
  
  // States עבור מודאל האישור
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);

  const addSubscriber = () => {
    if (!newSub.name || !newSub.plate) return toast.error("נא למלא את כל השדות");
    setSubscribers([...subscribers, { ...newSub, id: Date.now(), addedDate: new Date().toLocaleDateString('he-IL') }]);
    setNewSub({ name: "", plate: "", type: "מנוי רגיל" });
    toast.success("מנוי חדש נוסף למערכת!");
  };

  // פונקציה שפותחת את המודאל
  const confirmDelete = (sub) => {
    setSubscriberToDelete(sub);
    setIsDeleteModalOpen(true);
  };

  // פונקציית המחיקה הסופית
  const handleFinalDelete = () => {
    setSubscribers(subscribers.filter(s => s.id !== subscriberToDelete.id));
    setIsDeleteModalOpen(false);
    setSubscriberToDelete(null);
    toast.error("המנוי הוסר מהמערכת");
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster position="top-left" />
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900">ניהול מנויים</h1>
            <p className="text-gray-500 mt-2 font-medium">רכבים המורשים לכניסה אוטומטית ללא תשלום</p>
          </div>
          <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200">
            <UserCheck size={20} />
            <span>{subscribers.length} מנויים פעילים</span>
          </div>
        </header>

        {/* טופס הוספת מנוי - שדות כהים כפי שביקשת */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={24} /> הוספת מנוי חדש
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="שם המנוי" 
              className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-black font-bold placeholder-gray-400 outline-none"
              value={newSub.name} 
              onChange={(e) => setNewSub({...newSub, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="מספר רכב" 
              className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-black font-black font-mono placeholder-gray-400 outline-none"
              value={newSub.plate} 
              onChange={(e) => setNewSub({...newSub, plate: e.target.value})}
            />
            <select 
              className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-black font-bold cursor-pointer outline-none"
              value={newSub.type} 
              onChange={(e) => setNewSub({...newSub, type: e.target.value})}
            >
              <option value="מנוי רגיל">מנוי רגיל</option>
              <option value="VIP">VIP</option>
              <option value="עובד">עובד</option>
            </select>
            <button 
              onClick={addSubscriber} 
              className="bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              הוסף מנוי
            </button>
          </div>
        </div>

        {/* טבלת מנויים */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden text-black font-bold">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="p-6">שם המנוי</th>
                <th className="p-6">מספר לוחית</th>
                <th className="p-6">סוג מנוי</th>
                <th className="p-6 text-center border-none">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors group border-none">
                  <td className="p-6 font-bold text-gray-900">{sub.name}</td>
                  <td className="p-6">
                    <span className="bg-yellow-100 border-2 border-gray-800 px-4 py-1.5 rounded-xl font-mono font-black text-gray-900 shadow-sm inline-block">
                      {sub.plate}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${
                      sub.type === 'VIP' 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {sub.type}
                    </span>
                  </td>
                  <td className="p-6 text-center border-none">
                    <button 
                      onClick={() => confirmDelete(sub)} 
                      className="text-gray-300 hover:text-red-600 transition-all p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- מודאל אימות מחיקה --- */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-8 text-center">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">האם אתה בטוח?</h2>
                <p className="text-gray-500 font-medium mb-8">
                  אתה עומד למחוק את המנוי של <span className="text-black font-bold underline">{subscriberToDelete?.name}</span>. פעולה זו אינה ניתנת לביטול.
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
                  >
                    ביטול
                  </button>
                  <button 
                    onClick={handleFinalDelete}
                    className="flex-1 bg-red-600 text-white p-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    כן, מחק
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}