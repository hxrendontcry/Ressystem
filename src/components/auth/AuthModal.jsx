// src/components/auth/AuthModal.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  HelpCircle,
  Building2,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialTab,
    loginTenant,
    loginAdmin,
    tenants,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState("tenant"); // 'tenant' | 'admin'
  const [viewMode, setViewMode] = useState("login"); // 'login' | 'forgot' | 'activate'

  // Tenant Login Form State
  const [tenantEmail, setTenantEmail] = useState("tanakrit.s@email.com");
  const [tenantPassword, setTenantPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Admin Login & 2FA State
  const [adminEmail, setAdminEmail] = useState("owner@dormitory.com");
  const [adminPassword, setAdminPassword] = useState("adminpass2026");
  const [adminStep, setAdminStep] = useState(1); // 1: Password, 2: 2FA OTP
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Forgot Password State (1.3.1.3)
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // First-time Activation State (1.3.2.3)
  const [inviteToken, setInviteToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Sync initial tab when opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab || "tenant");
      setViewMode("login");
      setAdminStep(1);
      setOtpCode(["", "", "", "", "", ""]);
      setForgotSent(false);
    }
  }, [isAuthModalOpen, authModalInitialTab]);

  // Countdown timer for 2FA OTP
  useEffect(() => {
    let timer;
    if (isAuthModalOpen && activeTab === "admin" && adminStep === 2 && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAuthModalOpen, activeTab, adminStep, otpCountdown]);

  if (!isAuthModalOpen) return null;

  // Handler for Tenant Login (1.3.1.1)
  const handleTenantLoginSubmit = (e) => {
    e.preventDefault();
    if (!tenantEmail || !tenantPassword) {
      showToast("กรุณากรอกอีเมลและรหัสผ่าน", "error");
      return;
    }

    // Match tenant by email or fallback to first tenant
    const matched = tenants.find((t) => t.email.toLowerCase() === tenantEmail.toLowerCase()) || tenants[0];
    loginTenant(matched.id);
  };

  // Quick fill preset tenant
  const handleSelectDemoTenant = (t) => {
    setTenantEmail(t.email);
    setTenantPassword("Pass@" + t.assignedRoom);
  };

  // Handler for Admin Step 1
  const handleAdminStep1Submit = (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      showToast("กรุณากรอกอีเมลและรหัสผ่านผู้ดูแล", "error");
      return;
    }
    // Proceed to 2FA Email OTP
    setAdminStep(2);
    setOtpCountdown(60);
    showToast(`ระบบส่งรหัส 2FA OTP 6 หลัก ไปยังอีเมล ${adminEmail} แล้ว`, "info");
  };

  // Handler for 2FA OTP Submit (1.3.2.1)
  const handleAdminOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otpCode.join("");
    if (enteredOtp.length < 6) {
      showToast("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก", "error");
      return;
    }
    loginAdmin();
  };

  const handleFillDemoOtp = () => {
    setOtpCode(["8", "4", "9", "2", "0", "1"]);
    showToast("กรอกรหัสทดสอบ 849201 สำเร็จ", "success");
  };

  const handleResendOtp = () => {
    setIsResendingOtp(true);
    setTimeout(() => {
      setIsResendingOtp(false);
      setOtpCountdown(60);
      showToast(`ส่งรหัส OTP ชุดใหม่ไปยัง ${adminEmail} เรียบร้อยแล้ว`, "success");
    }, 800);
  };

  // Handler for Forgot Password (1.3.1.3)
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast("กรุณากรอกอีเมลที่ลงทะเบียนไว้", "error");
      return;
    }
    setForgotSent(true);
    showToast(`ส่งลิงก์สำหรับกู้คืนรหัสผ่านไปยัง ${forgotEmail} แล้ว`, "success");
  };

  // Handler for First-time Activation (1.3.2.3)
  const handleActivateSubmit = (e) => {
    e.preventDefault();
    if (!inviteToken.trim()) {
      showToast("กรุณาระบุรหัสคำเชิญ (Invite Token)", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน", "error");
      return;
    }
    showToast("เปิดใช้งานบัญชีและตั้งรหัสผ่านสำเร็จ สามารถเข้าสู่ระบบได้ทันที", "success");
    setViewMode("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header with Brand */}
        <div className="p-6 pb-4 bg-gradient-to-r from-sky-600 to-indigo-700 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">สุขสบาย เรสซิเดนซ์</h3>
              <p className="text-2xs text-sky-100">
                ระบบเข้าสู่ระบบสำหรับผู้เช่าและผู้ดูแลหอพัก
              </p>
            </div>
          </div>

          {/* Role Tabs */}
          {viewMode === "login" && (
            <div className="mt-5 grid grid-cols-2 p-1 bg-white/15 rounded-2xl backdrop-blur-xs border border-white/20">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("tenant");
                  setAdminStep(1);
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "tenant"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                <span>ผู้เช่า (Tenant)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "admin"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>เจ้าของ / ผู้ดูแล (2FA)</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* ======================================================== */}
          {/* TAB 1: ผู้เช่า (TENANT LOGIN) */}
          {/* ======================================================== */}
          {activeTab === "tenant" && viewMode === "login" && (
            <form onSubmit={handleTenantLoginSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>เข้าสู่ระบบสำหรับผู้เช่า</span>
                </span>
                <span className="text-3xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
                  สำหรับผู้พักอาศัย
                </span>
              </div>

              {/* Email */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  อีเมล (E-mail) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={tenantPassword}
                    onChange={(e) => setTenantPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options: Remember & Forgot Password */}
              <div className="flex items-center justify-between text-2xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>จดจำการเข้าสู่ระบบ</span>
                </label>

                {/* Link to Forgot Password */}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("forgot");
                    setForgotEmail(tenantEmail);
                  }}
                  className="text-sky-600 hover:underline font-semibold"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                <span>เข้าสู่ระบบ (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Preset Selector for Demo */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-3xs text-slate-400 block text-center uppercase tracking-wider font-bold">
                  ⚡ บัญชีทดสอบด่วน (Quick Demo)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTenantEmail("tanakrit.s@email.com");
                      setTenantPassword("pass1234");
                    }}
                    className="p-2 text-left bg-sky-50/70 hover:bg-sky-100/70 rounded-xl border border-sky-100 transition-colors"
                  >
                    <span className="text-2xs font-bold text-sky-900 block truncate">
                      ธนกฤต (ห้อง 101)
                    </span>
                    <span className="text-3xs text-slate-500 block">tanakrit.s@email.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTenantEmail("siriporn.b@email.com");
                      setTenantPassword("pass1234");
                    }}
                    className="p-2 text-left bg-sky-50/70 hover:bg-sky-100/70 rounded-xl border border-sky-100 transition-colors"
                  >
                    <span className="text-2xs font-bold text-sky-900 block truncate">
                      ศิริพร (ห้อง 201)
                    </span>
                    <span className="text-3xs text-slate-500 block">siriporn.b@email.com</span>
                  </button>
                </div>
              </div>

              {/* First-time Activation Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("activate")}
                  className="text-2xs text-slate-500 hover:text-sky-700"
                >
                  ได้รับคำเชิญเข้าพักเป็นครั้งแรก? <span className="font-semibold text-sky-600 underline">เปิดใช้งานบัญชี</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: เจ้าของหอพัก / ผู้ดูแล (ADMIN WITH 2FA) */}
          {/* ======================================================== */}
          {activeTab === "admin" && viewMode === "login" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>เข้าสู่ระบบผู้ดูแลระบบ (Admin / Owner)</span>
                </span>
                <span className="text-3xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  Two-Factor Authentication
                </span>
              </div>

              {/* Step 1: Admin Credentials */}
              {adminStep === 1 && (
                <form onSubmit={handleAdminStep1Submit} className="space-y-4">
                  <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-2xl flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
                    <p className="text-2xs text-rose-800 leading-relaxed">
                      ระบบกำหนดให้มีการยืนยันตัวตน 2 ชั้น (Two-Factor Authentication) ผ่าน Email เพื่อความปลอดภัยสูงสุดของข้อมูลการเงิน
                    </p>
                  </div>

                  <div>
                    <label className="block text-2xs font-semibold text-slate-700 mb-1">
                      อีเมลผู้ดูแล (Admin Email)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="owner@dormitory.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-semibold text-slate-700 mb-1">
                      รหัสผ่าน (Password)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    <span>ถัดไป: รับรหัสยืนยัน 2FA ทางอีเมล</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Step 2: 2FA OTP Email Verification (1.3.2.1) */}
              {adminStep === 2 && (
                <form onSubmit={handleAdminOtpSubmit} className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>ส่งรหัสความปลอดภัย 2FA ไปยังอีเมลแล้ว</span>
                    </div>
                    <p className="text-2xs text-emerald-700 leading-relaxed">
                      กรุณากรอกรหัส OTP 6 หลัก ที่ส่งไปยัง <span className="font-mono font-bold text-emerald-900">{adminEmail}</span> เพื่อยืนยันตัวตน
                    </p>
                  </div>

                  {/* 6 Digits OTP Box */}
                  <div>
                    <label className="block text-2xs font-semibold text-slate-700 mb-2 text-center">
                      รหัส OTP 6 หลัก (Two-Factor Code)
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            const newArr = [...otpCode];
                            newArr[index] = val;
                            setOtpCode(newArr);
                            // Auto focus next
                            if (val && index < 5) {
                              const nextInput = document.getElementById(`otp-${index + 1}`);
                              nextInput?.focus();
                            }
                          }}
                          className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-hidden bg-white shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Fill Demo OTP */}
                  <div className="flex items-center justify-between text-2xs text-slate-500 pt-1">
                    <button
                      type="button"
                      onClick={handleFillDemoOtp}
                      className="text-sky-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>กรอกรหัสทดสอบอัตโนมัติ (849201)</span>
                    </button>

                    <button
                      type="button"
                      disabled={otpCountdown > 0 || isResendingOtp}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1 ${
                        otpCountdown > 0 ? "text-slate-400" : "text-sky-600 hover:underline font-medium"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isResendingOtp ? "animate-spin" : ""}`} />
                      <span>{otpCountdown > 0 ? `ส่งใหม่ใน (${otpCountdown}s)` : "ส่งรหัสใหม่อีกครั้ง"}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAdminStep(1)}
                      className="px-4 py-2.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>ยืนยันรหัส 2FA และเข้าสู่ระบบ</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SUB-VIEW: ลืมรหัสผ่าน (FORGOT PASSWORD - 1.3.1.3) */}
          {/* ======================================================== */}
          {viewMode === "forgot" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-sky-600" />
                  <span>กู้คืนรหัสผ่านผู้เช่า (Forgot Password)</span>
                </span>
              </div>

              {!forgotSent ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-2xs text-slate-500 leading-relaxed">
                    กรอกที่อยู่อีเมลของคุณที่ลงทะเบียนไว้ในระบบ ระบบจะทำการส่งลิงก์ (Reset Password Link) สำหรับกำหนดรหัสผ่านใหม่ไปยังกล่องข้อความอีเมลของคุณ
                  </p>

                  <div>
                    <label className="block text-2xs font-semibold text-slate-700 mb-1">
                      อีเมล (E-mail)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your-email@email.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setViewMode("login")}
                      className="px-4 py-2.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ส่งลิงก์กู้คืนรหัสผ่าน</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">ส่งลิงก์กู้คืนรหัสผ่านสำเร็จ</h4>
                  <p className="text-2xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    ระบบได้ส่งอีเมลพร้อมลิงก์ตั้งรหัสผ่านใหม่ไปยัง <span className="font-semibold text-slate-800">{forgotEmail}</span> แล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ (ลิงก์มีอายุ 15 นาที)
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("login");
                      setForgotSent(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    กลับไปหน้าเข้าสู่ระบบ
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SUB-VIEW: เปิดใช้งานบัญชีครั้งแรก (ACTIVATE ACCOUNT - 1.3.2.3) */}
          {/* ======================================================== */}
          {viewMode === "activate" && (
            <form onSubmit={handleActivateSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>เปิดใช้งานบัญชีผู้เช่าครั้งแรก</span>
                </span>
              </div>

              <p className="text-2xs text-slate-500 leading-relaxed">
                กรอกรหัสคำเชิญ (Invite Token) ที่ได้รับจากเจ้าของหอพักทาง Email หรือ LINE OA เพื่อตั้งรหัสผ่านและเปิดใช้งานบัญชีของคุณ
              </p>

              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  รหัสคำเชิญ / ลิงก์เชิญ (Invite Token)
                </label>
                <input
                  type="text"
                  required
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  placeholder="เช่น INV-102-SECURE"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    ตั้งรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="พิมพ์ซ้ำอีกครั้ง"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("login")}
                  className="px-4 py-2.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>เปิดใช้งานบัญชี</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
