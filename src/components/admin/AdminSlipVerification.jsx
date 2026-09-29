// src/components/admin/AdminSlipVerification.jsx
import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  FileCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Receipt,
  Download,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminSlipVerification = () => {
  const { invoices, adminVerifySlip, showToast } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Filter invoices that have payment details submitted or are pending verification
  const reviewInvoices = invoices.filter(
    (i) => i.status === "under_review" || (i.paymentDetails && i.status === "paid")
  );

  const handleApprove = (inv) => {
    adminVerifySlip(inv.invoiceNumber, "approve");
  };

  const openRejectModal = (inv) => {
    setSelectedInvoice(inv);
    setRejectReason("ยอดเงินไม่ตรงกับใบแจ้งหนี้ หรือหลักฐานสลิปไม่ชัดเจน");
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    adminVerifySlip(selectedInvoice.invoiceNumber, "reject", rejectReason);
    setIsRejectModalOpen(false);
  };

  const handleViewReceipt = (inv) => {
    setActiveReceipt(inv);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                ตรวจสอบสลิปและออกใบเสร็จ (Slip Verification API)
              </h3>
              <p className="text-xs text-slate-500">
                ระบบตรวจสลิปอัตโนมัติ (SlipOK API Simulation) อนุมัติยอด และออกใบเสร็จรับเงินอัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Slip Verification API เชื่อมต่อพร้อมใช้งาน</span>
        </span>
      </div>

      {/* Verification Cards List */}
      <div className="space-y-4">
        {reviewInvoices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-sky-100 text-xs">
            ไม่มีสลิปรอตรวจสอบในขณะนี้
          </div>
        ) : (
          reviewInvoices.map((inv) => {
            const isApproved = inv.status === "paid";
            const details = inv.paymentDetails || {};

            return (
              <div
                key={inv.invoiceNumber}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                  isApproved ? "border-slate-200" : "border-amber-300 ring-1 ring-amber-200"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Slip Photo Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block">
                      หลักฐานการโอนเงิน (สลิป)
                    </span>
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56 relative group">
                      <img
                        src={details.slipUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80"}
                        alt="สลิปโอนเงิน"
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs bg-white text-slate-800 px-3 py-1 rounded-lg font-medium shadow-md">
                          ดูสลิปขนาดใหญ่
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Details & API Auto Check Result */}
                  <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
                    <div>
                      {/* Title & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-slate-800">
                              ห้อง {inv.roomNumber} - {inv.tenantName}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              ({inv.invoiceNumber})
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            รอบบิล: {inv.billingMonthYear} | ยอดเรียกเก็บ:{" "}
                            <span className="font-bold text-slate-800">
                              ฿{inv.netTotal.toLocaleString()}
                            </span>
                          </span>
                        </div>

                        <div>
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>อนุมัติและออกใบเสร็จแล้ว</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              <span>รอเจ้าหน้าที่ยืนยัน</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Transferred details grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-2xs text-slate-400 block">จำนวนเงินที่โอน:</span>
                          <span className="font-bold text-sm text-sky-800">
                            ฿{details.transferAmount?.toLocaleString() || inv.netTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-2xs text-slate-400 block">วันเวลาโอนเงิน:</span>
                          <span className="font-medium text-slate-800">
                            {details.transferDateTime || "-"}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-2xs text-slate-400 block">ธนาคารต้นทาง:</span>
                          <span className="font-medium text-slate-800">
                            {details.sourceBank || "-"}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-2xs text-slate-400 block">ชื่อบัญชีต้นทาง:</span>
                          <span className="font-medium text-slate-800">
                            {details.sourceAccountName || "-"}
                          </span>
                        </div>
                      </div>

                      {/* 1.3.2.19 Slip Verification API Result */}
                      <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-emerald-900 block">
                            ผลตรวจสลิปอัตโนมัติ (Slip Verification API):
                          </span>
                          <span className="text-emerald-700">
                            {details.slipVerifyResult || "สลิปถูกต้อง ยอดเงินตรง ธนาคารยืนยัน"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (Approve / Reject / View Receipt) */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {!isApproved ? (
                        <>
                          <button
                            onClick={() => openRejectModal(inv)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold hover:bg-rose-100"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>ปฏิเสธสลิป</span>
                          </button>
                          <button
                            onClick={() => handleApprove(inv)}
                            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>อนุมัติและออกใบเสร็จอัตโนมัติ</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleViewReceipt(inv)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold hover:bg-sky-100"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>ดูใบเสร็จรับเงิน</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: 1.3.2.19 Reject Slip */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="ปฏิเสธการชำระเงิน (Reject Payment)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            ระบุเหตุผลในการปฏิเสธ ระบบจะส่งข้อความแจ้งเตือนผู้เช่าผ่าน Email และ LINE ให้ส่งหลักฐานใหม่
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เหตุผลการปฏิเสธ <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-xs"
            >
              ยืนยันการปฏิเสธ
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: ดูใบเสร็จรับเงินอัตโนมัติ */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="ใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Receipt)"
        maxWidth="max-w-md"
      >
        {activeReceipt && (
          <div className="space-y-4 border border-slate-200 p-5 rounded-xl bg-slate-50">
            <div className="text-center pb-3 border-b border-slate-200">
              <h4 className="font-bold text-base text-slate-800">สุขสบาย เรสซิเดนซ์</h4>
              <p className="text-2xs text-slate-500">ใบเสร็จรับเงิน (Official Receipt)</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">เลขที่ใบเสร็จ:</span>
                <span className="font-mono font-bold text-sky-800">
                  {activeReceipt.receipt?.receiptNumber || "REC-202609-0012"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">อ้างอิงใบแจ้งหนี้:</span>
                <span className="font-mono text-slate-700">{activeReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ชื่อผู้เช่า:</span>
                <span className="font-semibold text-slate-800">{activeReceipt.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">เลขห้องพัก:</span>
                <span className="font-bold text-slate-800">ห้อง {activeReceipt.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">วันที่ชำระเงิน:</span>
                <span className="text-slate-800">{activeReceipt.receipt?.paidDate || "2026-09-02"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">วันที่ออกใบเสร็จ:</span>
                <span className="text-slate-800">
                  {activeReceipt.receipt?.issuedDate || "2026-09-02 19:10:00"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                <span>จำนวนเงินที่ชำระ:</span>
                <span className="text-sky-700">
                  ฿{(activeReceipt.receipt?.paidAmount || activeReceipt.netTotal).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => {
                  showToast("ดาวน์โหลดใบเสร็จรับเงิน PDF เรียบร้อย", "success");
                  setIsReceiptModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>พิมพ์ / ดาวน์โหลด PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
