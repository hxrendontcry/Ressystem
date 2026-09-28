// src/components/admin/AdminRoomManagement.jsx
import React, { useState } from "react";
import {
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Wrench,
  DoorOpen,
  Image,
  Upload,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminRoomManagement = () => {
  const { rooms, adminAddRoom, adminUpdateRoom, adminDeleteRoom, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Form State
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("Studio Standard");
  const [size, setSize] = useState(28);
  const [price, setPrice] = useState(4500);
  const [status, setStatus] = useState("available");
  const [floor, setFloor] = useState(1);
  const [amenitiesText, setAmenitiesText] = useState("เตียงนอน 5 ฟุต, แอร์, พัดลม, ตู้เสื้อผ้า, โต๊ะอ่านหนังสือ, เก้าอี้, ตู้เย็น, เครื่องทำน้ำอุ่น, Wi-Fi ส่วนตัว, ระเบียง");

  const openCreateModal = () => {
    setEditingRoom(null);
    setRoomNumber("");
    setType("Studio Standard");
    setSize(28);
    setPrice(4500);
    setStatus("available");
    setFloor(1);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setType(room.type);
    setSize(room.size);
    setPrice(room.price);
    setStatus(room.status);
    setFloor(room.floor || 1);
    setAmenitiesText(room.amenities.join(", "));
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      showToast("กรุณากรอกเลขห้อง", "error");
      return;
    }

    const statusLabels = {
      available: "ว่าง",
      occupied: "มีผู้เช่า",
      reserved: "รอเข้าพัก",
      maintenance: "ปิดปรับปรุง",
    };

    const roomPayload = {
      id: editingRoom ? editingRoom.id : `R${roomNumber}`,
      roomNumber,
      type,
      size: Number(size),
      price: Number(price),
      status,
      statusLabel: statusLabels[status] || "ว่าง",
      floor: Number(floor),
      amenities: amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
      photos: editingRoom?.photos || [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
      ],
      currentTenantId: editingRoom?.currentTenantId || null,
    };

    if (editingRoom) {
      adminUpdateRoom(roomPayload);
    } else {
      adminAddRoom(roomPayload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, number) => {
    if (confirm(`คุณต้องการลบห้อง ${number} ออกจากระบบใช่หรือไม่?`)) {
      adminDeleteRoom(id);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "occupied":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "reserved":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "maintenance":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            จัดการข้อมูลห้องพัก (Room Management)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            เพิ่ม ลบ แก้ไข ข้อมูลสิ่งอำนวยความสะดวก ราคาค่าเช่า และรูปภาพห้องพัก
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>เพิ่มห้องพักใหม่</span>
        </button>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3 px-3 font-semibold">เลขห้อง</th>
              <th className="py-3 px-3 font-semibold">ประเภทห้อง</th>
              <th className="py-3 px-3 font-semibold">ขนาด (ตร.ม.)</th>
              <th className="py-3 px-3 font-semibold">ค่าเช่า/เดือน</th>
              <th className="py-3 px-3 font-semibold">รูปภาพ (≤ 5)</th>
              <th className="py-3 px-3 font-semibold">สถานะ</th>
              <th className="py-3 px-3 font-semibold text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-bold text-sky-900">
                  ห้อง {room.roomNumber}
                </td>
                <td className="py-3 px-3">{room.type}</td>
                <td className="py-3 px-3">{room.size} ตร.ม.</td>
                <td className="py-3 px-3 font-semibold text-slate-800">
                  ฿{room.price.toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Image className="w-3.5 h-3.5" />
                    <span>{room.photos?.length || 0} รูป</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`text-2xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                      room.status
                    )}`}
                  >
                    {room.statusLabel}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(room)}
                      title="แก้ไขห้องพัก"
                      className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 border border-sky-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id, room.roomNumber)}
                      title="ลบห้องพัก"
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create/Edit Room (1.3.2.6) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? `แก้ไขข้อมูลห้อง ${editingRoom.roomNumber}` : "เพิ่มห้องพักใหม่"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขห้อง <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="เช่น 103, 204"
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทห้อง <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="Studio Standard">Studio Standard</option>
                <option value="Deluxe Balcony">Deluxe Balcony</option>
                <option value="Corner Suite">Corner Suite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                พื้นที่ห้อง (ตร.ม.) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ราคาค่าเช่า (บาท/เดือน) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะห้อง <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="available">ว่าง</option>
                <option value="occupied">มีผู้เช่า</option>
                <option value="reserved">รอเข้าพัก</option>
                <option value="maintenance">ปิดปรับปรุง</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สิ่งอำนวยความสะดวก (คั่นด้วยเครื่องหมายจุลภาค ,)
            </label>
            <textarea
              rows="2"
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Photo Upload Simulation (Max 5 photos) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รูปภาพห้องพัก (ไม่เกิน 5 รูป)
            </label>
            <div className="p-3 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 text-center hover:bg-sky-50 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="text-xs text-slate-700 font-medium">คลิกเพื่ออัปโหลดรูปภาพห้องพัก</p>
              <span className="text-2xs text-slate-400">JPG, PNG ขนาดไม่เกิน 5 MB ต่อรูป</span>
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
              {editingRoom ? "บันทึกการแก้ไข" : "สร้างห้องพัก"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
