// src/App.jsx
import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { Toast } from "./components/common/Toast";
import { TenantPortal } from "./components/tenant/TenantPortal";
import { AdminPortal } from "./components/admin/AdminPortal";
import { AiChatbotModal } from "./components/ai/AiChatbotModal";
import { AuthModal } from "./components/auth/AuthModal";
import { Sparkles, Building, CheckCircle2 } from "lucide-react";

const MainContent = () => {
  const { currentRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar with Role Switcher & Branding */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === "tenant" ? <TenantPortal /> : <AdminPortal />}
      </main>

      {/* Login & 2FA Modal (1.3.1.1 & 1.3.2.1) */}
      <AuthModal />

      {/* AI Chatbot Floating Widget (1.3.2.29 - 1.3.2.30) */}
      <AiChatbotModal />

      {/* Toast Feedback */}
      <Toast />

      {/* Proposal Footer */}
      <footer className="bg-white border-t border-sky-100 py-6 text-center text-xs text-slate-500">
        <div className="max-w-[1550px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-700">สุขสบาย เรสซิเดนซ์ (Smart Dormitory)</span>
            <span className="text-slate-300">|</span>
            <span>ระบบบริหารจัดการหอพักอัจฉริยะ</span>
          </div>

          <div className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>ระบบบริหารจัดการหอพักและอพาร์ตเมนต์ออนไลน์</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
