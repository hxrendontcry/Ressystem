// src/components/admin/AdminAnnouncements.jsx
import React, { useState } from "react";
import { Megaphone, PlusCircle, Trash2, Edit2, Calendar, Paperclip, Image, Upload } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const AdminAnnouncements = () => {
  const { announcements, adminAddAnnouncement, adminDeleteAnnouncement, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState("2026-09-28");
  const [expireDate, setExpireDate] = useState("2026-10-31");
  const [isImportant, setIsImportant] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("กรุณากรอกหัวข้อและเนื้อหาประกาศ", "error");
      return;
    }

    const newAnn = {
      id: `ANN-${Date.now().toString().slice(-3)}`,
      title,
      content,
      publishDate,
      expireDate,
      images: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      ],
      attachments: [{ name: "เอกสารประกาศแนบ.pdf", size: "520 KB" }],
      important: isImportant,
    };

    adminAddAnnouncement(newAnn);
    setIsModalOpen(false);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id, heading) => {
    if (confirm(`คุณต้องการลบประกาศ "${heading}" ใช่หรือไม่?`)) {
      adminDeleteAnnouncement(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            ระบบจัดการประกาศและข่าวสาร (Announcements Management)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            สร้าง แก้ไข ลบ และเผยแพร่ประกาศพร้อมแนบรูปภาพและไฟล์ PDF ส่งตรงถึงผู้เช่า (1.3.2.25)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>สร้างประกาศใหม่</span>
        </button>
      </div>

      {/* Announcements List (1.3.2.25) */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                {ann.important && (
                  <span className="px-2 py-0.5 rounded text-2xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    สำคัญ
                  </span>
                )}
                <h4 className="text-sm font-bold text-slate-800">{ann.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-2xs text-slate-400 pt-1">
                <span>เผยแพร่: {ann.publishDate}</span>
                <span>กำหนดปิด: {ann.expireDate}</span>
                <span>รูปภาพ: {ann.images?.length || 0} รูป</span>
                <span>เอกสารแนบ: {ann.attachments?.length || 0} ไฟล์</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(ann.id, ann.title)}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 shrink-0 self-end sm:self-center"
              title="ลบประกาศ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal: 1.3.2.25 Create Announcement */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="สร้างและเผยแพร่ประกาศใหม่ (Create Announcement)"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หัวข้อประกาศ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น แจ้งงดจ่ายน้ำชั่วคราวเพื่อทำความสะอาดแท็งก์"
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดประกาศ <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="4"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ระบุวันเวลาและรายละเอียด..."
              className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เผยแพร่ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กำหนดปิดประกาศ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รูปภาพประกอบ (ไม่เกิน 5 รูป)
              </label>
              <div className="p-3 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 text-center cursor-pointer text-2xs text-slate-600">
                <Upload className="w-4 h-4 text-sky-600 mx-auto mb-0.5" />
                <span>เลือกไฟล์รูปภาพ</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เอกสารแนบ (PDF ไม่เกิน 5 ไฟล์)
              </label>
              <div className="p-3 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 text-center cursor-pointer text-2xs text-slate-600">
                <Paperclip className="w-4 h-4 text-sky-600 mx-auto mb-0.5" />
                <span>เลือกไฟล์ PDF</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="importantCheck"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="rounded text-sky-600"
            />
            <label htmlFor="importantCheck" className="text-xs font-medium text-slate-700">
              ตั้งเป็นประกาศสำคัญ (แสดงแถบสีแดงเด่นชัด)
            </label>
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
              เผยแพร่ประกาศ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
