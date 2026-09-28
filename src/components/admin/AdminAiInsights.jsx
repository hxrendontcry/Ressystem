// src/components/admin/AdminAiInsights.jsx
import React, { useState } from "react";
import {
  Sparkles,
  Wrench,
  Zap,
  Droplet,
  Users,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminAiInsights = () => {
  const { aiAnalyticsSummary, showToast } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("เดือนปัจจุบัน (กันยายน 2569)");

  const handleRefreshAnalysis = () => {
    setIsRefreshing(true);
    showToast("AI กำลังดึงข้อมูลล่าสุดและประมวลผลการวิเคราะห์...", "info");
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("อัปเดตบทวิเคราะห์ AI สำเร็จแล้ว", "success");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                AI Analytics & Smart Insights (ระบบวิเคราะห์อัจฉริยะ)
              </h3>
              <p className="text-xs text-slate-500">
                ประมวลผลสถิติหอพักอัตโนมัติ เพื่อสนับสนุนการตัดสินใจของผู้บริหาร
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="เดือนปัจจุบัน (กันยายน 2569)">เดือนปัจจุบัน (ก.ย. 69)</option>
            <option value="ไตรมาส 3 (ก.ค. - ก.ย. 69)">ไตรมาส 3 (ก.ค. - ก.ย. 69)</option>
            <option value="ย้อนหลัง 6 เดือน">ย้อนหลัง 6 เดือน</option>
          </select>
          <button
            onClick={handleRefreshAnalysis}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>คำนวณใหม่</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars of 1.3.2.28 AI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. สรุปประเภทการแจ้งซ่อมที่พบมากที่สุด */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                1. ปัญหาแจ้งซ่อมที่พบบ่อยที่สุด
              </h4>
            </div>
            <span className="text-2xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">
              Top Categories
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-100">
              <span className="text-xs text-sky-800 font-bold block mb-1">
                {aiAnalyticsSummary.topRepairCategory}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                จากข้อมูลแจ้งซ่อมย้อนหลัง 3 เดือน มีการแจ้งปัญหาเกี่ยวกับเครื่องปรับอากาศ (แอร์ไม่เย็น/น้ำหยด) รวม 5 ครั้ง และระบบไฟฟ้า 3 ครั้ง
              </p>
            </div>
            <div className="flex items-center gap-2 text-2xs text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>ข้อเสนอแนะ AI: แนะนำทำสัญญาบริการล้างแอร์เหมาอาคารปีละ 2 ครั้งเพื่อลดต้นทุน</span>
            </div>
          </div>
        </div>

        {/* 2. สรุปการเปลี่ยนแปลงของการใช้น้ำและไฟฟ้า */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                2. แนวโน้มการใช้น้ำประปาและไฟฟ้า
              </h4>
            </div>
            <span className="text-2xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              Utility Trends
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">ไฟฟ้า +12.4%</span>
                <span className="text-slate-300">|</span>
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">น้ำประปา -4.1%</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {aiAnalyticsSummary.waterElectricTrend}
              </p>
            </div>
            <div className="flex items-center gap-2 text-2xs text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>ข้อเสนอแนะ AI: มิเตอร์ห้อง 201 เพิ่มขึ้นผิดปกติ +25% แนะนำตรวจสอบการทำงานของคอมเพรสเซอร์</span>
            </div>
          </div>
        </div>

        {/* 3. สรุปจำนวนผู้เช่าที่ค้างชำระและการเปลี่ยนแปลง */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                3. ผู้เช่าค้างชำระและการเปลี่ยนแปลง
              </h4>
            </div>
            <span className="text-2xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
              Overdue Aging
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100">
              <span className="text-xs text-rose-800 font-bold block mb-1">
                คงค้าง {aiAnalyticsSummary.overdueTenantsCount} รายการ (ปรับตัวลดลงจากเดือนก่อน 1 ราย)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {aiAnalyticsSummary.overdueTrend} ระบบได้ทำการส่ง LINE Reminder ไปแล้ว 2 ครั้ง
              </p>
            </div>
            <div className="flex items-center gap-2 text-2xs text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>ข้อเสนอแนะ AI: แนะนำให้โทรติดตามตรงหรือแจ้งเตือนตัดสัญญาณอินเทอร์เน็ตตามข้อตกลงสัญญา</span>
            </div>
          </div>
        </div>

        {/* 4. สรุปอัตราการเข้าพักของหอพัก */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                4. อัตราการเข้าพัก (Occupancy Rate)
              </h4>
            </div>
            <span className="text-2xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
              Occupancy
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100">
              <span className="text-lg font-bold text-emerald-700 block mb-0.5">
                อัตราการเข้าพัก: {aiAnalyticsSummary.occupancyRate}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {aiAnalyticsSummary.occupancyDetail}
              </p>
            </div>
            <div className="flex items-center gap-2 text-2xs text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>ข้อเสนอแนะ AI: ห้อง 102 ว่างอยู่ สามารถยิงโฆษณาในกลุ่ม Facebook มหาวิทยาลัยใกล้เคียงได้ทันที</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
