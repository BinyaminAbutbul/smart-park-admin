"use client";
import React from 'react';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';

export default function PaymentPage({ params }) {
  const orderId = params.id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 mb-4 mt-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">תשלום מאובטח</h1>
        <p className="text-center text-gray-500 text-sm">הזמנה מספר: #{orderId}</p>
        
        <div className="mt-6 border-t border-b border-gray-100 py-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">שירות חניה חכמה</span>
            <span className="font-semibold text-gray-800">₪45.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-100">
            <span>סה"כ לתשלום</span>
            <span className="text-blue-600">₪45.00</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם בעל הכרטיס</label>
            <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="ישראל ישראלי" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר כרטיס</label>
            <div className="relative">
              <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="**** **** **** ****" />
              <CreditCard className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תוקף</label>
              <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123" />
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-6 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            בצע תשלום מאובטח
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>העסקה מאובטחת בתקן PCI-DSS</span>
        </div>
      </div>
    </div>
  );
}
