// src/components/admin/AdminPortal.jsx
import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Users,
  FileText,
  Gauge,
  Receipt,
  ShieldCheck,
  History,
  Wrench,
  Banknote,
  Megaphone,
  Settings2,
  MessageCircle,
  FileSpreadsheet,
  Lock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AdminDashboard } from "./AdminDashboard";
import { AdminAiInsights } from "./AdminAiInsights";
import { AdminRoomManagement } from "./AdminRoomManagement";
import { AdminTenantManagement } from "./AdminTenantManagement";
import { AdminContractManagement } from "./AdminContractManagement";
import { AdminMeterRecording } from "./AdminMeterRecording";
import { AdminInvoiceBilling } from "./AdminInvoiceBilling";
import { AdminSlipVerification } from "./AdminSlipVerification";
import { AdminPaymentHistory } from "./AdminPaymentHistory";
import { AdminRepairManagement } from "./AdminRepairManagement";
import { AdminDepositManagement } from "./AdminDepositManagement";
import { AdminAnnouncements } from "./AdminAnnouncements";
import { AdminUtilityRates } from "./AdminUtilityRates";
import { AdminLineOAChat } from "./AdminLineOAChat";
import { AdminReportsExport } from "./AdminReportsExport";

export const AdminPortal = () => {
  const { adminActiveTab, setAdminActiveTab } = useApp();

  const navGroups = [
    {
      groupTitle: "ภาพรวม & AI",
      items: [
        { id: "dashboard", label: "Dashboard ภาพรวม", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "ai-insights", label: "AI สรุปข้อมูลวิเคราะห์", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
      ],
    },
    {
      groupTitle: "การจัดการหอพัก",
      items: [
        { id: "rooms", label: "ข้อมูลห้องพัก", icon: <Building2 className="w-4 h-4" /> },
        { id: "tenants", label: "ทะเบียนผู้เช่า", icon: <Users className="w-4 h-4" /> },
        { id: "contracts", label: "สัญญาเช่า / คำขอ", icon: <FileText className="w-4 h-4" /> },
        { id: "repairs", label: "รายการแจ้งซ่อม", icon: <Wrench className="w-4 h-4" /> },
        { id: "announcements", label: "ประกาศข่าวสาร", icon: <Megaphone className="w-4 h-4" /> },
      ],
    },
    {
      groupTitle: "การเงิน & บิล",
      items: [
        { id: "meters", label: "จดมิเตอร์น้ำ-ไฟ", icon: <Gauge className="w-4 h-4" /> },
        { id: "billing", label: "ออกใบแจ้งหนี้", icon: <Receipt className="w-4 h-4" /> },
        { id: "slips", label: "ตรวจสลิป / ใบเสร็จ", icon: <ShieldCheck className="w-4 h-4" /> },
        { id: "payments", label: "ประวัติชำระ / ค้างจ่าย", icon: <History className="w-4 h-4" /> },
        { id: "deposits", label: "คืนเงินประกัน", icon: <Banknote className="w-4 h-4" /> },
        { id: "rates", label: "อัตราค่าบริการ", icon: <Settings2 className="w-4 h-4" /> },
      ],
    },
    {
      groupTitle: "สื่อสาร & รายงาน",
      items: [
        { id: "line-oa", label: "แชท LINE OA", icon: <MessageCircle className="w-4 h-4 text-emerald-600" /> },
        { id: "reports", label: "ส่งออกรายงาน Excel/PDF", icon: <FileSpreadsheet className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Admin 2FA Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-sm text-slate-800">
            ระบบบริหารจัดการหอพัก: แผงควบคุมผู้ดูแลระบบ (Admin / Owner Console)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-2xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>2FA Verified (Email)</span>
        </div>
      </div>

      {/* Main Layout: Sidebar on Left, Content on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl border border-sky-100 p-3 shadow-xs shrink-0 lg:sticky lg:top-20">
          <nav className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider px-3 block">
                  {group.groupTitle}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = adminActiveTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAdminActiveTab(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-sky-600 text-white shadow-xs font-semibold"
                            : "text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0 w-full">
          {adminActiveTab === "dashboard" && <AdminDashboard />}
          {adminActiveTab === "ai-insights" && <AdminAiInsights />}
          {adminActiveTab === "rooms" && <AdminRoomManagement />}
          {adminActiveTab === "tenants" && <AdminTenantManagement />}
          {adminActiveTab === "contracts" && <AdminContractManagement />}
          {adminActiveTab === "meters" && <AdminMeterRecording />}
          {adminActiveTab === "billing" && <AdminInvoiceBilling />}
          {adminActiveTab === "slips" && <AdminSlipVerification />}
          {adminActiveTab === "payments" && <AdminPaymentHistory />}
          {adminActiveTab === "repairs" && <AdminRepairManagement />}
          {adminActiveTab === "deposits" && <AdminDepositManagement />}
          {adminActiveTab === "announcements" && <AdminAnnouncements />}
          {adminActiveTab === "rates" && <AdminUtilityRates />}
          {adminActiveTab === "line-oa" && <AdminLineOAChat />}
          {adminActiveTab === "reports" && <AdminReportsExport />}
        </main>
      </div>
    </div>
  );
};
