// src/components/admin/AdminLineOAChat.jsx
import React, { useState } from "react";
import { MessageCircle, Send, User, Bot, ShieldCheck, CheckCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminLineOAChat = () => {
  const { lineMessages, sendLineMessage, tenants, showToast } = useApp();
  const [inputText, setInputText] = useState("");
  const [selectedTenantChat, setSelectedTenantChat] = useState(tenants[0]?.id || "");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendLineMessage(inputText);
    setInputText("");
    showToast("ส่งข้อความตอบกลับไปยัง LINE ผู้เช่าเรียบร้อยแล้ว", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              ศูนย์รับส่งข้อความ LINE Official Account (LINE OA Chatbot Center)
            </h3>
            <p className="text-xs text-slate-500">
              สนทนาโต้ตอบกับผู้เช่าโดยตรง หรือปล่อยให้ AI Chatbot ช่วยตอบคำถามเบื้องต้น
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xs grid grid-cols-1 md:grid-cols-3 h-[580px] overflow-hidden">
        {/* Left: Chat List of Tenants */}
        <div className="border-r border-slate-100 p-3 space-y-2 overflow-y-auto bg-slate-50/50">
          <span className="text-xs font-bold text-slate-500 px-2 block">
            บทสนทนากับผู้เช่า
          </span>
          {tenants.map((t) => {
            const isSelected = selectedTenantChat === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTenantChat(t.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-white border-emerald-400 shadow-xs"
                    : "border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">{t.name}</span>
                  <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ห้อง {t.assignedRoom}
                  </span>
                </div>
                <p className="text-2xs text-slate-400 truncate mt-1">
                  ข้อความล่าสุดจากผู้เช่าห้อง {t.assignedRoom}...
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Active Chat Area */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {/* Top Chat Info */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                สนทนากับ: {tenants.find((t) => t.id === selectedTenantChat)?.name} (ห้อง{" "}
                {tenants.find((t) => t.id === selectedTenantChat)?.assignedRoom})
              </span>
            </div>
            <span className="text-2xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
              LINE Verified
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {lineMessages.map((msg) => {
              const isAdmin = msg.sender === "admin";
              const isBot = msg.sender === "bot";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  {!isAdmin && (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                        isBot ? "bg-sky-500" : "bg-emerald-600"
                      }`}
                    >
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                  )}

                  <div className={`max-w-[75%] ${isAdmin ? "items-end" : "items-start"}`}>
                    <span className="text-2xs text-slate-400 block px-1 mb-0.5">
                      {msg.senderName} • {msg.time}
                    </span>
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isAdmin
                          ? "bg-sky-600 text-white rounded-br-xs"
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

          {/* Reply Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์ข้อความตอบกลับผู้เช่าผ่าน LINE OA ในฐานะแอดมิน..."
              className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-700 transition-colors flex items-center gap-1.5"
            >
              <span>ส่งตอบกลับ</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
