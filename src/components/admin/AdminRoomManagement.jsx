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
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminRoomManagement = () => {
  const { rooms, tenants, adminAddRoom, adminUpdateRoom, adminDeleteRoom, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Filters & View Mode
  const [viewMode, setViewMode] = useState("floorPlan"); // 'floorPlan' | 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

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
      photos: [],
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

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFloor =
      selectedFloor === "all" || String(r.floor) === String(selectedFloor);
    const matchStatus =
      selectedStatus === "all" || r.status === selectedStatus;
    return matchSearch && matchFloor && matchStatus;
  });

  // Unique floors sorted descending for building elevation (4, 3, 2, 1)
  const floors = Array.from(new Set(rooms.map((r) => r.floor || 1))).sort(
    (a, b) => b - a
  );

  const totalCount = rooms.length;
  const occupiedCount = rooms.filter((r) => r.status === "occupied").length;
  const availableCount = rooms.filter((r) => r.status === "available").length;
  const reservedCount = rooms.filter((r) => r.status === "reserved").length;
  const maintenanceCount = rooms.filter((r) => r.status === "maintenance").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            จัดการข้อมูลห้องพัก ({totalCount} ห้อง)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            จำลองหอพัก 4 ชั้น รวม 48 ห้อง สามารถดูผังอาคาร (Floor Plan) หรือตาราง พร้อมค้นหาและกรองสถานะได้ทันที
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

      {/* Quick Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "all"
              ? "bg-slate-800 text-white border-slate-800 shadow-xs"
              : "bg-white text-slate-700 border-sky-100 hover:border-slate-300"
          }`}
        >
          <span className="text-2xs opacity-80 block">ห้องทั้งหมด</span>
          <span className="text-xl font-bold">{totalCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("occupied")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "occupied"
              ? "bg-sky-600 text-white border-sky-600 shadow-xs"
              : "bg-white text-sky-800 border-sky-100 hover:border-sky-300"
          }`}
        >
          <span className="text-2xs opacity-80 block">มีผู้เช่า (Occupied)</span>
          <span className="text-xl font-bold">{occupiedCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("available")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "available"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white text-emerald-800 border-emerald-100 hover:border-emerald-300"
          }`}
        >
          <span className="text-2xs opacity-80 block">ห้องว่าง (Available)</span>
          <span className="text-xl font-bold">{availableCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("reserved")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "reserved"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-white text-indigo-800 border-indigo-100 hover:border-indigo-300"
          }`}
        >
          <span className="text-2xs opacity-80 block">รอเข้าพัก (Reserved)</span>
          <span className="text-xl font-bold">{reservedCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("maintenance")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "maintenance"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-white text-amber-800 border-amber-100 hover:border-amber-300"
          }`}
        >
          <span className="text-2xs opacity-80 block">ปิดปรับปรุง (Maint.)</span>
          <span className="text-xl font-bold">{maintenanceCount} ห้อง</span>
        </button>
      </div>

      {/* Control Bar: Search, Floor Filter, View Mode Toggle */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Floor Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">
            ชั้น:
          </span>
          {["all", 1, 2, 3, 4].map((fl) => (
            <button
              key={fl}
              onClick={() => setSelectedFloor(fl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFloor === fl
                  ? "bg-sky-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {fl === "all" ? "ทุกชั้น" : `ชั้น ${fl}`}
            </button>
          ))}
        </div>

        {/* Right: Search + View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง / ประเภท..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("floorPlan")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "floorPlan"
                  ? "bg-white text-sky-700 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ผังห้องพัก
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-sky-700 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ตารางข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Floor Plan Grid (Elevational View by Floor) */}
      {viewMode === "floorPlan" && (
        <div className="space-y-6">
          {floors
            .filter((fl) => selectedFloor === "all" || fl === selectedFloor)
            .map((fl) => {
              const roomsInFloor = filteredRooms.filter((r) => (r.floor || 1) === fl);
              if (roomsInFloor.length === 0) return null;

              return (
                <div
                  key={fl}
                  className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <h4 className="font-bold text-sm text-slate-800">
                        ชั้น {fl} (Floor {fl})
                      </h4>
                      <span className="text-2xs text-slate-400">
                        ({roomsInFloor.length} ห้อง)
                      </span>
                    </div>
                  </div>

                  {/* 12 rooms per floor grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {roomsInFloor.map((room) => {
                      const tenant = tenants.find(
                        (t) => t.id === room.currentTenantId || t.assignedRoom === room.roomNumber
                      );
                      const isOccupied = room.status === "occupied";
                      const isAvailable = room.status === "available";
                      const isReserved = room.status === "reserved";
                      const isMaint = room.status === "maintenance";

                      return (
                        <div
                          key={room.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                            isOccupied
                              ? "bg-sky-50/40 border-sky-200 hover:border-sky-400"
                              : isAvailable
                              ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-400"
                              : isReserved
                              ? "bg-indigo-50/40 border-indigo-200 hover:border-indigo-400"
                              : "bg-amber-50/40 border-amber-200 hover:border-amber-400"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-sm text-slate-800">
                                {room.roomNumber}
                              </span>
                              <span
                                className={`text-2xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${getStatusBadge(
                                  room.status
                                )}`}
                              >
                                {room.statusLabel}
                              </span>
                            </div>

                            <p className="text-2xs text-slate-500 truncate">
                              {room.type} • ฿{room.price.toLocaleString()}
                            </p>

                            <div className="mt-2 pt-2 border-t border-slate-100/80">
                              <span className="text-2xs text-slate-400 block">ผู้พักอาศัย:</span>
                              <span className="text-2xs font-medium text-slate-700 block truncate">
                                {tenant ? tenant.name : isAvailable ? "— ห้องว่าง —" : "—"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100/80">
                            <button
                              onClick={() => openEditModal(room)}
                              title="แก้ไขห้องพัก"
                              className="p-1 rounded-md text-sky-600 hover:bg-sky-100/60 border border-sky-200"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(room.id, room.roomNumber)}
                              title="ลบห้องพัก"
                              className="p-1 rounded-md text-rose-600 hover:bg-rose-100/60 border border-rose-200"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW 2: Rooms Table */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 whitespace-nowrap text-xs">
                <th className="py-3.5 px-4 font-semibold">เลขห้อง</th>
                <th className="py-3.5 px-4 font-semibold">ชั้น</th>
                <th className="py-3.5 px-4 font-semibold">ประเภทห้อง</th>
                <th className="py-3.5 px-4 font-semibold">ขนาด (ตร.ม.)</th>
                <th className="py-3.5 px-4 font-semibold">ค่าเช่า/เดือน</th>
                <th className="py-3.5 px-4 font-semibold">ผู้เช่าปัจจุบัน</th>
                <th className="py-3.5 px-4 font-semibold min-w-[180px]">สิ่งอำนวยความสะดวก</th>
                <th className="py-3.5 px-4 font-semibold">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRooms.map((room) => {
                const tenant = tenants.find(
                  (t) => t.id === room.currentTenantId || t.assignedRoom === room.roomNumber
                );
                return (
                  <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-sky-900 whitespace-nowrap">
                      ห้อง {room.roomNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      ชั้น {room.floor || 1}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{room.type}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{room.size} ตร.ม.</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      ฿{room.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-700">
                      {tenant ? tenant.name : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">
                      {room.amenities?.join(", ")}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${getStatusBadge(
                          room.status
                        )}`}
                      >
                        {room.statusLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create/Edit Room */}
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
              rows="3"
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
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
