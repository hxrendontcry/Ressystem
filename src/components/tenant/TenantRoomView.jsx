// src/components/tenant/TenantRoomView.jsx
import React, { useState } from "react";
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
  Maximize2,
  Calendar,
  CreditCard,
  Droplet,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const TenantRoomView = () => {
  const { currentRoom, currentTenant, utilityRates } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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

      {/* Room Photo Gallery (Not exceeding 5 photos) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span>รูปภาพห้องพัก</span>
            <span className="text-xs text-slate-400 font-normal">({currentRoom.photos.length}/5 รูป)</span>
          </h4>
          <span className="text-xs text-sky-600">คลิกที่รูปเพื่อขยาย</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {currentRoom.photos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(photoUrl)}
              className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={photoUrl}
                alt={`รูปห้อง ${currentRoom.roomNumber} รูปที่ ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-sky-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities & Furniture List */}
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

      {/* Full Photo Modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={`รูปภาพห้อง ${currentRoom.roomNumber}`}
        maxWidth="max-w-3xl"
      >
        <div className="p-2">
          <img
            src={selectedPhoto}
            alt="รูปห้องขยาย"
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
          />
        </div>
      </Modal>
    </div>
  );
};
