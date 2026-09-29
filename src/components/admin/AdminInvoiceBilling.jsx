// src/components/admin/AdminInvoiceBilling.jsx
import React, { useState } from "react";
import {
  FileText,
  PlusCircle,
  Mail,
  MessageCircle,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Send,
  Eye,
  CreditCard,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminInvoiceBilling = () => {
  const {
    invoices,
    tenants,
    rooms,
    utilityRates,
    adminGenerateInvoice,
    adminRecordManualPayment,
    adminSendNotification,
    showToast,
  } = useApp();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isManualPayModalOpen, setIsManualPayModalOpen] = useState(false);
  const [selectedInvoiceForManualPay, setSelectedInvoiceForManualPay] = useState(null);

  // Invoice Generation Form
  const [genRoomNumber, setGenRoomNumber] = useState("101");
  const [genMonthYear, setGenMonthYear] = useState("กันยายน 2569");
  const [genWaterUnits, setGenWaterUnits] = useState(9);
  const [genElectricUnits, setGenElectricUnits] = useState(115);
  const [genLateFee, setGenLateFee] = useState(0);

  // Manual payment form
  const [manualAmount, setManualAmount] = useState("");
  const [manualMethod, setManualMethod] = useState("เงินสด (Cash)");
  const [manualNote, setManualNote] = useState("ชำระที่สำนักงานนิติบุคคล");

  const handleOpenGenerate = () => {
    setIsGenerateModalOpen(true);
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    const room = rooms.find((r) => r.roomNumber === genRoomNumber);
    const tenant = tenants.find((t) => t.assignedRoom === genRoomNumber);
    const rentFee = room?.price || 4500;
    const waterAmount = genWaterUnits * utilityRates.waterRate;
    const electricAmount = genElectricUnits * utilityRates.electricityRate;
    const netTotal =
      rentFee +
      waterAmount +
      electricAmount +
      utilityRates.internetRate +
      utilityRates.serviceFee +
      Number(genLateFee);

    const now = new Date();
    const issueDate = now.toISOString().split("T")[0];
    const dueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      utilityRates.dueDayOfMonth
    ).padStart(2, "0")}`;

    const newInvoice = {
      invoiceNumber: `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${genRoomNumber}`,
      tenantId: tenant?.id || "T001",
      tenantName: tenant?.name || "ผู้เช่าห้อง",
      roomNumber: genRoomNumber,
      billingMonthYear: genMonthYear,
      issueDate,
      dueDate,
      rentFee,
      prevWater: 142,
      currWater: 142 + Number(genWaterUnits),
      waterUnits: Number(genWaterUnits),
      waterAmount,
      prevElectric: 1240,
      currElectric: 1240 + Number(genElectricUnits),
      electricUnits: Number(genElectricUnits),
      electricAmount,
      internetFee: utilityRates.internetRate,
      additionalServiceFee: utilityRates.serviceFee,
      lateFee: Number(genLateFee),
      netTotal,
      status: "pending_payment",
      meterPhotos: {
        water: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&auto=format&fit=crop&q=80",
        electric: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      },
      paymentDetails: null,
      receipt: null,
      sentViaEmail: true,
      sentViaLine: true,
    };

    adminGenerateInvoice(newInvoice);
    setIsGenerateModalOpen(false);
  };

  const handleOpenManualPay = (inv) => {
    setSelectedInvoiceForManualPay(inv);
    setManualAmount(inv.netTotal);
    setIsManualPayModalOpen(true);
  };

  const handleManualPaySubmit = (e) => {
    e.preventDefault();
    if (!manualAmount) return;

    adminRecordManualPayment(selectedInvoiceForManualPay.invoiceNumber, {
      amount: Number(manualAmount),
      method: manualMethod,
      note: manualNote,
    });
    setIsManualPayModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            ระบบออกใบแจ้งหนี้และการเรียกเก็บเงิน (Invoice & Billing)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            สร้างใบแจ้งค่าใช้จ่าย คำนวณค่าน้ำ-ค่าไฟอัตโนมัติ ส่ง Email / LINE และบันทึกการชำระเงิน
          </p>
        </div>

        <button
          onClick={handleOpenGenerate}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>สร้างใบแจ้งหนี้ประจำเดือน</span>
        </button>
      </div>

      {/* ติดตามสถานะการชำระเงิน Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-sm text-slate-800">
            รายการใบแจ้งหนี้ทั้งหมดและสถานะชำระเงิน
          </h4>
          <span className="text-xs text-slate-400">ทั้งหมด {invoices.length} รายการ</span>
        </div>

        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">เลขที่ใบแจ้งหนี้</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ผู้เช่า</th>
              <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">ห้อง</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">รอบเดือน/ปี</th>
              <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap">ยอดรวมสุทธิ</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">กำหนดชำระ</th>
              <th className="py-3.5 px-4 font-semibold text-center whitespace-nowrap">สถานะการชำระ</th>
              <th className="py-3.5 px-4 font-semibold text-center whitespace-nowrap">เตือน LINE</th>
              <th className="py-3.5 px-4 font-semibold text-center whitespace-nowrap">รับชำระ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {invoices.map((inv) => (
              <tr key={inv.invoiceNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-sky-900 whitespace-nowrap">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">{inv.tenantName}</td>
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200 inline-block">
                    ห้อง {inv.roomNumber}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">{inv.billingMonthYear}</td>
                <td className="py-3.5 px-4 text-right font-bold text-sky-800 whitespace-nowrap">
                  ฿{inv.netTotal.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${
                      inv.status === "paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : inv.status === "under_review"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : inv.status === "overdue"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                    }`}
                  >
                    {inv.status === "paid" && "ชำระแล้ว"}
                    {inv.status === "under_review" && "รอตรวจสลิป"}
                    {inv.status === "overdue" && "ค้างชำระ"}
                    {inv.status === "pending_payment" && "รอชำระเงิน"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => adminSendNotification(inv.invoiceNumber, "LINE OA")}
                    title="ส่งการแจ้งเตือนยอดชำระไปยัง LINE ของผู้เช่า"
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 inline-flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {inv.status !== "paid" ? (
                    <button
                      onClick={() => handleOpenManualPay(inv)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 whitespace-nowrap"
                    >
                      รับชำระสด
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium whitespace-nowrap">✓ เสร็จสิ้น</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: 1.3.2.15 สร้างใบแจ้งค่าใช้จ่ายประจำเดือน */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="สร้างใบแจ้งค่าใช้จ่ายประจำเดือน (Auto-Calculate Monthly Invoice)"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลือกห้องพัก <span className="text-rose-500">*</span>
              </label>
              <select
                value={genRoomNumber}
                onChange={(e) => setGenRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    ห้อง {r.roomNumber} ({r.type} - ฿{r.price}/ด.)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รอบเดือน/ปี <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={genMonthYear}
                onChange={(e) => setGenMonthYear(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หน่วยน้ำที่ใช้ (หน่วย)
              </label>
              <input
                type="number"
                value={genWaterUnits}
                onChange={(e) => setGenWaterUnits(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หน่วยไฟที่ใช้ (หน่วย)
              </label>
              <input
                type="number"
                value={genElectricUnits}
                onChange={(e) => setGenElectricUnits(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ค่าปรับชำระล่าช้า (บาท)
              </label>
              <input
                type="number"
                value={genLateFee}
                onChange={(e) => setGenLateFee(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 1.3.2.16 Auto notification toggle note */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-2xs text-sky-800 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              <span>การจัดส่งอัตโนมัติ:</span>
            </div>
            <div>• ส่ง Email พร้อมแนบใบแจ้งหนี้ให้ผู้เช่าทันที</div>
            <div>• ส่ง LINE Notification ให้ผู้เช่าพร้อมลิงก์ดูใบแจ้งและ QR PromptPay ทันที</div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              ออกใบแจ้งหนี้และส่งการแจ้งเตือน
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: 1.3.2.20 บันทึกการชำระเงินด้วยตนเอง */}
      <Modal
        isOpen={isManualPayModalOpen}
        onClose={() => setIsManualPayModalOpen(false)}
        title={`บันทึกการชำระเงินด้วยตนเอง (Manual Payment) - ${selectedInvoiceForManualPay?.invoiceNumber}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleManualPaySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ยอดเงินที่ชำระ (บาท) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              วิธีการชำระ <span className="text-rose-500">*</span>
            </label>
            <select
              value={manualMethod}
              onChange={(e) => setManualMethod(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="เงินสด (Cash)">เงินสด (Cash)</option>
              <option value="โอนผ่านเคาน์เตอร์ธนาคาร">โอนผ่านเคาน์เตอร์ธนาคาร</option>
              <option value="บัตรเครดิต/เดบิต รูดที่เครื่อง EDC">บัตรเครดิต/เดบิต รูดที่เครื่อง EDC</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หมายเหตุ (ถ้ามี)
            </label>
            <textarea
              rows="2"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsManualPayModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs"
            >
              บันทึกและออกใบเสร็จ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
