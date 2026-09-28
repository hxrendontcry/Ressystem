// src/components/tenant/TenantAnnouncementsView.jsx
import React, { useState } from "react";
import { Megaphone, Calendar, Paperclip, Download, Image, Maximize2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../common/Modal";

export const TenantAnnouncementsView = () => {
  const { announcements, showToast } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleDownloadAttachment = (filename) => {
    showToast(`กำลังดาวน์โหลดเอกสารแนบ: ${filename}...`);
    setTimeout(() => {
      showToast(`ดาวน์โหลด ${filename} สำเร็จ`, "success");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              ข่าวสารและประกาศจากหอพัก (Announcements)
            </h3>
            <p className="text-xs text-slate-500">
              ติดตามระเบียบการ นัดหมายล้างแท็งก์น้ำ และประกาศสำคัญจากฝ่ายนิติบุคคล
            </p>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
              ann.important
                ? "border-sky-300 ring-1 ring-sky-200"
                : "border-slate-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {ann.important && (
                  <span className="px-2 py-0.5 text-2xs font-bold rounded-md bg-rose-100 text-rose-700 border border-rose-200">
                    ประกาศสำคัญ
                  </span>
                )}
                <h4 className="text-base font-bold text-slate-800">{ann.title}</h4>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>เผยแพร่เมื่อ: {ann.publishDate}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            {/* Photos (Max 5) */}
            {ann.images && ann.images.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-700 mb-2 block">
                  รูปภาพประกอบประกาศ:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ann.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(img)}
                      className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md"
                    >
                      <img
                        src={img}
                        alt="รูปประกาศ"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {ann.attachments && ann.attachments.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 mb-2 block">
                  เอกสารแนบ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ann.attachments.map((att, i) => (
                    <button
                      key={i}
                      onClick={() => handleDownloadAttachment(att.name)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium hover:bg-sky-100 transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{att.name}</span>
                      <span className="text-2xs text-sky-500 font-normal">({att.size})</span>
                      <Download className="w-3 h-3 text-sky-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Photo Zoom */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title="รูปภาพประกอบประกาศ"
        maxWidth="max-w-2xl"
      >
        <img
          src={selectedPhoto}
          alt="รูปประกาศขยาย"
          className="w-full h-auto rounded-xl object-contain max-h-[70vh]"
        />
      </Modal>
    </div>
  );
};
