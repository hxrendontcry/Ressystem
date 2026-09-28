// src/components/admin/AdminPaymentHistory.jsx
import React, { useState } from "react";
import { Receipt, Search, Filter, Download, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminPaymentHistory = () => {
  const { invoices, showToast } = useApp();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter((inv) => {
    const matchStatus = filterStatus === "all" || inv.status === filterStatus;
    const matchSearch =
      inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.roomNumber.includes(searchTerm) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDownloadPdf = (inv) => {
    showToast(`กำลังดาวน์โหลดใบเสร็จรับเงิน ${inv.receipt?.receiptNumber || inv.invoiceNumber}.pdf...`);
    setTimeout(() => {
      showToast("ดาวน์โหลดไฟล์ใบเสร็จ (PDF) สำเร็จ", "success");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            ประวัติการชำระเงินและรายการค้างชำระ (Payment History & Overdue Ledger)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            สืบค้นข้อมูลประวัติใบเสร็จ ยอดรับชำระ และรายการค้างชำระของผู้เช่าทุกห้อง (1.3.2.22)
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, ห้อง, เลขที่บิล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="paid">ชำระแล้ว</option>
            <option value="under_review">รอตรวจสอบ</option>
            <option value="overdue">ค้างชำระ</option>
          </select>
        </div>
      </div>

      {/* 1.3.2.22 Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3 px-3 font-semibold">เลขที่ใบแจ้งหนี้</th>
              <th className="py-3 px-3 font-semibold">เลขที่ใบเสร็จ</th>
              <th className="py-3 px-3 font-semibold">ชื่อผู้เช่า</th>
              <th className="py-3 px-3 font-semibold text-center">ห้อง</th>
              <th className="py-3 px-3 font-semibold">เดือน/ปี</th>
              <th className="py-3 px-3 font-semibold text-right">ยอดที่เรียกเก็บ</th>
              <th className="py-3 px-3 font-semibold text-right">ยอดที่ชำระ</th>
              <th className="py-3 px-3 font-semibold">วันที่ชำระเงิน</th>
              <th className="py-3 px-3 font-semibold">สถานะการชำระเงิน</th>
              <th className="py-3 px-3 font-semibold text-center">เอกสาร</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredInvoices.map((inv) => (
              <tr key={inv.invoiceNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-mono font-semibold text-sky-900">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 px-3 font-mono text-2xs text-slate-500">
                  {inv.receipt?.receiptNumber || "-"}
                </td>
                <td className="py-3 px-3 font-medium text-slate-800">{inv.tenantName}</td>
                <td className="py-3 px-3 text-center">
                  <span className="font-bold text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                    {inv.roomNumber}
                  </span>
                </td>
                <td className="py-3 px-3">{inv.billingMonthYear}</td>
                <td className="py-3 px-3 text-right font-medium">
                  ฿{inv.netTotal.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">
                  {inv.status === "paid"
                    ? `฿${(inv.receipt?.paidAmount || inv.netTotal).toLocaleString()}`
                    : "-"}
                </td>
                <td className="py-3 px-3 text-2xs text-slate-600">
                  {inv.receipt?.paidDate || inv.paymentDetails?.transferDateTime || "-"}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`text-2xs font-semibold px-2.5 py-1 rounded-full border ${
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
                    {inv.status === "under_review" && "รอตรวจสอบ"}
                    {inv.status === "overdue" && "ค้างชำระ"}
                    {inv.status === "pending_payment" && "รอชำระ"}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  {inv.status === "paid" ? (
                    <button
                      onClick={() => handleDownloadPdf(inv)}
                      title="ดาวน์โหลดใบเสร็จรับเงิน PDF"
                      className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
