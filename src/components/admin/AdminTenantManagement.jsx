// src/components/admin/AdminTenantManagement.jsx
import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Send,
  FileText,
  Paperclip,
  CheckCircle,
  ExternalLink,
  Edit2,
  Upload,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminTenantManagement = () => {
  const {
    tenants,
    rooms,
    contracts,
    adminAddTenant,
    adminUpdateTenant,
    adminSendInvitation,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [assignedRoom, setAssignedRoom] = useState("102");

  const openCreateModal = () => {
    setEditingTenant(null);
    setName("");
    setIdCard("");
    setPhone("");
    setEmail("");
    setEmergencyPhone("");
    setAssignedRoom("102");
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTenant(t);
    setName(t.name);
    setIdCard(t.idCard);
    setPhone(t.phone);
    setEmail(t.email);
    setEmergencyPhone(t.emergencyContactPhone);
    setAssignedRoom(t.assignedRoom);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      showToast("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน", "error");
      return;
    }

    const payload = {
      id: editingTenant ? editingTenant.id : `T${String(tenants.length + 1).padStart(3, "0")}`,
      name,
      idCard,
      phone,
      email,
      emergencyContactPhone: emergencyPhone,
      assignedRoom,
      status: "active",
      accountActivated: editingTenant ? editingTenant.accountActivated : false,
      documents: editingTenant?.documents || [
        { name: `เอกสารสัญญา_${name.split(" ")[0]}.pdf`, size: "1.2 MB", uploadDate: "2026-09-28" }
      ],
      bankName: editingTenant?.bankName || "กสิกรไทย (KBANK)",
      bankAccountNumber: editingTenant?.bankAccountNumber || "000-0-00000-0",
      bankAccountName: name,
    };

    if (editingTenant) {
      adminUpdateTenant(payload);
    } else {
      adminAddTenant(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            จัดการข้อมูลผู้เช่าและสัญญา (Tenant Directory)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ลงทะเบียนผู้เช่า กำหนดห้องพัก ส่งลิงก์เปิดใช้งานบัญชี และจัดเก็บเอกสารสัญญา (1.3.2.2 - 1.3.2.5)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>เพิ่มผู้เช่าใหม่</span>
        </button>
      </div>

      {/* 1.3.2.5 รายชื่อผู้เช่าปัจจุบัน Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ชื่อ – สกุล</th>
              <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">ห้องพัก</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">เบอร์โทรศัพท์</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">อีเมล (E-mail)</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ระยะเวลาสัญญาเช่า</th>
              <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">เอกสาร (≤ 3)</th>
              <th className="py-3.5 px-4 font-semibold text-center whitespace-nowrap">คำเชิญเปิดบัญชี</th>
              <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">แก้ไข</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {tenants.map((tenant) => {
              const contract = contracts.find((c) => c.tenantId === tenant.id);
              return (
                <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 block">{tenant.name}</span>
                    <span className="text-2xs text-slate-400 font-mono block mt-0.5">
                      บัตร: {tenant.idCard || "-"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs inline-block">
                      ห้อง {tenant.assignedRoom || "ยังไม่ผูก"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700">{tenant.phone}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">{tenant.email}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                    {contract ? (
                      <div>
                        <span className="font-medium text-slate-800 block">
                          {contract.startDate} ถึง {contract.endDate}
                        </span>
                        <span className="text-sky-700 font-semibold text-2xs block">
                          สัญญา {contract.contractNumber}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">ยังไม่มีสัญญา</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                      <Paperclip className="w-3.5 h-3.5 text-sky-600" />
                      <span className="text-xs">{tenant.documents?.length || 0} ไฟล์</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {tenant.accountActivated ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>เปิดใช้งานแล้ว</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => adminSendInvitation(tenant.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
                        title="ส่งลิงก์ตั้งรหัสผ่านเข้า Email"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ส่งคำเชิญ</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(tenant)}
                      className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 border border-sky-200 inline-flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: 1.3.2.2 Create / Edit Tenant */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTenant ? `แก้ไขข้อมูลผู้เช่า - ${editingTenant.name}` : "ลงทะเบียนผู้เช่าใหม่"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ – สกุล <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น นายสมคิด สถิตสุข"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขประจำตัวประชาชน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="1-xxxx-xxxxx-xx-x"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08x-xxx-xxxx"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenant@email.com"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="เช่น 081-xxx-xxxx (บิดา)"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              {/* 1.3.2.4 กำหนดห้องพัก */}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กำหนดห้องพักที่เช่า <span className="text-rose-500">*</span>
              </label>
              <select
                value={assignedRoom}
                onChange={(e) => setAssignedRoom(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    ห้อง {r.roomNumber} ({r.type} - ฿{r.price}/ด. [{r.statusLabel}])
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 1.3.2.2 อัปโหลดไฟล์เอกสารสำคัญ (ไม่เกิน 3 ไฟล์) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อัปโหลดไฟล์เอกสารสำคัญ (บัตรประชาชน, ทะเบียนบ้าน ไม่เกิน 3 ไฟล์)
            </label>
            <div className="p-3 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 text-center hover:bg-sky-50 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="text-xs text-slate-700 font-medium">คลิกเพื่ออัปโหลดเอกสารสำคัญ</p>
              <span className="text-2xs text-slate-400">PDF หรือรูปภาพขนาดไม่เกิน 5 MB</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              {editingTenant ? "บันทึกข้อมูล" : "สร้างและส่งคำเชิญ"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
