// src/components/tenant/TenantRepairView.jsx
import React, { useState } from "react";
import {
  Wrench,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Zap,
  Droplet,
  Wind,
  Armchair,
  Bath,
  HelpCircle,
  Image,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const TenantRepairView = () => {
  const { currentRepairs, submitRepairRequest, showToast } = useApp();
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // Form states
  const [category, setCategory] = useState("เครื่องปรับอากาศ");
  const [urgency, setUrgency] = useState("ปานกลาง");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("กรุณากรอกหัวข้อและรายละเอียดปัญหาให้ครบถ้วน", "error");
      return;
    }

    const newTicketData = {
      category,
      urgency,
      title,
      description,
      attachments: selectedFile
        ? [
            {
              name: selectedFile.name || "ภาพแนบปัญหา.jpg",
              url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
              type: "image",
            },
          ]
        : [],
    };

    submitRepairRequest(newTicketData);
    setIsNewTicketModalOpen(false);
    setTitle("");
    setDescription("");
    setSelectedFile(null);
  };

  const getUrgencyBadge = (urgencyLevel) => {
    switch (urgencyLevel) {
      case "ฉุกเฉิน":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "สูง":
        return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      case "ปานกลาง":
        return "bg-sky-100 text-sky-800 border-sky-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "เสร็จสิ้น",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "in_progress":
        return {
          label: "กำลังดำเนินการ",
          className: "bg-sky-50 text-sky-700 border-sky-200",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: "รอดำเนินการ",
          className: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800">
              แจ้งซ่อมแซมและบริการห้องพัก (Maintenance & Service)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
              ห้อง 101
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            แจ้งปัญหาไฟฟ้า ประปา แอร์ หรือเฟอร์นิเจอร์ พร้อมติดตามสถานะการเข้าซ่อมของช่าง
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>แจ้งปัญหาใหม่</span>
        </button>
      </div>

      {/* 1.3.1.18 Maintenance History List */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800 flex items-center justify-between">
          <span>ประวัติและรายการแจ้งซ่อมย้อนหลัง</span>
          <span className="text-xs text-slate-400 font-normal">
            ทั้งหมด {currentRepairs.length} รายการ
          </span>
        </h4>

        {currentRepairs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            ไม่พบประวัติการแจ้งซ่อม
          </div>
        ) : (
          <div className="space-y-3">
            {currentRepairs.map((item) => {
              const statusObj = getStatusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {item.id}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {item.category}
                      </span>
                      <span
                        className={`text-2xs px-2 py-0.5 rounded-full border ${getUrgencyBadge(
                          item.urgency
                        )}`}
                      >
                        ความเร่งด่วน: {item.urgency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-slate-400">
                        แจ้งเมื่อ: {item.createdAt}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusObj.className}`}
                      >
                        {statusObj.icon}
                        <span>{statusObj.label}</span>
                      </span>
                    </div>
                  </div>

                  <h5 className="text-sm font-semibold text-slate-800">{item.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {item.description}
                  </p>

                  {/* Attachments if any */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-2xs text-slate-400">ไฟล์แนบ:</span>
                      {item.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-2xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 hover:underline"
                        >
                          <Image className="w-3 h-3" />
                          <span>{att.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Admin notes */}
                  {item.adminNote && (
                    <div className="text-xs bg-sky-50/70 border border-sky-200 text-sky-900 p-2.5 rounded-lg">
                      <span className="font-semibold block text-2xs text-sky-700 mb-0.5">
                        ข้อความตอบกลับจากผู้ดูแลหอพัก:
                      </span>
                      {item.adminNote}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: 1.3.1.17 Create Repair Request */}
      <Modal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        title="แจ้งปัญหาหรือขอรับบริการซ่อมแซม (Create Maintenance Request)"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทปัญหา <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="ไฟฟ้า">ไฟฟ้า (หลอดไฟ, ปลั๊ก, เบรกเกอร์)</option>
                <option value="ประปา">ประปา (ก๊อกน้ำ, ท่อรั่ว, ชักโครก)</option>
                <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ (แอร์ไม่เย็น, น้ำหยด)</option>
                <option value="เฟอร์นิเจอร์">เฟอร์นิเจอร์ (เตียง, ตู้, โต๊ะ)</option>
                <option value="ห้องน้ำ">ห้องน้ำ (เครื่องทำน้ำอุ่น, ฝักบัว)</option>
                <option value="อื่น ๆ">อื่น ๆ (อินเทอร์เน็ต, ลูกบิดประตู)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระดับความเร่งด่วน <span className="text-rose-500">*</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="ต่ำ">ต่ำ (ไม่ส่งผลกระทบต่อการใช้ชีวิตประจำวัน)</option>
                <option value="ปานกลาง">ปานกลาง (มีปัญหาแต่ยังพอใช้งานได้)</option>
                <option value="สูง">สูง (ใช้งานไม่ได้ กระทบการอยู่อาศัย)</option>
                <option value="ฉุกเฉิน">ฉุกเฉิน (ไฟรั่ว น้ำท่วมห้อง กลิ่นไหม้)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หัวข้อปัญหา <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น แอร์มีเสียงดังผิดปกติและไม่เย็น"
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดปัญหา <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุอาการให้ชัดเจน เช่น เริ่มมีเสียงดังตั้งแต่เมื่อวาน..."
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Attach photo/video */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              แนบรูปภาพหรือวิดีโอประกอบ
            </label>
            <div className="p-3 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 text-center hover:bg-sky-50 transition-colors cursor-pointer">
              <Paperclip className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="text-xs text-slate-700 font-medium">
                เลือกรูปภาพหรือคลิปวิดีโออาการเสีย
              </p>
              <span className="text-2xs text-slate-400">
                รองรับไฟล์ JPG, PNG, MP4 ขนาดไม่เกิน 10 MB
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-2xs text-slate-500">
            🕒 ระบบจะบันทึกวันและเวลาแจ้งซ่อมอัตโนมัติทันทีที่กดส่ง
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewTicketModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
            >
              ส่งใบแจ้งซ่อม
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
