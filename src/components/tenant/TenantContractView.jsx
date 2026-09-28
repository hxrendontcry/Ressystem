// src/components/tenant/TenantContractView.jsx
import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Calendar,
  ShieldCheck,
  BellRing,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const TenantContractView = () => {
  const {
    currentContract,
    confirmContract,
    requestRenewal,
    requestMoveOut,
    showToast,
  } = useApp();

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewalMonths, setRenewalMonths] = useState(12);
  const [renewalNote, setRenewalNote] = useState("");

  const [isMoveOutModalOpen, setIsMoveOutModalOpen] = useState(false);
  const [moveOutDate, setMoveOutDate] = useState("");
  const [moveOutReason, setMoveOutReason] = useState("");

  if (!currentContract) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-sky-100">
        ไม่พบข้อมูลสัญญาเช่าในระบบ กรุณาติดต่อผู้ดูแลหอพัก
      </div>
    );
  }

  // Handle PDF Download Simulation
  const handleDownloadPdf = () => {
    showToast(`กำลังเตรียมดาวน์โหลดเอกสารสัญญาเช่า ${currentContract.contractNumber}.pdf...`);
    setTimeout(() => {
      showToast(`ดาวน์โหลดเอกสารสัญญาเช่าเรียบร้อยแล้ว`, "success");
    }, 1200);
  };

  const handleRenewalSubmit = (e) => {
    e.preventDefault();
    requestRenewal(currentContract.contractNumber, Number(renewalMonths), renewalNote);
    setIsRenewModalOpen(false);
    setRenewalNote("");
  };

  const handleMoveOutSubmit = (e) => {
    e.preventDefault();
    if (!moveOutDate) {
      showToast("กรุณาระบุวันที่ต้องการย้ายออก", "error");
      return;
    }
    requestMoveOut(currentContract.contractNumber, moveOutDate, moveOutReason);
    setIsMoveOutModalOpen(false);
    setMoveOutReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Card */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-800">
                  สัญญาเช่าห้องพัก: {currentContract.contractNumber}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  มีผลบังคับใช้
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ผู้เช่า: <span className="text-slate-700 font-medium">{currentContract.tenantName}</span> | ห้อง {currentContract.roomNumber} ({currentContract.roomType})
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดสัญญา (PDF)</span>
            </button>
            <button
              onClick={() => setIsRenewModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 shadow-xs transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>ยื่นขอต่ออายุสัญญา</span>
            </button>
            <button
              onClick={() => setIsMoveOutModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>แจ้งย้ายออก</span>
            </button>
          </div>
        </div>

        {/* Contract Key Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block">วันเริ่มต้นสัญญา</span>
            <span className="text-sm font-semibold text-slate-800">{currentContract.startDate}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block">วันสิ้นสุดสัญญา</span>
            <span className="text-sm font-semibold text-slate-800 text-sky-700">{currentContract.endDate}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block">ค่าเช่าห้องพัก</span>
            <span className="text-sm font-semibold text-slate-800">
              ฿{currentContract.rentAmount?.toLocaleString()} / เดือน
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block">เงินประกันความเสียหาย</span>
            <span className="text-sm font-semibold text-emerald-700">
              ฿{currentContract.depositAmount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 1.3.1.8 Contract Confirmation Status Banner */}
        <div className="mt-6 p-4 rounded-xl border bg-emerald-50/70 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950">
                ยืนยันการรับทราบสัญญาและข้อตกลงแล้ว
              </p>
              <p className="text-xs text-emerald-700">
                ระบบได้บันทึกวันและเวลาที่ยืนยัน: {currentContract.confirmedAt || "2026-01-15 10:30:25"}
              </p>
            </div>
          </div>
          {!currentContract.confirmedByTenant && (
            <button
              onClick={() => confirmContract(currentContract.contractNumber)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
            >
              กดยืนยันรับทราบสัญญา
            </button>
          )}
        </div>

        {/* 1.3.1.9 LINE OA Reminder Preview */}
        <div className="mt-4 p-4 rounded-xl border bg-sky-50/50 border-sky-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-800">
                ระบบแจ้งเตือนสัญญาหมดอายุล่วงหน้าผ่าน LINE OA
              </p>
              <p className="text-xs text-slate-500">
                ตั้งค่าส่งแจ้งเตือนอัตโนมัติก่อนสัญญาหมดอายุ {currentContract.lineNotificationDaysBeforeExpiry} วัน
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-white text-sky-700 border border-sky-200 rounded-lg font-medium">
            เปิดใช้งานแล้ว
          </span>
        </div>
      </div>

      {/* Contract Terms & Conditions Section */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <h4 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <span>เงื่อนไขและข้อตกลงตามสัญญาเช่า (Terms & Conditions)</span>
        </h4>
        <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
          {currentContract.terms.map((term, index) => (
            <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                {index + 1}
              </span>
              <span className="leading-relaxed">{term}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 1.3.1.11 Renewal Status Tracking */}
      {currentContract.renewalRequest && (
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
          <h4 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>สถานะคำขอต่ออายุสัญญาเช่า (Renewal Request Status)</span>
          </h4>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-800 font-medium">
                วันที่ยื่นคำขอ: {currentContract.renewalRequest.requestedAt}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                currentContract.renewalRequest.status === "approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : currentContract.renewalRequest.status === "rejected"
                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}>
                {currentContract.renewalRequest.status === "approved" && "อนุมัติแล้ว"}
                {currentContract.renewalRequest.status === "rejected" && "ปฏิเสธคำขอ"}
                {currentContract.renewalRequest.status === "pending" && "รอดำเนินการตรวจสอบ"}
              </span>
            </div>
            <p className="text-xs text-slate-700">
              ระยะเวลาที่ขอต่อ: <span className="font-semibold">{currentContract.renewalRequest.requestedMonths} เดือน</span>
            </p>
            {currentContract.renewalRequest.note && (
              <p className="text-xs text-slate-600">
                หมายเหตุ: {currentContract.renewalRequest.note}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Move-out Request Status */}
      {currentContract.moveOutRequest && (
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs">
          <h4 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>สถานะคำขอแจ้งออกจากห้องพัก (Move-out Request)</span>
          </h4>
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-800 font-medium">
                วันที่ยื่นเรื่อง: {currentContract.moveOutRequest.requestedAt}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-300">
                {currentContract.moveOutRequest.status === "approved" ? "ยืนยันวันย้ายออกแล้ว" : "รอผู้ดูแลตรวจสอบ"}
              </span>
            </div>
            <p className="text-xs text-slate-700">
              วันที่ประสงค์ย้ายออก: <span className="font-semibold">{currentContract.moveOutRequest.moveOutDate}</span>
            </p>
            {currentContract.moveOutRequest.reason && (
              <p className="text-xs text-slate-600">
                เหตุผล: {currentContract.moveOutRequest.reason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal: Request Renewal (1.3.1.10) */}
      <Modal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        title="ยื่นคำขอต่ออายุสัญญาเช่าห้องพัก"
      >
        <form onSubmit={handleRenewalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เลขที่สัญญาปัจจุบัน
            </label>
            <input
              type="text"
              readOnly
              value={currentContract.contractNumber}
              className="w-full px-3 py-2 bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ระยะเวลาที่ต้องการต่อสัญญา
            </label>
            <select
              value={renewalMonths}
              onChange={(e) => setRenewalMonths(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs text-slate-800 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="6">6 เดือน</option>
              <option value="12">1 ปี (12 เดือน)</option>
              <option value="24">2 ปี (24 เดือน)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เหตุผลหรือหมายเหตุเพิ่มเติม (ถ้ามี)
            </label>
            <textarea
              rows="3"
              value={renewalNote}
              onChange={(e) => setRenewalNote(e.target.value)}
              placeholder="ระบุความประสงค์เพิ่มเติม..."
              className="w-full px-3 py-2 bg-white rounded-lg text-xs text-slate-800 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRenewModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              ส่งคำขอต่อสัญญา
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Request Move-out (1.3.1.12) */}
      <Modal
        isOpen={isMoveOutModalOpen}
        onClose={() => setIsMoveOutModalOpen(false)}
        title="ยื่นคำขอแจ้งออกจากห้องพัก (Move-out Request)"
      >
        <form onSubmit={handleMoveOutSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            ℹ️ ตามระเบียบของหอพัก ผู้เช่าต้องยื่นคำขอล่วงหน้าอย่างน้อย 30 วัน เพื่อความสะดวกในการตรวจห้องและคำนวณเงินประกันคืน
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              วันที่ต้องการย้ายออกจริง <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={moveOutDate}
              onChange={(e) => setMoveOutDate(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs text-slate-800 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เหตุผลในการย้ายออก
            </label>
            <textarea
              rows="3"
              value={moveOutReason}
              onChange={(e) => setMoveOutReason(e.target.value)}
              placeholder="เช่น ย้ายที่ทำงาน, เรียนจบการศึกษา, ซื้อที่อยู่อาศัยใหม่..."
              className="w-full px-3 py-2 bg-white rounded-lg text-xs text-slate-800 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsMoveOutModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-xs"
            >
              ยืนยันการแจ้งย้ายออก
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
