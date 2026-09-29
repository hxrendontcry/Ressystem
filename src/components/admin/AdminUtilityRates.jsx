// src/components/admin/AdminUtilityRates.jsx
import React, { useState } from "react";
import { Settings2, Droplet, Zap, Wifi, ShieldAlert, Calendar, Save } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminUtilityRates = () => {
  const { utilityRates, adminUpdateUtilityRates } = useApp();

  const [rates, setRates] = useState({
    waterRate: utilityRates.waterRate,
    electricityRate: utilityRates.electricityRate,
    internetRate: utilityRates.internetRate,
    serviceFee: utilityRates.serviceFee,
    dueDayOfMonth: utilityRates.dueDayOfMonth,
    lateFeePerDay: utilityRates.lateFeePerDay,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    adminUpdateUtilityRates({
      waterRate: Number(rates.waterRate),
      electricityRate: Number(rates.electricityRate),
      internetRate: Number(rates.internetRate),
      serviceFee: Number(rates.serviceFee),
      dueDayOfMonth: Number(rates.dueDayOfMonth),
      lateFeePerDay: Number(rates.lateFeePerDay),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              กำหนดอัตราค่าบริการและการเรียกเก็บเงิน (Utility Rates & Billing Rules)
            </h3>
            <p className="text-xs text-slate-500">
              ตั้งค่าค่าน้ำ ค่าไฟ วันครบกำหนดชำระ และค่าปรับกรณีชำระล่าช้าสำหรับใช้คำนวณบิลรายเดือน
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Water Rate */}
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 space-y-2">
              <div className="flex items-center gap-2 text-sky-800">
                <Droplet className="w-4 h-4 text-sky-600" />
                <label className="text-xs font-bold">อัตราค่าน้ำประปา</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  required
                  value={rates.waterRate}
                  onChange={(e) => setRates({ ...rates, waterRate: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">บาท/หน่วย</span>
              </div>
              <p className="text-2xs text-slate-400">คำนวณจากหน่วยที่ใช้จริงประจำเดือน</p>
            </div>

            {/* Electricity Rate */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-800">
                <Zap className="w-4 h-4 text-amber-600" />
                <label className="text-xs font-bold">อัตราค่าไฟฟ้า</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  required
                  value={rates.electricityRate}
                  onChange={(e) => setRates({ ...rates, electricityRate: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">บาท/หน่วย</span>
              </div>
              <p className="text-2xs text-slate-400">คำนวณจากหน่วยมิเตอร์ไฟแต่ละห้อง</p>
            </div>

            {/* Internet Rate */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <Wifi className="w-4 h-4 text-slate-600" />
                <label className="text-xs font-bold">ค่าอินเทอร์เน็ต</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  value={rates.internetRate}
                  onChange={(e) => setRates({ ...rates, internetRate: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">บาท/เดือน</span>
              </div>
              <p className="text-2xs text-slate-400">อินเทอร์เน็ตความเร็วสูงแยกห้อง</p>
            </div>

            {/* Service Fee */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <Settings2 className="w-4 h-4 text-slate-600" />
                <label className="text-xs font-bold">ค่าบริการส่วนกลาง / ค่าขยะ</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  value={rates.serviceFee}
                  onChange={(e) => setRates({ ...rates, serviceFee: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">บาท/เดือน</span>
              </div>
              <p className="text-2xs text-slate-400">ค่าบำรุงลิฟต์ แม่บ้าน ไฟส่วนกลาง</p>
            </div>

            {/* Due Date */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <label className="text-xs font-bold">วันครบกำหนดชำระของแต่ละเดือน</label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">วันที่</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={rates.dueDayOfMonth}
                  onChange={(e) => setRates({ ...rates, dueDayOfMonth: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">ของทุกเดือน</span>
              </div>
              <p className="text-2xs text-slate-400">ระบบจะแจ้งเตือนล่วงหน้า 3 วัน</p>
            </div>

            {/* Late Fee */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <label className="text-xs font-bold">ค่าปรับกรณีชำระล่าช้า</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  value={rates.lateFeePerDay}
                  onChange={(e) => setRates({ ...rates, lateFeePerDay: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">บาท/วัน</span>
              </div>
              <p className="text-2xs text-slate-400">คำนวณสะสมหลังจากเลยกำหนดชำระ</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกอัตราค่าบริการ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
