// src/components/admin/AdminRepairManagement.jsx
import React, { useState } from "react";
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  Image,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminRepairManagement = () => {
  const { repairs, adminUpdateRepairStatus, showToast } = useApp();

  const [selectedRepair, setSelectedRepair] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("in_progress");
  const [adminNote, setAdminNote] = useState("");

  const handleOpenUpdate = (rep) => {
    setSelectedRepair(rep);
    setNewStatus(rep.status);
    setAdminNote(rep.adminNote || "");
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    adminUpdateRepairStatus(selectedRepair.id, newStatus, adminNote);
    setIsUpdateModalOpen(false);
  };

  const getUrgencyBadge = (u) => {
    switch (u) {
      case "ฉุกเฉิน":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "สูง":
        return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      case "ปานกลาง":
        return "bg-sky-100 text-sky-800 border-sky-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in_progress":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            ระบบจัดการงานแจ้งซ่อมและช่างบริการ (Maintenance Requests)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            รับเรื่องแจ้งซ่อม จ่ายงานช่าง อัปเดตสถานะการเข้าซ่อม และแจ้งกลับผู้เช่า (1.3.2.24)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            รอดำเนินการ: {repairs.filter((r) => r.status === "pending").length} งาน
          </span>
        </div>
      </div>

      {/* Repairs Table (1.3.2.24) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">รหัสงาน</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ชื่อผู้เช่า</th>
              <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">ห้อง</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ประเภทปัญหา</th>
              <th className="py-3.5 px-4 font-semibold text-center whitespace-nowrap">ระดับความเร่งด่วน</th>
              <th className="py-3.5 px-4 font-semibold min-w-[260px]">รายละเอียดปัญหา</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">วันเวลาที่แจ้ง</th>
              <th className="py-3.5 px-4 font-semibold text-center whitespace-nowrap">สถานะ</th>
              <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {repairs.map((rep) => (
              <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-sky-900 whitespace-nowrap">{rep.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">{rep.tenantName}</td>
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span className="font-bold text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg border border-sky-200 inline-block">
                    ห้อง {rep.roomNumber}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">{rep.category}</td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full border whitespace-nowrap ${getUrgencyBadge(
                      rep.urgency
                    )}`}
                  >
                    {rep.urgency}
                  </span>
                </td>
                <td className="py-3.5 px-4 min-w-[260px]">
                  <span className="font-semibold text-slate-800 block text-xs">{rep.title}</span>
                  <span className="text-2xs text-slate-500 block leading-relaxed mt-0.5 line-clamp-2">{rep.description}</span>
                  {rep.attachments && rep.attachments.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-2xs text-sky-600 mt-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      <Image className="w-3 h-3" />
                      <span>มีรูป/คลิปแนบ</span>
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">{rep.createdAt}</td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getStatusBadge(
                      rep.status
                    ).className}`}
                  >
                    {getStatusBadge(rep.status).icon}
                    <span>{getStatusBadge(rep.status).label}</span>
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleOpenUpdate(rep)}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    อัปเดตงาน
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Update Repair Status & Admin Note */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`อัปเดตสถานะงานซ่อม - ${selectedRepair?.id}`}
        maxWidth="max-w-lg"
      >
        {selectedRepair && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div>
                <span className="text-slate-400">ผู้แจ้ง:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {selectedRepair.tenantName} (ห้อง {selectedRepair.roomNumber})
                </span>
              </div>
              <div>
                <span className="text-slate-400">ปัญหา:</span>{" "}
                <span className="text-slate-700 font-medium">{selectedRepair.title}</span>
              </div>
              <div>
                <span className="text-slate-400">รายละเอียด:</span>{" "}
                <span className="text-slate-600">{selectedRepair.description}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะงานแจ้งซ่อม <span className="text-rose-500">*</span>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="pending">รอดำเนินการ (Pending)</option>
                <option value="in_progress">กำลังดำเนินการ / นัดหมายช่างแล้ว (In Progress)</option>
                <option value="completed">ดำเนินการเสร็จสิ้น (Completed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ข้อความตอบกลับหรือบันทึกของเจ้าหน้าที่
              </label>
              <textarea
                rows="3"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="เช่น นัดหมายช่างแอร์เข้าตรวจเช็ควันจันทร์ที่ 29 ก.ย. เวลา 13:00 น."
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
              >
                บันทึกการอัปเดต
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
