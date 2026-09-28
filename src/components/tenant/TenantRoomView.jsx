// src/components/tenant/TenantRoomView.jsx
import React from "react";
import {
  Bed,
  Wind,
  Fan,
  Layers,
  BookOpen,
  Armchair,
  Refrigerator,
  Flame,
  Wifi,
  SunMedium,
  Check,
  Droplet,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const TenantRoomView = () => {
  const { currentRoom, currentTenant, utilityRates } = useApp();

  if (!currentRoom) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-sky-100">
        ยังไม่มีข้อมูลห้องพักที่ผูกกับบัญชีผู้เช่านี้
      </div>
    );
  }

  // Icons map for amenities
  const getAmenityIcon = (name) => {
    if (name.includes("เตียง")) return <Bed className="w-4 h-4 text-sky-600" />;
    if (name.includes("แอร์")) return <Wind className="w-4 h-4 text-sky-600" />;
    if (name.includes("พัดลม")) return <Fan className="w-4 h-4 text-sky-600" />;
    if (name.includes("ตู้เสื้อผ้า")) return <Layers className="w-4 h-4 text-sky-600" />;
    if (name.includes("โต๊ะ")) return <BookOpen className="w-4 h-4 text-sky-600" />;
    if (name.includes("เก้าอี้")) return <Armchair className="w-4 h-4 text-sky-600" />;
    if (name.includes("ตู้เย็น")) return <Refrigerator className="w-4 h-4 text-sky-600" />;
    if (name.includes("น้ำอุ่น")) return <Flame className="w-4 h-4 text-sky-600" />;
    if (name.includes("Wi-Fi")) return <Wifi className="w-4 h-4 text-sky-600" />;
    if (name.includes("ระเบียง")) return <SunMedium className="w-4 h-4 text-sky-600" />;
    return <Check className="w-4 h-4 text-sky-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-sky-950">
                ห้อง {currentRoom.roomNumber}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentRoom.statusLabel}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                {currentRoom.type}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              ผู้เช่าปัจจุบัน: <span className="font-medium text-slate-700">{currentTenant.name}</span>
            </p>
          </div>
          <div className="text-right sm:border-l sm:pl-6 border-slate-100">
            <span className="text-xs text-slate-400 block">ค่าเช่ารายเดือน</span>
            <span className="text-2xl font-bold text-sky-600">
              ฿{currentRoom.price?.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400"> / เดือน</span>
          </div>
        </div>

        {/* Room Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block">ขนาดพื้นที่ห้อง</span>
            <span className="text-lg font-semibold text-slate-800">{currentRoom.size} ตร.ม.</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block">ชั้นที่ตั้ง</span>
            <span className="text-lg font-semibold text-slate-800">ชั้น {currentRoom.floor}</span>
          </div>
          <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
            <div className="flex items-center gap-1.5 text-sky-800 text-xs font-medium">
              <Droplet className="w-3.5 h-3.5 text-sky-600" />
              <span>อัตราค่าน้ำประปา</span>
            </div>
            <span className="text-lg font-bold text-sky-700">฿{utilityRates.waterRate}</span>
            <span className="text-xs text-slate-500"> / หน่วย</span>
          </div>
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>อัตราค่าไฟฟ้า</span>
            </div>
            <span className="text-lg font-bold text-amber-700">฿{utilityRates.electricityRate}</span>
            <span className="text-xs text-slate-500"> / หน่วย</span>
          </div>
        </div>
      </div>

      {/* Amenities & Furniture List (รูปห้องตัดออกตามต้องการ) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <h4 className="text-sm font-semibold text-slate-800 mb-4">
          สิ่งอำนวยความสะดวกและเฟอร์นิเจอร์ภายในห้องพัก
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {currentRoom.amenities.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm hover:border-sky-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100">
                {getAmenityIcon(item)}
              </div>
              <span className="font-medium text-xs sm:text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
