// src/components/tenant/TenantBillsView.jsx
import React, { useState } from "react";
import {
  Receipt,
  QrCode,
  Upload,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Droplet,
  Zap,
  Wifi,
  BellRing,
  CreditCard,
  Building,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const TenantBillsView = () => {
  const { currentInvoices, submitSlipPayment, showToast, currentTenant } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState(
    currentInvoices.find((i) => i.status !== "paid") || currentInvoices[0]
  );
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Payment form state
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferTime, setTransferTime] = useState("");
  const [sourceAccountName, setSourceAccountName] = useState(currentTenant?.name || "");
  const [sourceBank, setSourceBank] = useState("กสิกรไทย (KBANK)");

  if (!selectedInvoice) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-sky-100">
        ยังไม่มีรายการใบแจ้งค่าใช้จ่ายในระบบ
      </div>
    );
  }

  const handleOpenPayModal = (inv) => {
    setSelectedInvoice(inv);
    setTransferAmount(inv.netTotal);
    const now = new Date();
    setTransferDate(now.toISOString().split("T")[0]);
    setTransferTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    setIsPayModalOpen(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!transferAmount) {
      showToast("กรุณากรอกยอดเงินที่โอน", "error");
      return;
    }

    const paymentInfo = {
      transferAmount: Number(transferAmount),
      transferDateTime: `${transferDate} ${transferTime}`,
      sourceAccountName,
      sourceBank,
      slipUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80",
    };

    submitSlipPayment(selectedInvoice.invoiceNumber, paymentInfo);
    setIsPayModalOpen(false);
  };

  const handleDownloadReceipt = (inv) => {
    showToast(`กำลังดาวน์โหลดใบเสร็จรับเงิน ${inv.receipt?.receiptNumber || inv.invoiceNumber}.pdf...`);
    setTimeout(() => {
      showToast("ดาวน์โหลดใบเสร็จรับเงิน (PDF) สำเร็จ", "success");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* LINE Notification reminder banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-900">
              การแจ้งเตือนค่าเช่าและบิลผ่าน LINE OA
            </h4>
            <p className="text-xs text-emerald-700">
              ระบบส่งการแจ้งเตือนก่อนถึงกำหนดชำระ 3 วัน และส่งแจ้งเตือนหากมีรายการค้างชำระอัตโนมัติ
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-xs font-medium px-3 py-1 bg-white text-emerald-800 border border-emerald-200 rounded-lg">
          เชื่อมต่อแล้ว ✅
        </span>
      </div>

      {/* Main Grid: Invoice Selector List & Current Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Invoices & History */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">รายการใบแจ้งหนี้ / ประวัติ</h3>
            <span className="text-xs text-slate-400">{currentInvoices.length} รายการ</span>
          </div>

          <div className="space-y-2.5">
            {currentInvoices.map((inv) => {
              const isSelected = selectedInvoice.invoiceNumber === inv.invoiceNumber;
              const isPaid = inv.status === "paid";
              const isReview = inv.status === "under_review";
              const isOverdue = inv.status === "overdue";

              return (
                <div
                  key={inv.invoiceNumber}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-400"
                      : "border-slate-200 hover:border-sky-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">
                      รอบ {inv.billingMonthYear}
                    </span>
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : isReview
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : isOverdue
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-sky-100 text-sky-800 border border-sky-200"
                      }`}
                    >
                      {isPaid && "ชำระแล้ว"}
                      {isReview && "รอตรวจสอบสลิป"}
                      {isOverdue && "ค้างชำระ"}
                      {inv.status === "pending_payment" && "รอชำระเงิน"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xs text-slate-400">{inv.invoiceNumber}</span>
                    <span className="text-sm font-bold text-sky-900">
                      ฿{inv.netTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Invoice Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800">
                  ใบแจ้งค่าใช้จ่ายห้องพัก ({selectedInvoice.billingMonthYear})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                เลขที่: <span className="font-mono text-slate-700">{selectedInvoice.invoiceNumber}</span> | ออกเมื่อ: {selectedInvoice.issueDate} | ครบกำหนด: <span className="text-rose-600 font-semibold">{selectedInvoice.dueDate}</span>
              </p>
            </div>

            {/* Status & Action */}
            <div className="flex items-center gap-2">
              {selectedInvoice.status === "paid" ? (
                <button
                  onClick={() => handleDownloadReceipt(selectedInvoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดใบเสร็จ PDF</span>
                </button>
              ) : selectedInvoice.status === "under_review" ? (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>รอผู้ดูแลตรวจสอบสลิป</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenPayModal(selectedInvoice)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-sm transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>ชำระเงิน / แจ้งสลิป</span>
                </button>
              )}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="py-2.5 px-3 font-semibold">รายการค่าใช้จ่าย</th>
                  <th className="py-2.5 px-3 font-semibold text-center">มิเตอร์ก่อน</th>
                  <th className="py-2.5 px-3 font-semibold text-center">มิเตอร์หลัง</th>
                  <th className="py-2.5 px-3 font-semibold text-center">หน่วยที่ใช้</th>
                  <th className="py-2.5 px-3 font-semibold text-right">จำนวนเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Rent fee */}
                <tr>
                  <td className="py-3 px-3 font-medium">ค่าเช่าห้องพัก (Room Rent)</td>
                  <td className="py-3 px-3 text-center text-slate-400">-</td>
                  <td className="py-3 px-3 text-center text-slate-400">-</td>
                  <td className="py-3 px-3 text-center text-slate-400">1 เดือน</td>
                  <td className="py-3 px-3 text-right font-medium">
                    {selectedInvoice.rentFee.toLocaleString()}
                  </td>
                </tr>

                {/* Water fee */}
                <tr>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-sky-500" />
                      <span className="font-medium">ค่าน้ำประปา (18 บาท/หน่วย)</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">{selectedInvoice.prevWater}</td>
                  <td className="py-3 px-3 text-center font-semibold text-sky-700">
                    {selectedInvoice.currWater}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    {selectedInvoice.waterUnits} หน่วย
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {selectedInvoice.waterAmount.toLocaleString()}
                  </td>
                </tr>

                {/* Electric fee */}
                <tr>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-medium">ค่าไฟฟ้า (8 บาท/หน่วย)</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">{selectedInvoice.prevElectric}</td>
                  <td className="py-3 px-3 text-center font-semibold text-amber-700">
                    {selectedInvoice.currElectric}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    {selectedInvoice.electricUnits} หน่วย
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {selectedInvoice.electricAmount.toLocaleString()}
                  </td>
                </tr>

                {/* Internet */}
                <tr>
                  <td className="py-3 px-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-slate-400" />
                      <span>ค่าบริการอินเทอร์เน็ตความเร็วสูง</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-400">-</td>
                  <td className="py-3 px-3 text-center text-slate-400">-</td>
                  <td className="py-3 px-3 text-center text-slate-400">1 เดือน</td>
                  <td className="py-3 px-3 text-right font-medium">
                    {selectedInvoice.internetFee.toLocaleString()}
                  </td>
                </tr>

                {/* Service fee */}
                <tr>
                  <td className="py-3 px-3 font-medium">ค่าบริการส่วนกลางและเก็บขยะ</td>
                  <td className="py-3 px-3 text-center text-slate-400">-</td>
                  <td className="py-3 px-3 text-center text-slate-400">-</td>
                  <td className="py-3 px-3 text-center text-slate-400">1 เดือน</td>
                  <td className="py-3 px-3 text-right font-medium">
                    {selectedInvoice.additionalServiceFee.toLocaleString()}
                  </td>
                </tr>

                {/* Late fee if any */}
                {selectedInvoice.lateFee > 0 && (
                  <tr className="bg-rose-50/50 text-rose-800">
                    <td className="py-3 px-3 font-medium">ค่าปรับกรณีชำระล่าช้า (Late Penalty)</td>
                    <td className="py-3 px-3 text-center text-slate-400">-</td>
                    <td className="py-3 px-3 text-center text-slate-400">-</td>
                    <td className="py-3 px-3 text-center text-rose-600 font-semibold">-</td>
                    <td className="py-3 px-3 text-right font-semibold text-rose-700">
                      {selectedInvoice.lateFee.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-sky-50/60 text-slate-900 border-t-2 border-sky-300">
                  <td colSpan="4" className="py-3.5 px-3 font-bold text-sm text-right">
                    ยอดรวมสุทธิที่ต้องชำระ (Net Total):
                  </td>
                  <td className="py-3.5 px-3 font-bold text-base text-right text-sky-700">
                    ฿{selectedInvoice.netTotal.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Paid details if already submitted */}
          {selectedInvoice.paymentDetails && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ข้อมูลหลักฐานการโอนเงิน (Payment Submission)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">ยอดที่โอน:</span>
                  <span className="font-semibold text-slate-800">
                    ฿{selectedInvoice.paymentDetails.transferAmount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">วันเวลาโอน:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInvoice.paymentDetails.transferDateTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">ธนาคารต้นทาง:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInvoice.paymentDetails.sourceBank}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">ชื่อบัญชี:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInvoice.paymentDetails.sourceAccountName}
                  </span>
                </div>
              </div>
              <div className="text-2xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ผลตรวจอัตโนมัติ: {selectedInvoice.paymentDetails.slipVerifyResult}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Payment & Slip Upload Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`ชำระเงินและแจ้งสลิป - บิล ${selectedInvoice.invoiceNumber}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          {/* PromptPay QR Code Box with Embedded Amount */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
            <span className="text-xs font-semibold text-sky-800 block">
              สแกน QR Code PromptPay แบบฝังยอดสุทธิ
            </span>
            <div className="my-3 inline-block p-3 bg-white rounded-xl shadow-xs border border-slate-200">
              <div className="w-40 h-40 bg-slate-900 mx-auto rounded-lg flex flex-col items-center justify-center text-white p-2 relative">
                <QrCode className="w-28 h-28 text-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sky-700 shadow-md">
                    <Building className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-2xs font-mono tracking-wider mt-1 text-sky-200">
                  PROMPTPAY QR
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-600">
              ยอดชำระอัตโนมัติ:{" "}
              <span className="text-base font-bold text-sky-700">
                ฿{selectedInvoice.netTotal.toLocaleString()}
              </span>
            </div>
            <p className="text-2xs text-slate-400 mt-1">
              บัญชีพร้อมเพย์: หอพักสุขสบาย (089-123-XXXX)
            </p>
          </div>

          {/* Transfer Info Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                จำนวนเงินที่โอน (บาท) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ธนาคารต้นทาง <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceBank}
                onChange={(e) => setSourceBank(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="กสิกรไทย (KBANK)">กสิกรไทย (KBANK)</option>
                <option value="ไทยพาณิชย์ (SCB)">ไทยพาณิชย์ (SCB)</option>
                <option value="กรุงเทพ (BBL)">กรุงเทพ (BBL)</option>
                <option value="กรุงไทย (KTB)">กรุงไทย (KTB)</option>
                <option value="ทหารไทยธนชาต (ttb)">ทหารไทยธนชาต (ttb)</option>
                <option value="พร้อมเพย์ PromptPay">พร้อมเพย์ PromptPay</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่โอนเงิน <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เวลาโอนเงิน <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={transferTime}
                onChange={(e) => setTransferTime(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อบัญชีธนาคารต้นทาง <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={sourceAccountName}
              onChange={(e) => setSourceAccountName(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Slip File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อัปโหลดหลักฐานการโอนเงิน (สลิป) <span className="text-rose-500">*</span>
            </label>
            <div className="p-3 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 text-center hover:bg-sky-50 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-sky-600 mx-auto mb-1" />
              <p className="text-xs text-slate-700 font-medium">
                คลิกเพื่อเลือกไฟล์ หรือลากสลิปมาวางที่นี่
              </p>
              <span className="text-2xs text-slate-400">
                รองรับไฟล์ PDF / JPG / PNG ขนาดไม่เกิน 3 MB
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPayModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              ยืนยันการชำระเงิน
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
