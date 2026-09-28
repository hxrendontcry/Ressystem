// src/components/tenant/TenantProfile.jsx
import React, { useState } from "react";
import { User, KeyRound, Mail, Phone, MapPin, Briefcase, PhoneCall, Building2, Save, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const TenantProfile = () => {
  const { currentTenant, updateTenantProfile, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: currentTenant?.name || "",
    phone: currentTenant?.phone || "",
    email: currentTenant?.email || "",
    address: currentTenant?.address || "",
    occupation: currentTenant?.occupation || "",
    emergencyContactPhone: currentTenant?.emergencyContactPhone || "",
    bankName: currentTenant?.bankName || "",
    bankAccountNumber: currentTenant?.bankAccountNumber || "",
    bankAccountName: currentTenant?.bankAccountName || "",
    avatar: currentTenant?.avatar || "",
  });

  // Password Change State
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot Password / Recovery State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState(currentTenant?.email || "");

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateTenantProfile(formData);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword) {
      showToast("กรุณากรอกรหัสผ่านเดิมเพื่อยืนยันตัวตน", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน", "error");
      return;
    }
    showToast("เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว", "success");
    setIsChangePassModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      showToast("กรุณาระบุ Email สำหรับรับลิงก์กู้คืนรหัสผ่าน", "error");
      return;
    }
    showToast(`ระบบได้ส่งลิงก์สำหรับกู้คืนรหัสผ่านไปยัง ${recoveryEmail} เรียบร้อยแล้ว`, "success");
    setIsForgotModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Profile Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              alt="รูปโปรไฟล์"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-200 shadow-xs"
            />
            <button
              onClick={() => showToast("เปิดเลือกไฟล์รูปโปรไฟล์ใหม่...")}
              className="absolute -bottom-1 -right-1 p-1 bg-sky-600 text-white rounded-lg text-2xs shadow-md hover:bg-sky-700"
              title="เปลี่ยนรูปโปรไฟล์"
            >
              แก้ไข
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{currentTenant.name}</h3>
            <p className="text-xs text-slate-500">
              ผู้เช่าห้องพัก {currentTenant.assignedRoom} | รหัสผู้เช่า: <span className="font-mono text-sky-700 font-semibold">{currentTenant.id}</span>
            </p>
          </div>
        </div>

        {/* Security Quick Actions (1.3.1.2 & 1.3.1.3) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChangePassModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold transition-colors"
          >
            <KeyRound className="w-4 h-4 text-sky-600" />
            <span>เปลี่ยนรหัสผ่าน</span>
          </button>
          <button
            onClick={() => setIsForgotModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl border border-sky-200 text-xs font-semibold transition-colors"
          >
            <Mail className="w-4 h-4 text-sky-600" />
            <span>กู้คืนรหัสผ่าน</span>
          </button>
        </div>
      </div>

      {/* Main Profile Edit Form (1.3.1.4) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <form onSubmit={handleProfileSave} className="space-y-6">
          <h4 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600" />
            <span>ข้อมูลส่วนตัวและการติดต่อ (Personal Information)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ – สกุล <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อาชีพ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="เช่น พนักงานบริษัท, โปรแกรมเมอร์, ข้าราชการ"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อีเมล (E-mail) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ที่อยู่ปัจจุบัน (ตามทะเบียนบ้าน/บัตรประชาชน)
              </label>
              <textarea
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                placeholder="เช่น 081-999-8877 (มารดา)"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Refund Bank Info */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>ข้อมูลบัญชีธนาคารสำหรับรับเงินมัดจำคืน (Deposit Refund Account)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อธนาคารสำหรับรับเงินมัดจำคืน <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                >
                  <option value="กสิกรไทย (KBANK)">กสิกรไทย (KBANK)</option>
                  <option value="ไทยพาณิชย์ (SCB)">ไทยพาณิชย์ (SCB)</option>
                  <option value="กรุงเทพ (BBL)">กรุงเทพ (BBL)</option>
                  <option value="กรุงไทย (KTB)">กรุงไทย (KTB)</option>
                  <option value="กรุงศรีอยุธยา (BAY)">กรุงศรีอยุธยา (BAY)</option>
                  <option value="ทหารไทยธนชาต (ttb)">ทหารไทยธนชาต (ttb)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เลขที่บัญชีธนาคาร <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อบัญชีธนาคาร (ตรงกับชื่อผู้เช่า) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูลส่วนตัว</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal: 1.3.1.2 Change Password */}
      <Modal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
        title="เปลี่ยนรหัสผ่าน (Change Password)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสผ่านเดิมเพื่อยืนยัน <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านปัจจุบัน"
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสผ่านใหม่ <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ยืนยันรหัสผ่านใหม่อีกครั้ง <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsChangePassModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              ยืนยันเปลี่ยนรหัสผ่าน
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: 1.3.1.3 Forgot Password Recovery */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="กู้คืนรหัสผ่าน (Password Recovery)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRecoverySubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            กรุณากรอก Email ที่ลงทะเบียนไว้ในระบบ ระบบจะส่ง Link สำหรับตั้งรหัสผ่านใหม่ไปยังกล่องข้อความของคุณ
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อีเมล (E-mail) <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ปิด
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              ส่งลิงก์กู้คืนรหัสผ่าน
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
