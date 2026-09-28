// src/components/admin/AdminReportsExport.jsx
import React, { useState } from "react";
import { FileSpreadsheet, FileText, Download, Calendar, Filter, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminReportsExport = () => {
  const { invoices, repairs, utilityRates, showToast } = useApp();

  const [selectedReportType, setSelectedReportType] = useState("revenue");
  const [selectedPeriod, setSelectedPeriod] = useState("กันยายน 2569");

  const handleExport = (format) => {
    showToast(`กำลังประมวลผลและส่งออกรายงาน ${selectedReportType} (${selectedPeriod}) เป็นไฟล์ ${format.toUpperCase()}...`);
    setTimeout(() => {
      showToast(`ส่งออกไฟล์รายงาน ${format.toUpperCase()} สำเร็จเรียบร้อยแล้ว`, "success");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            ออกรายงานและส่งออกข้อมูล (Export Reports: Excel & PDF)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            เลือกช่วงเวลาและประเภทรายงานเพื่อสรุปข้อมูลบัญชี การใช้น้ำไฟ และงานซ่อม (1.3.2.30)
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("excel")}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-700 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-rose-700 shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF (.pdf)</span>
          </button>
        </div>
      </div>

      {/* Filter and Report Selection Controls */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ประเภทรายงานที่ต้องการออก (1.3.2.30)
          </label>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="revenue">1. รายงานสรุปรายรับประจำเดือน (Monthly Revenue)</option>
            <option value="overdue">2. รายงานรายการค้างชำระเงิน (Overdue Balances)</option>
            <option value="utilities">3. รายงานสรุปการใช้ค่าน้ำและค่าไฟฟ้า (Utilities Usage)</option>
            <option value="repairs">4. รายงานสรุปประวัติการแจ้งซ่อม (Maintenance History)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            เลือกช่วงเวลา (เดือน/ปี)
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="กันยายน 2569">กันยายน 2569</option>
            <option value="สิงหาคม 2569">สิงหาคม 2569</option>
            <option value="กรกฎาคม 2569">กรกฎาคม 2569</option>
            <option value="ไตรมาส 3/2569">ไตรมาส 3 (ก.ค. - ก.ย. 2569)</option>
          </select>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ตัวอย่างข้อมูลในรายงาน (Report Preview)
          </span>
          <span className="text-2xs text-slate-400">
            ช่วงเวลา: {selectedPeriod}
          </span>
        </div>

        {/* 1. Monthly Revenue Preview */}
        {selectedReportType === "revenue" && (
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3">ห้อง</th>
                <th className="py-2.5 px-3">ผู้เช่า</th>
                <th className="py-2.5 px-3 text-right">ค่าเช่า</th>
                <th className="py-2.5 px-3 text-right">ค่าน้ำ</th>
                <th className="py-2.5 px-3 text-right">ค่าไฟ</th>
                <th className="py-2.5 px-3 text-right">อินเทอร์เน็ต/ส่วนกลาง</th>
                <th className="py-2.5 px-3 text-right">ยอดรวมสุทธิ</th>
                <th className="py-2.5 px-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.invoiceNumber}>
                  <td className="py-2.5 px-3 font-bold text-sky-900">ห้อง {inv.roomNumber}</td>
                  <td className="py-2.5 px-3 font-medium">{inv.tenantName}</td>
                  <td className="py-2.5 px-3 text-right">฿{inv.rentFee.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">฿{inv.waterAmount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">฿{inv.electricAmount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    ฿{(inv.internetFee + inv.additionalServiceFee).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-sky-800">
                    ฿{inv.netTotal.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-2xs px-2 py-0.5 rounded-full ${
                        inv.status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {inv.status === "paid" ? "ชำระแล้ว" : "ยังไม่ชำระ"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 2. Overdue Balances Preview */}
        {selectedReportType === "overdue" && (
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3">เลขที่ใบแจ้งหนี้</th>
                <th className="py-2.5 px-3">ห้อง</th>
                <th className="py-2.5 px-3">ผู้เช่า</th>
                <th className="py-2.5 px-3">รอบเดือน</th>
                <th className="py-2.5 px-3 text-right">ยอดค้างชำระ</th>
                <th className="py-2.5 px-3 text-right">ค่าปรับสะสม</th>
                <th className="py-2.5 px-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices
                .filter((i) => i.status === "overdue" || i.status === "pending_payment")
                .map((inv) => (
                  <tr key={inv.invoiceNumber}>
                    <td className="py-2.5 px-3 font-mono font-semibold">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-sky-900">ห้อง {inv.roomNumber}</td>
                    <td className="py-2.5 px-3 font-medium">{inv.tenantName}</td>
                    <td className="py-2.5 px-3">{inv.billingMonthYear}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                      ฿{inv.netTotal.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-500">
                      ฿{inv.lateFee.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                        {inv.status === "overdue" ? "ค้างชำระเกินกำหนด" : "รอชำระ"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* 3. Utilities Usage Preview */}
        {selectedReportType === "utilities" && (
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3">ห้อง</th>
                <th className="py-2.5 px-3">ผู้เช่า</th>
                <th className="py-2.5 px-3 text-center">หน่วยน้ำที่ใช้</th>
                <th className="py-2.5 px-3 text-right">ค่าน้ำ (฿{utilityRates.waterRate}/หน่วย)</th>
                <th className="py-2.5 px-3 text-center">หน่วยไฟที่ใช้</th>
                <th className="py-2.5 px-3 text-right">ค่าไฟ (฿{utilityRates.electricityRate}/หน่วย)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.invoiceNumber}>
                  <td className="py-2.5 px-3 font-bold text-sky-900">ห้อง {inv.roomNumber}</td>
                  <td className="py-2.5 px-3 font-medium">{inv.tenantName}</td>
                  <td className="py-2.5 px-3 text-center font-bold">{inv.waterUnits} หน่วย</td>
                  <td className="py-2.5 px-3 text-right text-sky-700 font-semibold">
                    ฿{inv.waterAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">{inv.electricUnits} หน่วย</td>
                  <td className="py-2.5 px-3 text-right text-amber-700 font-semibold">
                    ฿{inv.electricAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 4. Repairs History Preview */}
        {selectedReportType === "repairs" && (
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3">รหัสงาน</th>
                <th className="py-2.5 px-3">ห้อง</th>
                <th className="py-2.5 px-3">ประเภทปัญหา</th>
                <th className="py-2.5 px-3">ความเร่งด่วน</th>
                <th className="py-2.5 px-3">วันที่แจ้ง</th>
                <th className="py-2.5 px-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {repairs.map((rep) => (
                <tr key={rep.id}>
                  <td className="py-2.5 px-3 font-mono font-semibold">{rep.id}</td>
                  <td className="py-2.5 px-3 font-bold text-sky-900">ห้อง {rep.roomNumber}</td>
                  <td className="py-2.5 px-3">{rep.category}</td>
                  <td className="py-2.5 px-3">{rep.urgency}</td>
                  <td className="py-2.5 px-3 text-slate-500">{rep.createdAt}</td>
                  <td className="py-2.5 px-3 font-medium">
                    {rep.status === "completed"
                      ? "เสร็จสิ้น"
                      : rep.status === "in_progress"
                      ? "กำลังซ่อม"
                      : "รอดำเนินการ"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
