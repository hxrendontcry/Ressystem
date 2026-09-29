// src/components/ai/AiChatbotModal.jsx
import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AiChatbotModal = () => {
  const { utilityRates, setTenantActiveTab, setCurrentRole, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "สวัสดีครับ ผมคือ AI ผู้ช่วยอัจฉริยะประจำหอพักสุขสบาย สามารถสอบถามเรื่องห้องพัก อัตราค่าน้ำ-ค่าไฟ ขั้นตอนการแจ้งซ่อม หรือกฎระเบียบของหอพักได้ตลอด 24 ชม. ครับ!",
      time: "เมื่อสักครู่",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isEscalated, setIsEscalated] = useState(false);

  const quickPrompts = [
    "ค่าน้ำ-ค่าไฟ คิดหน่วยละเท่าไหร่?",
    "แจ้งซ่อมแอร์หรือประปาทำอย่างไร?",
    "กำหนดชำระค่าเช่าถึงวันไหน มีค่าปรับไหม?",
    "แจ้งย้ายออกต้องทำล่วงหน้ากี่วัน?",
    "ต้องการคุยกับผู้ดูแลหอพักโดยตรง",
  ];

  const handleSendQuery = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: "ตอนนี้",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");

    // Simulate AI reasoning and answering based on system data (1.3.2.29)
    setTimeout(() => {
      let botResponse = "";
      const lower = query.toLowerCase();

      if (lower.includes("น้ำ") || lower.includes("ไฟ") || lower.includes("หน่วย")) {
        botResponse = `💡 อัตราค่าสาธารณูปโภคของหอพักปัจจุบันคือ:\n• ค่าน้ำประปา: ฿${utilityRates.waterRate} บาท/หน่วย\n• ค่าไฟฟ้า: ฿${utilityRates.electricityRate} บาท/หน่วย\n• ค่าอินเทอร์เน็ต: ฿${utilityRates.internetRate} บาท/เดือน\nโดยระบบจะบันทึกเลขมิเตอร์พร้อมถ่ายรูปแนบในใบแจ้งหนี้ทุกสิ้นเดือนครับ`;
      } else if (lower.includes("ซ่อม")) {
        botResponse =
          "🔧 การแจ้งซ่อมสามารถไปที่แท็บ 'แจ้งซ่อมแซม' จากนั้นเลือกหมวดหมู่ (เช่น แอร์, ประปา, ไฟฟ้า) ระบุระดับความเร่งด่วน และแนบรูปภาพหรือคลิปวิดีโออาการเสียได้เลยครับ ช่างจะได้รับการแจ้งเตือนทันทีครับ";
      } else if (lower.includes("ชำระ") || lower.includes("จ่าย") || lower.includes("ปรับ") || lower.includes("กำหนด")) {
        botResponse = `📅 กำหนดชำระค่าเช่าห้องพักคือภายใน 'วันที่ ${utilityRates.dueDayOfMonth} ของทุกเดือน' ครับ หากชำระล่าช้าเกินกำหนดจะมีค่าปรับวันละ ฿${utilityRates.lateFeePerDay} บาท โดยสามารถสแกน QR Code PromptPay แบบฝังยอดสุทธิและแนบสลิปผ่านระบบได้เลยครับ`;
      } else if (lower.includes("ย้ายออก") || lower.includes("ออก")) {
        botResponse =
          "📦 ตามเงื่อนไขสัญญาเช่า ผู้เช่าต้องยื่นคำขอแจ้งออกจากห้องพักล่วงหน้าอย่างน้อย 30 วัน ผ่านเมนู 'สัญญาเช่า' เพื่อให้ฝ่ายบริหารนัดวันตรวจห้องและสรุปยอดเงินประกันคืนสุทธิเข้าบัญชีของท่านครับ";
      } else if (lower.includes("ผู้ดูแล") || lower.includes("คน") || lower.includes("ติดต่อ")) {
        // ส่งต่อการสนทนาให้ผู้ดูแลหอพักเมื่อไม่สามารถตอบคำถามได้
        botResponse =
          "📞 ระบบได้ส่งต่อข้อความของคุณไปยัง 'ผู้ดูแลหอพัก (Admin)' ผ่านระบบแจ้งเตือน LINE Official Account เรียบร้อยแล้วครับ เจ้าหน้าที่จะติดต่อกลับผ่านเบอร์โทรศัพท์หรือช่องแชทโดยเร็วที่สุดครับ";
        setIsEscalated(true);
        showToast("ส่งต่อบทสนทนาให้ผู้ดูแลหอพักเรียบร้อยแล้ว", "success");
      } else {
        botResponse = `ขอบคุณสำหรับคำถามครับ สำหรับเรื่อง "${query}" คุณสามารถเปิดดูข้อมูลเพิ่มเติมในเมนูของระบบ หรือพิมพ์ว่า "ต้องการคุยกับผู้ดูแลหอพัก" เพื่อให้ผมส่งเรื่องตรงถึงนิติบุคคลได้เลยครับ 😊`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponse,
          time: "เมื่อสักครู่",
        },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-full shadow-lg shadow-sky-500/30 hover:shadow-xl hover:scale-105 transition-all text-xs sm:text-sm font-bold"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        <span className="hidden sm:inline">AI Chatbot ผู้ช่วยหอพัก</span>
        <span className="sm:hidden">AI Bot</span>
      </button>

      {/* Chatbot Window Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-end p-2 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full sm:w-96 flex flex-col h-[560px] overflow-hidden animate-in fade-in slide-in-from-bottom-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">AI Chatbot ประจำหอพัก</h4>
                  <p className="text-2xs text-sky-100">ตอบอัตโนมัติ 24 ชม.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 text-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                          isUser
                            ? "bg-sky-600 text-white rounded-br-xs"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(p)}
                  className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-2xs whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="พิมพ์คำถามของคุณ..."
                className="flex-1 px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="p-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
