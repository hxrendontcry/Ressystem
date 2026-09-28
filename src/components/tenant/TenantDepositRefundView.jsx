// src/components/tenant/TenantDepositRefundView.jsx
import React from "react";
import { ShieldCheck, Banknote, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const TenantDepositRefundView = () => {
  const { currentDepositRefund, currentContract, currentTenant } = useApp();

  // If active contract without move-out, show active deposit status
  const depositInfo = currentDepositRefund || {
    originalDeposit: currentContract?.depositAmount || 9000,
    deductions: [],
    totalDeducted: 0,
    netRefund: currentContract?.depositAmount || 9000,
    status: "active_contract",
    refundDate: "-",
    destinationBank: `${currentTenant?.bankName} ${currentTenant?.bankAccountNumber} (${currentTenant?.bankAccountName})`,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                รายละเอียดเงินประกันและการคืนเงิน (Security Deposit Refund)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                การดูแลเงินมัดจำความเสียหายและการคำนวณเงินคืนเมื่อสิ้นสุดสัญญาเช่า
              </p>
            </div>
          </div>

          <div>
            {depositInfo.status === "refunded" ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-4 h-4" />
                <span>โอนคืนเรียบร้อยแล้ว</span>
              </span>
            ) : depositInfo.status === "pending" ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-4 h-4" />
                <span>อยู่ระหว่างตรวจสอบความเสียหาย</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <ShieldCheck className="w-4 h-4" />
                <span>เงินประกันคุ้มครองสัญญาอยู่</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
          <span className="text-xs text-slate-400 block">จำนวนเงินประกันเริ่มต้น</span>
          <span className="text-2xl font-bold text-slate-800 mt-1 block">
            ฿{depositInfo.originalDeposit?.toLocaleString()}
          </span>
          <span className="text-2xs text-slate-500 mt-1 block">ตามสัญญาเช่าเริ่มต้น</span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
          <span className="text-xs text-slate-400 block">รวมค่าเสียหาย/หนี้ค้างที่ถูกหัก</span>
          <span className="text-2xl font-bold text-rose-600 mt-1 block">
            -฿{depositInfo.totalDeducted?.toLocaleString()}
          </span>
          <span className="text-2xs text-slate-500 mt-1 block">
            {depositInfo.deductions.length} รายการที่ประเมิน
          </span>
        </div>

        <div className="bg-sky-50/60 rounded-2xl border border-sky-200 p-5 shadow-xs">
          <span className="text-xs text-sky-700 font-semibold block">ยอดเงินประกันคืนสุทธิ</span>
          <span className="text-2xl font-bold text-sky-800 mt-1 block">
            ฿{depositInfo.netRefund?.toLocaleString()}
          </span>
          <span className="text-2xs text-sky-600 mt-1 block">
            โอนเข้าบัญชีผู้เช่าที่ระบุไว้
          </span>
        </div>
      </div>

      {/* Deductions Breakdown */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800">
          รายการตรวจสอบและค่าใช้จ่ายที่ถูกหักจากเงินประกัน (Itemized Deductions)
        </h4>

        {depositInfo.deductions.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            ✨ ไม่มีรายการหักเงินประกันในขณะนี้ (ห้องพักอยู่ในสภาพปกติและไม่มีหนี้คงค้าง)
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3">ลำดับ</th>
                  <th className="py-2.5 px-3">รายละเอียดความเสียหาย / ค่าใช้จ่าย</th>
                  <th className="py-2.5 px-3 text-right">จำนวนเงินที่หัก (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {depositInfo.deductions.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium">{item.item}</td>
                    <td className="py-3 px-3 text-right text-rose-600 font-semibold">
                      -฿{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Destination Bank & Refund Details */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-800">
          บัญชีธนาคารสำหรับรับเงินประกันคืน (Refund Destination Account)
        </h4>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">บัญชีปลายทาง:</span>
            <span className="text-sm font-semibold text-slate-800">
              {currentTenant.bankName} - {currentTenant.bankAccountNumber}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              ชื่อบัญชี: <span className="font-medium text-slate-700">{currentTenant.bankAccountName}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">กำหนด/วันที่ดำเนินการคืน:</span>
            <span className="text-xs font-semibold text-sky-700">
              {depositInfo.refundDate || "ภายใน 7 วันหลังตรวจรับมอบห้องคืน"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
