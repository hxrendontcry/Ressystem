// src/components/tenant/TenantPortal.jsx
import React from "react";
import {
  Home,
  FileText,
  CreditCard,
  Wrench,
  Megaphone,
  ShieldCheck,
  User,
  MessageCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { TenantRoomView } from "./TenantRoomView";
import { TenantContractView } from "./TenantContractView";
import { TenantBillsView } from "./TenantBillsView";
import { TenantRepairView } from "./TenantRepairView";
import { TenantAnnouncementsView } from "./TenantAnnouncementsView";
import { TenantDepositRefundView } from "./TenantDepositRefundView";
import { TenantProfile } from "./TenantProfile";
import { TenantLineOALink } from "./TenantLineOALink";

export const TenantPortal = () => {
  const { tenantActiveTab, setTenantActiveTab, currentTenant } = useApp();

  const tabs = [
    { id: "room", label: "ข้อมูลห้องพัก", icon: <Home className="w-4 h-4" /> },
    { id: "contract", label: "สัญญาเช่า / คำขอ", icon: <FileText className="w-4 h-4" /> },
    { id: "bills", label: "ค่าใช้จ่าย / ชำระเงิน", icon: <CreditCard className="w-4 h-4" /> },
    { id: "repair", label: "แจ้งซ่อมแซม", icon: <Wrench className="w-4 h-4" /> },
    { id: "announcements", label: "ข่าวสาร / ประกาศ", icon: <Megaphone className="w-4 h-4" /> },
    { id: "deposit", label: "เงินประกัน", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "profile", label: "ข้อมูลส่วนตัว", icon: <User className="w-4 h-4" /> },
    { id: "line", label: "LINE Official Account", icon: <MessageCircle className="w-4 h-4 text-emerald-600" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Sidebar for Tenant */}
      <aside className="w-full lg:w-60 bg-white rounded-2xl border border-sky-100 p-3 shadow-xs shrink-0 lg:sticky lg:top-20">
        <div className="p-3 mb-2 bg-sky-50/60 rounded-xl border border-sky-100">
          <span className="text-2xs text-slate-400 block">ผู้เช่าปัจจุบัน</span>
          <span className="text-xs font-bold text-slate-800 block truncate">
            {currentTenant.name}
          </span>
          <span className="text-2xs text-sky-700 font-semibold block mt-0.5">
            ห้องพัก: {currentTenant.assignedRoom}
          </span>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => {
            const isActive = tenantActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTenantActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 min-w-0 w-full">
        {tenantActiveTab === "room" && <TenantRoomView />}
        {tenantActiveTab === "contract" && <TenantContractView />}
        {tenantActiveTab === "bills" && <TenantBillsView />}
        {tenantActiveTab === "repair" && <TenantRepairView />}
        {tenantActiveTab === "announcements" && <TenantAnnouncementsView />}
        {tenantActiveTab === "deposit" && <TenantDepositRefundView />}
        {tenantActiveTab === "profile" && <TenantProfile />}
        {tenantActiveTab === "line" && <TenantLineOALink />}
      </main>
    </div>
  );
};
