// src/components/admin/AdminDepositManagement.jsx
import React, { useState } from "react";
import { Banknote, PlusCircle, CheckCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminDepositManagement = () => {
  const { depositRefunds, tenants, contracts, adminRecordDepositDeduction, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || "");
  const [damageDescription, setDamageDescription] = useState("");
  const [damageAmount, setDamageAmount] = useState(0);
  const [refundStatus, setRefundStatus] = useState("refunded");
  const [refundDate, setRefundDate] = useState("2026-09-28");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const tenant = tenants.find((t) => t.id === selectedTenantId);
    const contract = contracts.find((c) => c.tenantId === selectedTenantId);
    const originalDeposit = contract?.depositAmount || 9000;
    const deducted = Number(damageAmount);
    const net = Math.max(0, originalDeposit - deducted);

    const newRecord = {
      id: `REF-${Date.now().toString().slice(-4)}`,
      tenantId: selectedTenantId,
      tenantName: tenant?.name || "ผู้เช่า",
      roomNumber: tenant?.assignedRoom || "101",
      moveOutDate: "สิ้นสุดสัญญา",
      originalDeposit,
      deductions: damageDescription
        ? [{ item: damageDescription, amount: deducted }]
        : [],
      totalDeducted: deducted,
      netRefund: net,
      status: refundStatus,
      refundDate: refundStatus === "refunded" ? refundDate : "รอดำเนินการ",
      destinationBank: `${tenant?.bankName || "ธนาคาร"} ${tenant?.bankAccountNumber || ""} (${tenant?.bankAccountName || tenant?.name})`,
    };

    adminRecordDepositDeduction(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            บันทึกการหักและคืนเงินประกัน (Security Deposit Refund Management)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            คำนวณรายการความเสียหาย หักหนี้คงค้าง และบันทึกการคืนเงินประกันหลังผู้เช่าย้ายออก
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>บันทึกการหัก / คืนเงินประกัน</span>
        </button>
      </div>

      {/* Refunds Table (1.3.2.23) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 whitespace-nowrap text-xs">
              <th className="py-3.5 px-4 font-semibold">ผู้เช่า</th>
              <th className="py-3.5 px-4 font-semibold text-center">ห้อง</th>
              <th className="py-3.5 px-4 font-semibold text-right">เงินประกันตั้งต้น</th>
              <th className="py-3.5 px-4 font-semibold min-w-[200px]">รายละเอียดค่าเสียหายที่หัก</th>
              <th className="py-3.5 px-4 font-semibold text-right">ยอดที่ถูกหัก</th>
              <th className="py-3.5 px-4 font-semibold text-right">ยอดคืนสุทธิ</th>
              <th className="py-3.5 px-4 font-semibold">วันที่คืนเงินประกัน</th>
              <th className="py-3.5 px-4 font-semibold">สถานะการคืน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {depositRefunds.map((ref) => (
              <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">{ref.tenantName}</td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="font-bold text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-200">
                    {ref.roomNumber}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap font-medium">
                  ฿{ref.originalDeposit?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600">
                  {ref.deductions?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5">
                      {ref.deductions.map((d, i) => (
                        <li key={i}>
                          {d.item} (฿{d.amount.toLocaleString()})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">ไม่มีรายการหัก</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-rose-600 whitespace-nowrap">
                  -฿{ref.totalDeducted?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-sky-800 whitespace-nowrap">
                  ฿{ref.netRefund?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">{ref.refundDate}</td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                      ref.status === "refunded"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : ref.status === "pending"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                    }`}
                  >
                    {ref.status === "refunded" && "โอนคืนแล้ว"}
                    {ref.status === "pending" && "รอดำเนินการ"}
                    {ref.status === "active_contract" && "สัญญาคุ้มครองอยู่"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: 1.3.2.23 บันทึกรายการหักเงินประกัน */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="บันทึกรายการหักเงินประกันและคืนเงิน (Record Deposit Deduction & Refund)"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เลือกผู้เช่าที่แจ้งย้ายออก <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (ห้อง {t.assignedRoom})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดค่าเสียหายที่ถูกหัก
            </label>
            <textarea
              rows="2"
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              placeholder="เช่น ทำความสะอาดห้องพัก 800 บ., ทาสีผนัง 500 บ."
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                จำนวนเงินที่ถูกหักรวม (บาท) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={damageAmount}
                onChange={(e) => setDamageAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะการคืนเงินประกัน <span className="text-rose-500">*</span>
              </label>
              <select
                value={refundStatus}
                onChange={(e) => setRefundStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="refunded">โอนคืนเรียบร้อยแล้ว</option>
                <option value="pending">รอเจ้าหน้าที่ตรวจสอบ/โอนเงิน</option>
              </select>
            </div>
          </div>

          {refundStatus === "refunded" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่คืนเงินประกัน <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={refundDate}
                onChange={(e) => setRefundDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}

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
              บันทึกข้อมูลเงินประกัน
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
