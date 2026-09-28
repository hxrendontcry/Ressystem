// src/components/admin/AdminMeterRecording.jsx
import React, { useState } from "react";
import {
  Gauge,
  Droplet,
  Zap,
  PlusCircle,
  History,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { initialMeters } from "../../data/mockData";
import { Modal } from "../common/Modal";

export const AdminMeterRecording = () => {
  const { rooms, utilityRates, adminRecordMeter, showToast } = useApp();

  const [meterLogs, setMeterLogs] = useState(initialMeters);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [billingMonthYear, setBillingMonthYear] = useState("กันยายน 2569");
  const [roomNumber, setRoomNumber] = useState("101");
  const [prevWater, setPrevWater] = useState(142);
  const [currWater, setCurrWater] = useState(151);
  const [prevElectric, setPrevElectric] = useState(1240);
  const [currElectric, setCurrElectric] = useState(1355);

  const handleOpenRecordModal = () => {
    setIsModalOpen(true);
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const waterUnits = Math.max(0, Number(currWater) - Number(prevWater));
    const electricUnits = Math.max(0, Number(currElectric) - Number(prevElectric));
    const waterAmount = waterUnits * utilityRates.waterRate;
    const electricAmount = electricUnits * utilityRates.electricityRate;

    const newLog = {
      monthYear: billingMonthYear,
      billingPeriod: "2026-09",
      roomNumber,
      prevWaterMeter: Number(prevWater),
      currWaterMeter: Number(currWater),
      waterUnits,
      waterAmount,
      prevElectricMeter: Number(prevElectric),
      currElectricMeter: Number(currElectric),
      electricUnits,
      electricAmount,
      recordedAt: new Date().toLocaleString("th-TH"),
    };

    setMeterLogs([newLog, ...meterLogs]);
    adminRecordMeter(newLog);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            บันทึกมิเตอร์น้ำและไฟฟ้าประจำเดือน (Meter Reading & Log)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            จดเลขมิเตอร์ คำนวณหน่วยที่ใช้อัตโนมัติ และดูประวัติการบันทึกย้อนหลัง
          </p>
        </div>

        <button
          onClick={handleOpenRecordModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>บันทึกเลขมิเตอร์ห้องพัก</span>
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-sky-600" />
          <span>ประวัติการบันทึกเลขมิเตอร์ย้อนหลัง (Historical Meter Logs)</span>
        </h4>

        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 whitespace-nowrap text-xs">
              <th className="py-3.5 px-4 font-semibold">รอบเดือน/ปี</th>
              <th className="py-3.5 px-4 font-semibold text-center">ห้อง</th>
              <th className="py-3.5 px-4 font-semibold text-center text-sky-700">มิเตอร์น้ำ (ก่อน - หลัง)</th>
              <th className="py-3.5 px-4 font-semibold text-center text-sky-700">หน่วยน้ำ (ค่าน้ำ)</th>
              <th className="py-3.5 px-4 font-semibold text-center text-amber-700">มิเตอร์ไฟ (ก่อน - หลัง)</th>
              <th className="py-3.5 px-4 font-semibold text-center text-amber-700">หน่วยไฟ (ค่าไฟ)</th>
              <th className="py-3.5 px-4 font-semibold text-center">วันที่บันทึก</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {meterLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                <td className="py-3.5 px-4 font-medium text-slate-800">{log.monthYear}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                    {log.roomNumber}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-medium">
                  <span className="text-slate-400">{log.prevWaterMeter}</span> →{" "}
                  <span className="font-semibold text-sky-700">{log.currWaterMeter}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="font-bold text-slate-800">{log.waterUnits} หน่วย</span>
                  <span className="block text-xs text-sky-600">฿{log.waterAmount}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-medium">
                  <span className="text-slate-400">{log.prevElectricMeter}</span> →{" "}
                  <span className="font-semibold text-amber-700">{log.currElectricMeter}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="font-bold text-slate-800">{log.electricUnits} หน่วย</span>
                  <span className="block text-xs text-amber-600">฿{log.electricAmount}</span>
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-slate-500">
                  {log.recordedAt || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Record Monthly Meter */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="บันทึกเลขมิเตอร์น้ำและไฟฟ้าประจำเดือน"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เดือน/ปี ที่เรียกเก็บ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={billingMonthYear}
                onChange={(e) => setBillingMonthYear(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขห้องพัก <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
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

          {/* Water Meter Section */}
          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
            <h5 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-600" />
              <span>มิเตอร์น้ำประปา (อัตรา ฿{utilityRates.waterRate}/หน่วย)</span>
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs text-slate-500 mb-1">เลขมิเตอร์ครั้งก่อน</label>
                <input
                  type="number"
                  value={prevWater}
                  onChange={(e) => setPrevWater(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white rounded-lg text-xs border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-sky-900 mb-1">
                  เลขมิเตอร์ปัจจุบัน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={currWater}
                  onChange={(e) => setCurrWater(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white rounded-lg text-xs border border-sky-400 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Electricity Meter Section */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>มิเตอร์ไฟฟ้า (อัตรา ฿{utilityRates.electricityRate}/หน่วย)</span>
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs text-slate-500 mb-1">เลขมิเตอร์ครั้งก่อน</label>
                <input
                  type="number"
                  value={prevElectric}
                  onChange={(e) => setPrevElectric(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white rounded-lg text-xs border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-amber-900 mb-1">
                  เลขมิเตอร์ปัจจุบัน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={currElectric}
                  onChange={(e) => setCurrElectric(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white rounded-lg text-xs border border-amber-400 font-bold"
                />
              </div>
            </div>
          </div>

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
              บันทึกเลขมิเตอร์
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
