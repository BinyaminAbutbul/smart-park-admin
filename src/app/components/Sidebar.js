"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Settings, LogOut, Car, UserCheck, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "לוח בקרה", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "היסטוריית חניות", href: "/history", icon: <History size={20} /> },
    { name: "מנויים", href: "/subscribers", icon: <UserCheck size={20} /> },
    { name: "ניתוח נתונים", href: "/analytics", icon: <BarChart3 size={20} /> },
    { name: "הגדרות", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col sticky top-0" dir="rtl">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Car size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">SMART PARK</h2>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 pt-6 mt-6">
        <button className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 hover:bg-red-950/20 w-full rounded-xl transition-all duration-200">
          <LogOut size={20} />
          <span className="font-bold">התנתק</span>
        </button>
      </div>
    </aside>
  );
}