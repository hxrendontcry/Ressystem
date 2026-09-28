// src/components/admin/AdminContractManagement.jsx
import React, { useState } from "react";
import {
  FileText,
  PlusCircle,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  Calendar,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminContractManagement = () => {
  const {
    contracts,
    tenants,
    rooms,
    adminApproveRenewal,
    adminRejectRenewal,
    adminConfirmMoveOut,
    showToast,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || "");
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("101");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2027-09-30");
  const [rentAmount, setRentAmount] = useState(4500);
  const [depositAmount, setDepositAmount] = useState(9000);

  const handleCreateContract = (e) => {
    e.preventDefault();
    const tenant = tenants.find((t) => t.id === selectedTenantId);
    showToast(`สร้างสัญญาเช่าสำหรับ ${tenant?.name} ห้อง ${selectedRoomNumber} เรียบร้อยแล้ว`);
    setIsCreateModalOpen(false);
  };

  const handleSendContract = (contract, channel) => {
    showToast(
      `ส่งสัญญา ${contract.contractNumber} ไปยัง ${
        channel === "email" ? `Email: ${contract.tenantName}` : "LINE Official Account"
      } สำเร็จ`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            จัดการสัญญาเช่าและคำขอ (Lease Contracts & Requests)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            สร้างสัญญาเช่า, ส่งทาง Email/LINE OA, ตรวจสอบการยืนยันสัญญา และอนุมัติคำขอต่ออายุ/ย้ายออก (1.3.2.7 - 1.3.2.11)
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>สร้างสัญญาเช่าใหม่</span>
        </button>
      </div>

      {/* Pending Renewal / Move-out Requests Section (1.3.2.10 & 1.3.2.11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Renewal Requests */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>คำขอต่ออายุสัญญา (Renewal Requests)</span>
            </h4>
            <span className="text-2xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-semibold">
              1.3.2.10
            </span>
          </div>

          <div className="space-y-2.5">
            {contracts.filter((c) => c.renewalRequest && c.renewalRequest.status === "pending").length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">ไม่มีคำขอต่อสัญญาค้างอยู่</p>
            ) : (
              contracts
                .filter((c) => c.renewalRequest && c.renewalRequest.status === "pending")
                .map((c) => (
                  <div
                    key={c.contractNumber}
                    className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {c.tenantName} (ห้อง {c.roomNumber})
                      </span>
                      <span className="text-2xs text-amber-800 font-semibold">
                        ขอต่อ {c.renewalRequest.requestedMonths} เดือน
                      </span>
                    </div>
                    <p className="text-2xs text-slate-600">
                      สัญญาเดิมสิ้นสุด: {c.endDate} | ยื่นเมื่อ: {c.renewalRequest.requestedAt}
                    </p>
                    {c.renewalRequest.note && (
                      <p className="text-2xs text-slate-500 italic">"{c.renewalRequest.note}"</p>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => adminRejectRenewal(c.contractNumber, "ห้องพักถูกจองล่วงหน้าแล้ว")}
                        className="px-3 py-1 bg-white text-rose-600 border border-rose-200 rounded-lg text-2xs font-semibold hover:bg-rose-50"
                      >
                        ปฏิเสธ
                      </button>
                      <button
                        onClick={() => adminApproveRenewal(c.contractNumber)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-2xs font-semibold hover:bg-emerald-700"
                      >
                        อนุมัติการต่อสัญญา
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Move-Out Confirmation (1.3.2.11) */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>ยืนยันวันแจ้งออกจากห้องพัก (Move-out Confirmation)</span>
            </h4>
            <span className="text-2xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-semibold">
              1.3.2.11
            </span>
          </div>

          <div className="space-y-2.5">
            {contracts.filter((c) => c.moveOutRequest).length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">ไม่มีคำขอแจ้งย้ายออก</p>
            ) : (
              contracts
                .filter((c) => c.moveOutRequest)
                .map((c) => (
                  <div
                    key={c.contractNumber}
                    className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {c.tenantName} (ห้อง {c.roomNumber})
                      </span>
                      <span className="text-2xs text-rose-700 font-semibold">
                        ระบุวันย้ายออก: {c.moveOutRequest.moveOutDate}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-600">
                      เหตุผล: {c.moveOutRequest.reason || "ย้ายที่ทำงาน"}
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => adminConfirmMoveOut(c.contractNumber)}
                        className="px-3 py-1 bg-rose-600 text-white rounded-lg text-2xs font-semibold hover:bg-rose-700"
                      >
                        ยืนยันวันย้ายออกและนัดตรวจห้อง
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* 1.3.2.9 ตรวจสอบสถานะยืนยันสัญญาเช่า Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <h4 className="font-bold text-sm text-slate-800 mb-4">
          รายการสัญญาเช่าทั้งหมดและสถานะยืนยัน (1.3.2.9)
        </h4>
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3 px-3 font-semibold">เลขที่สัญญา</th>
              <th className="py-3 px-3 font-semibold">ชื่อผู้เช่า</th>
              <th className="py-3 px-3 font-semibold text-center">เลขห้อง</th>
              <th className="py-3 px-3 font-semibold">วันเริ่ม - สิ้นสุด</th>
              <th className="py-3 px-3 font-semibold">วันที่ยืนยันสัญญา</th>
              <th className="py-3 px-3 font-semibold">สถานะยืนยัน</th>
              <th className="py-3 px-3 font-semibold text-center">ส่งสัญญา (1.3.2.8)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {contracts.map((c) => (
              <tr key={c.contractNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-sky-900">
                  {c.contractNumber}
                </td>
                <td className="py-3 px-3 font-medium text-slate-800">{c.tenantName}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200">
                    {c.roomNumber}
                  </span>
                </td>
                <td className="py-3 px-3 text-2xs">
                  {c.startDate} ถึง {c.endDate}
                </td>
                <td className="py-3 px-3 text-2xs text-slate-500">
                  {c.confirmedAt || "ยังไม่ยืนยัน"}
                </td>
                <td className="py-3 px-3">
                  {c.confirmedByTenant ? (
                    <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>ยืนยันแล้ว</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      <span>รอยืนยัน</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleSendContract(c, "email")}
                      title="ส่งสัญญาทาง Email"
                      className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSendContract(c, "line")}
                      title="ส่งสัญญาผ่าน LINE OA"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: 1.3.2.7 Create Contract */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="สร้างสัญญาเช่าใหม่ (Create Lease Contract)"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateContract} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลือกผู้เช่า <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (ห้องเดิม {t.assignedRoom})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ห้องพักที่ทำสัญญา <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    ห้อง {r.roomNumber} ({r.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เริ่มสัญญา <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่สิ้นสุดสัญญา <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ค่าเช่าห้องพัก (บาท/เดือน) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                จำนวนเงินประกัน (บาท) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เงื่อนไขและข้อตกลงมาตรฐาน
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-2xs text-slate-600 space-y-1">
              <div>✓ ห้ามเลี้ยงสัตว์ทุกชนิดภายในห้องพักและอาคาร</div>
              <div>✓ ห้ามสูบบุหรี่หรือสารเสพติดภายในอาคาร</div>
              <div>✓ ชำระค่าเช่าภายในวันที่ 5 ของทุกเดือน</div>
              <div>✓ แจ้งย้ายออกล่วงหน้าอย่างน้อย 30 วัน</div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              บันทึกสัญญาเช่า
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
