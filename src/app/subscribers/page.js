"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from 'react-hot-toast';

const API_BASE_URL = "https://parking-api-vixl2yrebq-uc.a.run.app";

export default function SubscribersPage() {
  const [subs, setSubs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ plate: "", owner_name: "" });

  // משיכת רשימת המנויים מהשרת
  const fetchSubs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/subscribers`, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
      });
      if (response.ok) {
        const data = await response.json();
        setSubs(data);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  // פונקציית הוספת מנוי חדש ודיווח לשרת ה-Parking
  const handleAddSub = async (e) => {
    e.preventDefault();
    
    if (!newSub.plate || !newSub.owner_name) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    try {
      // 1. הוספת המנוי לרשימת המנויים הכללית
      const response = await fetch(`${API_BASE_URL}/api/admin/subscribers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        body: JSON.stringify(newSub),
      });

      if (response.ok) {
        toast.success("מנוי חדש נוסף למערכת!");
        
        // 2. שליחת דיווח לשרת ה-Parking החדש (לפי בקשת איש השרת)
        // אנחנו שולחים את זה במקביל כדי שהרכב יזוהה מיד במערכת הדוחות
        fetch(`${API_BASE_URL}/api/parking/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            car_id: newSub.plate,
            floor_id: "1",
            source: "Web-App-Admin" // זיהוי שהגיע מהניהול
          }),
        }).catch(err => console.error("דיווח ה-Parking נכשל, אך המנוי נוצר:", err));

        setIsModalOpen(false);
        setNewSub({ plate: "", owner_name: "" });
        fetchSubs(); // רענון הרשימה המוצגת
      } else {
        toast.error("שגיאה בהוספת מנוי בשרת");
      }
    } catch (error) {
      toast.error("חיבור לשרת נכשל");
      console.error("Add sub error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Toaster />
      <Sidebar />
      <main className="flex-1 p-8 text-black">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900">ניהול מנויים</h1>
            <p className="text-gray-500 font-bold">רשימת הרכבים המורשים לכניסה חופשית</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            + הוסף מנוי חדש
          </button>
        </header>

        {/* תצוגת המנויים בכרטיסים מעוצבים */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.length > 0 ? (
            subs.map((sub, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">בעל הרכב</p>
                  <h3 className="text-xl font-black text-gray-900">{sub.owner_name}</h3>
                  <p className="text-blue-600 font-mono font-bold mt-1 tracking-widest text-lg bg-blue-50 px-3 py-1 rounded-lg inline-block">
                    {sub.plate}
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-2xl text-2xl shadow-inner">🚗</div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold italic">טוען מנויים או שאין מנויים רשומים...</p>
            </div>
          )}
        </div>

        {/* Modal הוספת מנוי */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-2xl font-black mb-6 text-gray-900">הוספת מנוי חדש</h2>
              <form onSubmit={handleAddSub} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-gray-400 mr-2 uppercase">לוחית רישוי</label>
                  <input 
                    type="text" required
                    placeholder="00-000-00"
                    value={newSub.plate}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-black"
                    onChange={(e) => setNewSub({...newSub, plate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 mr-2 uppercase">שם בעל הרכב</label>
                  <input 
                    type="text" required
                    placeholder="ישראל ישראלי"
                    value={newSub.owner_name}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-black"
                    onChange={(e) => setNewSub({...newSub, owner_name: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                    שמור מנוי
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-500 p-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}