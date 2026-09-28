// src/components/tenant/TenantLineOALink.jsx
import React, { useState } from "react";
import { MessageCircle, ExternalLink, Send, Bot, ShieldCheck, User } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const TenantLineOALink = () => {
  const { lineMessages, sendLineMessage, showToast, currentTenant } = useApp();
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendLineMessage(inputText);
    setInputText("");

    // Simulate auto bot response after 1s
    setTimeout(() => {
      showToast("ระบบอัตโนมัติ LINE OA ได้รับข้อความแล้ว", "success");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header & Direct Link Banner (1.3.1.19) */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <MessageCircle className="w-6 h-6" />
            </span>
            <h3 className="text-xl font-bold">LINE Official Account (LINE OA) ของหอพัก</h3>
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            กดปุ่มด้านล่างเพื่อเปิดแอปพลิเคชัน LINE หรือแชทกับผู้ดูแลหอพักผ่านระบบจำลองนี้ได้ทันที
          </p>
        </div>

        <a
          href="https://line.me"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-50 transition-colors shrink-0"
        >
          <span>เปิดแชทใน LINE App</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Simulated LINE Web Chat Window */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden max-w-3xl mx-auto flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="bg-emerald-500 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold shadow-xs">
              LINE
            </div>
            <div>
              <h4 className="text-sm font-bold">สุขสบาย เรสซิเดนซ์ (Official OA)</h4>
              <p className="text-2xs text-emerald-100">ตอบกลับโดย AI Chatbot และผู้ดูแลหอพัก</p>
            </div>
          </div>
          <span className="text-2xs px-2.5 py-1 bg-emerald-600/60 rounded-full border border-emerald-400">
            สถานะ: ออนไลน์
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {lineMessages.map((msg) => {
            const isMe = msg.sender === "tenant";
            const isBot = msg.sender === "bot";

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                      isBot ? "bg-sky-500" : "bg-emerald-600"
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>
                )}

                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-2xs text-slate-400 block px-1 mb-0.5">
                    {msg.senderName} • {msg.time}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? "bg-emerald-500 text-white rounded-br-xs"
                        : isBot
                        ? "bg-sky-50 border border-sky-200 text-slate-800 rounded-bl-xs"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`พิมพ์ข้อความสอบถามในฐานะ ${currentTenant.name}...`}
            className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
          >
            <span>ส่ง</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
