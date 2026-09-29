// src/components/tenant/TenantLineOALink.jsx
import React, { useState } from "react";
import {
  MessageCircle,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const TenantLineOALink = () => {
  const { currentTenant, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(true);

  const lineId = "@suksabai_residence";
  const lineAddFriendUrl = "https://line.me/R/ti/p/@suksabai_oa";

  const handleCopyId = () => {
    navigator.clipboard.writeText(lineId);
    setCopied(true);
    showToast("คัดลอก LINE ID เรียบร้อยแล้ว", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-2xs font-semibold mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>LINE Official Account • สุขสบาย เรสซิเดนซ์</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            แอด LINE หอพักเพื่อพูดคุยในแอปพลิเคชัน LINE
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            สแกน QR Code หรือกดปุ่มเพิ่มเพื่อน เพื่อแชทกับผู้ดูแลหอพัก แจ้งซ่อมแซมด่วน และรับการแจ้งเตือนบิลค่าเช่าผ่านแอป LINE ได้สะดวกทุกที่ทุกเวลา
          </p>
        </div>
      </div>

      {/* Main Grid: QR Code & Connection Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: QR Code & Quick Add */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-sky-100 p-6 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-800">สุขสบาย เรสซิเดนซ์</h4>
                  <span className="text-2xs text-emerald-600 font-medium">บัญชีทางการ (Verified Account)</span>
                </div>
              </div>
              <span className="text-2xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                ออนไลน์ 24 ชม.
              </span>
            </div>

            {/* QR Code Container */}
            <div className="relative p-4 bg-slate-50 border-2 border-dashed border-emerald-200 rounded-2xl my-2">
              <div className="w-52 h-52 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center p-3 mx-auto relative overflow-hidden">
                {qrLoaded ? (
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fline.me%2FR%2Fti%2Fp%2F%40suksabai_oa"
                    alt="LINE OA QR Code"
                    className="w-full h-full object-contain"
                    onError={() => setQrLoaded(false)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-3 relative">
                    <QrCode className="w-36 h-36 text-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md font-bold text-xs">
                        LINE
                      </div>
                    </div>
                  </div>
                )}

                {/* LINE badge in center */}
                {qrLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md font-bold text-2xs">
                      LINE
                    </div>
                  </div>
                )}
              </div>
              <span className="block text-2xs text-slate-500 font-medium mt-2">
                สแกนด้วยกล้องมือถือ หรือแอป LINE
              </span>
            </div>

            {/* LINE ID Box */}
            <div className="w-full mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-3xs text-emerald-800 uppercase font-bold tracking-wider block">
                  LINE Official ID
                </span>
                <span className="font-mono text-sm font-extrabold text-slate-800">
                  {lineId}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 shadow-2xs"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอก ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="w-full mt-4">
            {/* Primary Action Button */}
            <a
              href={lineAddFriendUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
            >
              <span>เปิดแอป LINE เพื่อเพิ่มเพื่อนทันที</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-3xs text-slate-400 mt-2.5">
              * หากใช้งานบนโทรศัพท์มือถือ ปุ่มนี้จะเปิดแอปพลิเคชัน LINE ให้คุณโดยอัตโนมัติ
            </p>
          </div>
        </div>

        {/* Right Column: 3 Steps Guide */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>3 ขั้นตอนง่ายๆ ในการเริ่มพูดคุยใน LINE</span>
              </h4>
              <span className="text-2xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                วิธีใช้งาน
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-sm font-extrabold shrink-0 shadow-xs">
                  1
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    สแกน QR Code หรือค้นหา LINE ID
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    เปิดแอป LINE บนมือถือของคุณ เลือกเมนู “เพิ่มเพื่อน” แล้วสแกนภาพ QR Code ทางด้านซ้าย หรือพิมพ์ค้นหาด้วยไอดี <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{lineId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-sm font-extrabold shrink-0 shadow-xs">
                  2
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    กดปุ่ม "เพิ่มเพื่อน" (Add Friend)
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    กดยืนยันเพิ่มเพื่อนกับบัญชีทางการ “สุขสบาย เรสซิเดนซ์” คุณจะได้รับข้อความต้อนรับและพร้อมเริ่มการสนทนาในห้องแชทได้ทันที
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-sm font-extrabold shrink-0 shadow-xs">
                  3
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    ส่งข้อความแจ้งชื่อและเลขห้องพัก
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    พิมพ์ส่งข้อความ เช่น <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">“สวัสดีครับ {currentTenant.name} ห้อง {currentTenant.assignedRoom}”</span> เพื่อให้เจ้าหน้าที่และระบบผูกบัญชีผู้เช่าของคุณเข้ากับระบบหอพัก
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Box */}
          <div className="mt-6 p-4 rounded-2xl bg-sky-50/60 border border-sky-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-2xs text-slate-600 leading-relaxed">
              <span className="font-bold text-sky-900">คำแนะนำ:</span> หลังจากเพิ่มเพื่อนแล้ว คุณสามารถพิมพ์ข้อความสอบถาม แจ้งปัญหาห้องพัก หรือส่งหลักฐานสลิปโอนเงินผ่านห้องแชท LINE ได้ตลอดเวลา เจ้าหน้าที่นิติบุคคลจะได้รับข้อความและตอบกลับคุณผ่านแอป LINE โดยตรงครับ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
