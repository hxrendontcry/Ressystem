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
  Send,
  Copy,
  Check,
  Share2,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Link,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminRoomManagement = () => {
  const { rooms, tenants, adminAddRoom, adminUpdateRoom, adminDeleteRoom, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Invite Link Modal State for 1. ว่าง (Available)
  const [inviteModalRoom, setInviteModalRoom] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteRecipient, setInviteRecipient] = useState({ name: "", phone: "", email: "" });

  // Guide accordion
  const [showStatusGuide, setShowStatusGuide] = useState(true);

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

  // ตามข้อกำหนดในรูปภาพ:
  // 1. ว่าง (Available) -> สีเขียว
  // 2. มีผู้เช่า (Occupied) -> สีแดง
  // 3. รอเข้าพัก (Reserved) -> สีส้ม
  // 4. ปิดปรับปรุง (Maintenance) -> สีเทา
  const getStatusBadge = (st) => {
    switch (st) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "occupied":
        return "bg-rose-50 text-rose-700 border-rose-300";
      case "reserved":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "maintenance":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleCopyInviteLink = (r) => {
    const link = `https://ressystem.vercel.app/register-contract?room=${r.roomNumber}&token=INV-${r.roomNumber}-${Date.now()}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast(`คัดลอก Invite Link สำหรับห้อง ${r.roomNumber} เรียบร้อยแล้ว`, "success");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteRecipient.name.trim() || (!inviteRecipient.phone.trim() && !inviteRecipient.email.trim())) {
      showToast("กรุณาระบุชื่อผู้เช่ารายใหม่และเบอร์โทรหรืออีเมล", "error");
      return;
    }
    showToast(`ส่งคำเชิญทำสัญญาเช่าห้อง ${inviteModalRoom.roomNumber} ไปยัง ${inviteRecipient.name} สำเร็จแล้ว`, "success");
    setInviteModalRoom(null);
    setInviteRecipient({ name: "", phone: "", email: "" });
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

      {/* 📋 ตารางข้อกำหนดและสัญลักษณ์สีสถานะห้องพัก (อ้างอิงตามข้อกำหนดของระบบ) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">
                ข้อกำหนดและสัญลักษณ์สีสถานะห้องพัก (Room Status Specifications)
              </h4>
              <p className="text-2xs text-slate-500">
                มาตรฐานการควบคุมสถานะห้องพักและการจัดการสิทธิ์ผู้เช่า
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowStatusGuide(!showStatusGuide)}
            className="flex items-center gap-1 text-xs text-sky-600 font-medium hover:text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200 transition-colors"
          >
            <span>{showStatusGuide ? "ซ่อนคำอธิบาย" : "ดูคำอธิบายสถานะ"}</span>
            {showStatusGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showStatusGuide && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 whitespace-nowrap">
                  <th className="py-2.5 px-3 font-semibold w-48">สถานะห้อง</th>
                  <th className="py-2.5 px-3 font-semibold w-36">สัญลักษณ์สี</th>
                  <th className="py-2.5 px-3 font-semibold">คำอธิบายและการทำงานของระบบ</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-28">จำนวนปัจจุบัน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* 1. ว่าง */}
                <tr className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-emerald-800 whitespace-nowrap">
                    1. ว่าง (Available)
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                      <span>- สีเขียว</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    ห้องพักว่าง ไม่มีผู้เช่า ผู้ดูแลสามารถส่งคำเชิญ (<span className="font-semibold text-emerald-700">Invite Link</span>) เพื่อทำสัญญาเช่ากับผู้เช่ารายใหม่ได้
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                    {availableCount} ห้อง
                  </td>
                </tr>

                {/* 2. มีผู้เช่า */}
                <tr className="hover:bg-rose-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-rose-800 whitespace-nowrap">
                    2. มีผู้เช่า (Occupied)
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300">
                      <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                      <span>- สีแดง</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    มีผู้เช่าพักอาศัยปัจจุบัน <span className="font-semibold text-rose-600">ระบบไม่อนุญาตให้ลงทะเบียนผู้เช่าซ้ำในห้องนี้</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-rose-700 whitespace-nowrap">
                    {occupiedCount} ห้อง
                  </td>
                </tr>

                {/* 3. รอเข้าพัก */}
                <tr className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-800 whitespace-nowrap">
                    3. รอเข้าพัก (Reserved)
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                      <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                      <span>- สีส้ม</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    ผู้เช่ายืนยันสัญญาแล้ว แต่อยู่ระหว่างรอวันย้ายเข้าตามกำหนดในสัญญาเช่า
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-amber-700 whitespace-nowrap">
                    {reservedCount} ห้อง
                  </td>
                </tr>

                {/* 4. ปิดปรับปรุง */}
                <tr className="hover:bg-slate-100/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                    4. ปิดปรับปรุง (Maintenance)
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                      <span className="w-3 h-3 rounded-full bg-slate-400 border border-slate-500 ring-2 ring-slate-200" />
                      <span>- สีเทา</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    ห้องพักอยู่ระหว่างการซ่อมแซมหรือรีโนเวต ระบบจะตัดออกจากรายการห้องว่างชั่วคราว
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-700 whitespace-nowrap">
                    {maintenanceCount} ห้อง
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Summary Chips (ตรงตามสีข้อกำหนด: เขียว/แดง/ส้ม/เทา) */}
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
          onClick={() => setSelectedStatus("available")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "available"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white text-emerald-800 border-emerald-200 hover:border-emerald-300"
          }`}
        >
          <span className="text-2xs opacity-80 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>1. ว่าง (เขียว)</span>
          </span>
          <span className="text-xl font-bold">{availableCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("occupied")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "occupied"
              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
              : "bg-white text-rose-800 border-rose-200 hover:border-rose-300"
          }`}
        >
          <span className="text-2xs opacity-80 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>2. มีผู้เช่า (แดง)</span>
          </span>
          <span className="text-xl font-bold">{occupiedCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("reserved")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "reserved"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-white text-amber-800 border-amber-200 hover:border-amber-300"
          }`}
        >
          <span className="text-2xs opacity-80 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>3. รอเข้าพัก (ส้ม)</span>
          </span>
          <span className="text-xl font-bold">{reservedCount} ห้อง</span>
        </button>

        <button
          onClick={() => setSelectedStatus("maintenance")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === "maintenance"
              ? "bg-slate-600 text-white border-slate-600 shadow-xs"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-2xs opacity-80 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>4. ปิดปรับปรุง (เทา)</span>
          </span>
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
                              ? "bg-rose-50/40 border-rose-200 hover:border-rose-400 shadow-2xs"
                              : isAvailable
                              ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 shadow-2xs"
                              : isReserved
                              ? "bg-amber-50/40 border-amber-200 hover:border-amber-400 shadow-2xs"
                              : "bg-slate-100/60 border-slate-300 hover:border-slate-400 shadow-2xs"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-base text-slate-800">
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

                            <div className="mt-2 pt-2 border-t border-slate-100">
                              <span className="text-2xs text-slate-400 block">ผู้พักอาศัย:</span>
                              <span className="text-2xs font-semibold text-slate-700 block truncate">
                                {tenant ? (
                                  tenant.name
                                ) : isAvailable ? (
                                  <span className="text-emerald-700 font-normal">พร้อมปล่อยเช่า</span>
                                ) : isReserved ? (
                                  <span className="text-amber-700 font-normal">รอย้ายเข้าตามสัญญา</span>
                                ) : (
                                  <span className="text-slate-500 font-normal">งดให้บริการชั่วคราว</span>
                                )}
                              </span>
                            </div>

                            {/* 1.3.2.1 Invite Link for available rooms */}
                            {isAvailable && (
                              <button
                                onClick={() => setInviteModalRoom(room)}
                                className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-2xs font-semibold shadow-xs transition-colors"
                              >
                                <Send className="w-3 h-3" />
                                <span>ส่ง Invite Link</span>
                              </button>
                            )}

                            {isOccupied && (
                              <div className="mt-2.5 text-3xs text-rose-700 bg-rose-100/60 px-1.5 py-0.5 rounded text-center">
                                ล็อกสิทธิ์ (ห้ามลงทะเบียนซ้ำ)
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
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
                <th className="py-3.5 px-4 font-semibold text-center">คำเชิญ / จัดการ</th>
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
                      {tenant ? (
                        <div>
                          <span className="font-semibold text-slate-800">{tenant.name}</span>
                          <span className="block text-3xs text-rose-600">(ห้ามลงทะเบียนซ้ำ)</span>
                        </div>
                      ) : room.status === "available" ? (
                        <span className="text-emerald-700 font-medium">ห้องว่างพร้อมเช่า</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
                        {room.status === "available" && (
                          <button
                            onClick={() => setInviteModalRoom(room)}
                            title="ส่ง Invite Link ทำสัญญา"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                          >
                            <Send className="w-3 h-3" />
                            <span>Invite</span>
                          </button>
                        )}
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

      {/* Modal: ส่งคำเชิญ (Invite Link) สำหรับ 1. ว่าง (Available) */}
      <Modal
        isOpen={Boolean(inviteModalRoom)}
        onClose={() => setInviteModalRoom(null)}
        title={`ส่งคำเชิญทำสัญญาเช่า (Invite Link) - ห้อง ${inviteModalRoom?.roomNumber}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 leading-relaxed">
            ห้องพักนี้อยู่ในสถานะ <span className="font-bold">ว่าง (Available - สีเขียว)</span> สามารถคัดลอกลิงก์หรือส่งคำเชิญให้ผู้เช่ารายใหม่เพื่อลงทะเบียนและทำสัญญาเช่าออนไลน์ได้ทันที
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invite Link สำหรับผู้เช่ารายใหม่
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://ressystem.vercel.app/register-contract?room=${inviteModalRoom?.roomNumber}&token=INV-${inviteModalRoom?.roomNumber}-SECURE`}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono select-all"
              />
              <button
                onClick={() => handleCopyInviteLink(inviteModalRoom)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-xs shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h5 className="text-xs font-bold text-slate-700 mb-2">
              หรือ ส่งคำเชิญตรงไปยังผู้เช่า (Direct Send)
            </h5>
            <form onSubmit={handleSendInvite} className="space-y-3">
              <div>
                <label className="block text-2xs font-medium text-slate-600 mb-1">
                  ชื่อ-นามสกุล ผู้เช่ารายใหม่
                </label>
                <input
                  type="text"
                  placeholder="เช่น นายสมคิด สุขใจ"
                  value={inviteRecipient.name}
                  onChange={(e) => setInviteRecipient({ ...inviteRecipient, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-medium text-slate-600 mb-1">
                    เบอร์โทรศัพท์ (SMS)
                  </label>
                  <input
                    type="text"
                    placeholder="08x-xxx-xxxx"
                    value={inviteRecipient.phone}
                    onChange={(e) => setInviteRecipient({ ...inviteRecipient, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-medium text-slate-600 mb-1">
                    อีเมล (Email)
                  </label>
                  <input
                    type="email"
                    placeholder="tenant@email.com"
                    value={inviteRecipient.email}
                    onChange={(e) => setInviteRecipient({ ...inviteRecipient, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalRoom(null)}
                  className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งคำเชิญ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

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
