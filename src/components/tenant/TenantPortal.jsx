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
    { id: "contract", label: "สัญญาเช่า", icon: <FileText className="w-4 h-4" /> },
    { id: "bills", label: "ค่าใช้จ่าย / ชำระเงิน", icon: <CreditCard className="w-4 h-4" /> },
    { id: "repair", label: "แจ้งซ่อมแซม", icon: <Wrench className="w-4 h-4" /> },
    { id: "announcements", label: "ข่าวสาร / ประกาศ", icon: <Megaphone className="w-4 h-4" /> },
    { id: "deposit", label: "เงินประกัน", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "profile", label: "ข้อมูลส่วนตัว", icon: <User className="w-4 h-4" /> },
    { id: "line", label: "LINE OA", icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs for tenant */}
      <div className="bg-white rounded-2xl border border-sky-100 p-2 shadow-xs flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tenantActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTenantActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-sky-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-sky-700 hover:bg-sky-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {tenantActiveTab === "room" && <TenantRoomView />}
        {tenantActiveTab === "contract" && <TenantContractView />}
        {tenantActiveTab === "bills" && <TenantBillsView />}
        {tenantActiveTab === "repair" && <TenantRepairView />}
        {tenantActiveTab === "announcements" && <TenantAnnouncementsView />}
        {tenantActiveTab === "deposit" && <TenantDepositRefundView />}
        {tenantActiveTab === "profile" && <TenantProfile />}
        {tenantActiveTab === "line" && <TenantLineOALink />}
      </div>
    </div>
  );
};
