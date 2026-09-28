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
  const { adminActiveTab, setAdminActiveTab, admin2FAVerified } = useApp();

  const navItems = [
    { id: "dashboard", label: "Dashboard ภาพรวม", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "ai-insights", label: "AI สรุปข้อมูล", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: "rooms", label: "ข้อมูลห้องพัก", icon: <Building2 className="w-4 h-4" /> },
    { id: "tenants", label: "ทะเบียนผู้เช่า", icon: <Users className="w-4 h-4" /> },
    { id: "contracts", label: "สัญญาเช่า / คำขอ", icon: <FileText className="w-4 h-4" /> },
    { id: "meters", label: "จดมิเตอร์น้ำ-ไฟ", icon: <Gauge className="w-4 h-4" /> },
    { id: "billing", label: "ออกใบแจ้งหนี้", icon: <Receipt className="w-4 h-4" /> },
    { id: "slips", label: "ตรวจสลิป / ใบเสร็จ", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "payments", label: "ประวัติชำระ / ค้างจ่าย", icon: <History className="w-4 h-4" /> },
    { id: "repairs", label: "งานแจ้งซ่อม", icon: <Wrench className="w-4 h-4" /> },
    { id: "deposits", label: "คืนเงินประกัน", icon: <Banknote className="w-4 h-4" /> },
    { id: "announcements", label: "ประกาศข่าวสาร", icon: <Megaphone className="w-4 h-4" /> },
    { id: "rates", label: "อัตราค่าบริการ", icon: <Settings2 className="w-4 h-4" /> },
    { id: "line-oa", label: "แชท LINE OA", icon: <MessageCircle className="w-4 h-4 text-emerald-600" /> },
    { id: "reports", label: "ส่งออกรายงาน", icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Admin 2FA Banner & Title (1.3.2.1) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="font-bold text-sm text-slate-800">
            ระบบบริหารจัดการหอพัก: แผงควบคุมผู้ดูแลระบบ (Admin / Owner Console)
          </span>
        </div>
        <div className="flex items-center gap-2 text-2xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>Two-Factor Authentication (2FA Email) ยืนยันตัวตนเรียบร้อย</span>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="bg-white rounded-2xl border border-sky-100 p-2 shadow-xs flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = adminActiveTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-sky-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-sky-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render */}
      <div>
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
      </div>
    </div>
  );
};
