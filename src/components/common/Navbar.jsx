import React from "react";
import {
  Building2,
  User,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Bell,
  LogIn,
  LogOut,
  KeyRound,
  Lock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Navbar = () => {
  const {
    currentRole,
    setCurrentRole,
    currentTenant,
    tenants,
    setCurrentTenantId,
    setTenantActiveTab,
    isAuthenticated,
    admin2FAVerified,
    openAuthModal,
    logout,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-sky-100 shadow-xs">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800 tracking-tight">สุขสบาย เรสซิเดนซ์</span>
                <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full border border-sky-200 hidden sm:inline-block">
                  Smart Dormitory
                </span>
              </div>
              <p className="text-xs text-slate-500">ระบบบริหารจัดการหอพักอัจฉริยะ (Dormitory Management)</p>
            </div>
          </div>

          {/* Center/Right Actions: Role Switcher & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Switch Role Bar */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/80">
              <button
                onClick={() => setCurrentRole("tenant")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  currentRole === "tenant"
                    ? "bg-white text-sky-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-4 h-4" />
                <span>มุมมองผู้เช่า</span>
              </button>
              <button
                onClick={() => setCurrentRole("admin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  currentRole === "admin"
                    ? "bg-sky-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ผู้ดูแล / เจ้าของ</span>
              </button>
            </div>

            {/* If in tenant mode, allow selecting sample tenant */}
            {currentRole === "tenant" && (
              <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-100">
                <span>เลือกผู้เช่า:</span>
                <select
                  value={currentTenant.id}
                  onChange={(e) => setCurrentTenantId(e.target.value)}
                  className="bg-transparent font-medium text-sky-800 border-none focus:outline-hidden cursor-pointer"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (ห้อง {t.assignedRoom})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Login & 2FA Modal Trigger Button */}
            <button
              onClick={() => openAuthModal(currentRole)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors shadow-2xs"
              title="เข้าสู่ระบบ / ยืนยันตัวตน 2FA"
            >
              <KeyRound className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">เข้าสู่ระบบ / 2FA</span>
              <span className="sm:hidden">Login</span>
            </button>

            {/* Quick LINE OA button */}
            <button
              onClick={() => {
                if (currentRole === "tenant") {
                  setTenantActiveTab("line");
                }
              }}
              title="ติดต่อ LINE Official Account"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">LINE OA</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
