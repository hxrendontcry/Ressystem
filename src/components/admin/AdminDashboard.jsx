// src/components/admin/AdminDashboard.jsx
import React from "react";
import {
  Building2,
  DoorOpen,
  Users,
  Clock,
  Wrench,
  AlertTriangle,
  Banknote,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminDashboard = () => {
  const {
    rooms,
    invoices,
    repairs,
    aiAnalyticsSummary,
    setAdminActiveTab,
  } = useApp();

  // 1.3.2.27 Metrics Calculation
  const totalRooms = rooms.length;
  const vacantRooms = rooms.filter((r) => r.status === "available").length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const reservedRooms = rooms.filter((r) => r.status === "reserved").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const pendingRepairs = repairs.filter((r) => r.status === "pending" || r.status === "in_progress");

  // Monthly revenue from paid invoices
  const currentMonthPaidRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, inv) => sum + (inv.receipt?.paidAmount || inv.netTotal), 0);

  return (
    <div className="space-y-6">
      {/* 1.3.2.28 AI Insight Banner on Dashboard */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-amber-300">
                AI ANALYSIS SUMMARY
              </span>
              <span className="text-2xs bg-white/20 px-2 py-0.5 rounded-full text-sky-100">
                วิเคราะห์อัตโนมัติ
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-50 mt-1 leading-relaxed max-w-3xl">
              {aiAnalyticsSummary.generatedInsightText}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAdminActiveTab("ai-insights")}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-sky-700 rounded-xl text-xs font-bold hover:bg-sky-50 transition-colors shadow-xs shrink-0 self-end md:self-center"
        >
          <span>ดูรายละเอียด AI ทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1.3.2.27 Key Statistics Grid (8 Metrics specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. จำนวนห้องทั้งหมด */}
        <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">ห้องทั้งหมด</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl font-bold text-slate-800 mt-2 block">
            {totalRooms} <span className="text-xs font-normal text-slate-400">ห้อง</span>
          </span>
          <span className="text-2xs text-slate-400">100% ความจุอาคาร</span>
        </div>

        {/* 2. ห้องว่าง */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-medium">ห้องว่างพร้อมเช่า</span>
            <DoorOpen className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-emerald-700 mt-2 block">
            {vacantRooms} <span className="text-xs font-normal text-slate-400">ห้อง</span>
          </span>
          <span className="text-2xs text-emerald-600 font-medium">
            อัตราว่าง {( (vacantRooms / totalRooms) * 100 ).toFixed(0)}%
          </span>
        </div>

        {/* 3. ห้องที่มีผู้เช่า (สีแดง) */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-medium">ห้องมีผู้เช่า (Occupied)</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-rose-700 mt-2 block">
            {occupiedRooms} <span className="text-xs font-normal text-slate-400">ห้อง</span>
          </span>
          <span className="text-2xs text-rose-600 font-medium">
            อัตราเข้าพัก {aiAnalyticsSummary.occupancyRate}
          </span>
        </div>

        {/* 4. ห้องรอเข้าพัก (สีส้ม) */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-medium">ห้องรอเข้าพัก (Reserved)</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-amber-700 mt-2 block">
            {reservedRooms} <span className="text-xs font-normal text-slate-400">ห้อง</span>
          </span>
          <span className="text-2xs text-amber-600 font-medium">
            ยืนยันสัญญาแล้ว รอย้ายเข้า
          </span>
        </div>

        {/* 5. ห้องปิดปรับปรุง (สีเทา) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-medium">ปิดปรับปรุง (Maint.)</span>
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-slate-700 mt-2 block">
            {maintenanceRooms} <span className="text-xs font-normal text-slate-400">ห้อง</span>
          </span>
          <span className="text-2xs text-slate-500 font-medium">
            ตัดออกจากห้องว่างชั่วคราว
          </span>
        </div>

        {/* 6. จำนวนรายการค้างชำระ */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-medium">รายการค้างชำระ</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-rose-600 mt-2 block">
            {overdueInvoices.length} <span className="text-xs font-normal text-slate-400">รายการ</span>
          </span>
          <span className="text-2xs text-rose-500 font-medium">ต้องติดตามด่วน</span>
        </div>

        {/* 7. งานแจ้งซ่อมที่ยังไม่เสร็จ */}
        <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-xs font-medium">แจ้งซ่อมรอดำเนินการ</span>
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-slate-800 mt-2 block">
            {pendingRepairs.length} <span className="text-xs font-normal text-slate-400">งาน</span>
          </span>
          <span className="text-2xs text-slate-400">รอช่างเข้าดำเนินการ</span>
        </div>

        {/* 8. รายได้ประจำเดือน */}
        <div className="bg-white rounded-2xl border border-sky-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-medium">รายได้ประจำเดือน</span>
            <Banknote className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-sky-700 mt-2 block">
            ฿{currentMonthPaidRevenue.toLocaleString()}
          </span>
          <span className="text-2xs text-emerald-600 font-medium">
            รับเข้าบัญชีแล้ว (Paid)
          </span>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urgent Actions: Slips waiting for approval */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>สลิปโอนเงินรอตรวจสอบ (Slip Verification)</span>
            </h4>
            <button
              onClick={() => setAdminActiveTab("slips")}
              className="text-xs text-sky-600 hover:underline"
            >
              จัดการทั้งหมด
            </button>
          </div>

          <div className="space-y-2">
            {invoices
              .filter((i) => i.status === "under_review")
              .map((inv) => (
                <div
                  key={inv.invoiceNumber}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">
                      ห้อง {inv.roomNumber} ({inv.tenantName})
                    </span>
                    <p className="text-2xs text-slate-500">
                      ยอด ฿{inv.netTotal.toLocaleString()} • {inv.paymentDetails?.sourceBank}
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminActiveTab("slips")}
                    className="px-3 py-1.5 bg-sky-600 text-white font-medium rounded-lg text-xs hover:bg-sky-700"
                  >
                    ตรวจสลิป
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Urgent Actions: Pending Repairs */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>รายการแจ้งซ่อมเร่งด่วน (Urgent Repairs)</span>
            </h4>
            <button
              onClick={() => setAdminActiveTab("repairs")}
              className="text-xs text-sky-600 hover:underline"
            >
              ดูงานซ่อมทั้งหมด
            </button>
          </div>

          <div className="space-y-2">
            {repairs
              .filter((r) => r.status !== "completed")
              .slice(0, 3)
              .map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800">ห้อง {rep.roomNumber}:</span>
                      <span>{rep.title}</span>
                    </div>
                    <p className="text-2xs text-slate-500">
                      หมวด: {rep.category} • ความเร่งด่วน: <span className="text-rose-600 font-semibold">{rep.urgency}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminActiveTab("repairs")}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 font-medium rounded-lg text-xs hover:bg-slate-300"
                  >
                    จ่ายงานช่าง
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
