// src/components/admin/AdminLineOAChat.jsx
import React, { useState } from "react";
import {
  MessageCircle,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Smartphone,
  Bell,
  Receipt,
  Wrench,
  Search,
  Filter,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminLineOAChat = () => {
  const { tenants, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'connected', 'pending'
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(true);

  // Simulated LINE Connection Status for 48 rooms
  // 43 connected, 5 pending
  const [sentInvites, setSentInvites] = useState({});

  const lineId = "@suksabai_residence";
  const lineAddFriendUrl = "https://line.me/R/ti/p/@suksabai_oa";
  const lineManagerUrl = "https://manager.line.biz";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lineAddFriendUrl);
    setCopiedLink(true);
    showToast("คัดลอกลิงก์แอดไลน์เรียบร้อยแล้ว", "success");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendInvite = (tenant) => {
    setSentInvites((prev) => ({ ...prev, [tenant.id]: true }));
    showToast(
      `ส่ง SMS & Email เชิญแอดไลน์ให้คุณ ${tenant.name} (ห้อง ${tenant.assignedRoom}) เรียบร้อยแล้ว`,
      "success"
    );
  };

  const handleDownloadQr = () => {
    showToast("กำลังดาวน์โหลดภาพ QR Code สำหรับพิมพ์ติดป้ายประชาสัมพันธ์...", "success");
  };

  // Filtered tenants list
  const filteredTenants = tenants.filter((t) => {
    // Generate deterministic status based on room number
    const isPending = ["104", "205", "308", "402", "410"].includes(t.assignedRoom);
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedRoom.includes(searchTerm) ||
      t.phone.includes(searchTerm);

    if (statusFilter === "connected") return matchesSearch && !isPending;
    if (statusFilter === "pending") return matchesSearch && isPending;
    return matchesSearch;
  });

  const connectedCount = tenants.length - 5;
  const pendingCount = 5;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            LINE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800">
                จัดการ LINE Official Account (LINE OA)
              </h3>
              <span className="text-2xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Account</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ระบบศูนย์กลางจัดการ LINE Official Account และติดตามการแอดไลน์ของผู้เช่า
            </p>
          </div>
        </div>

        {/* Real LINE Manager External Link Button */}
        <a
          href={lineManagerUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-700 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>เปิดระบบแชทใน LINE Official Account Manager</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
          <span className="text-2xs font-semibold text-slate-400 block">ผู้เช่าแอดไลน์แล้ว</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{connectedCount}</span>
            <span className="text-xs text-slate-500">/ {tenants.length} ห้อง</span>
          </div>
          <span className="text-3xs text-emerald-600 font-medium block mt-1">
            อัตราการเชื่อมต่อ {Math.round((connectedCount / tenants.length) * 100)}%
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
          <span className="text-2xs font-semibold text-slate-400 block">ยังไม่ได้แอดไลน์</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
            <span className="text-xs text-slate-500">ห้อง</span>
          </div>
          <span className="text-3xs text-amber-600 font-medium block mt-1">
            รอส่งคำเชิญซ้ำ
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
          <span className="text-2xs font-semibold text-slate-400 block">บิลส่งผ่าน LINE เดือนนี้</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-sky-600">48</span>
            <span className="text-xs text-slate-500">ฉบับ</span>
          </div>
          <span className="text-3xs text-sky-600 font-medium block mt-1">
            ระบบส่งพร้อม QR PromptPay
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
          <span className="text-2xs font-semibold text-slate-400 block">แจ้งเตือนงานซ่อมผ่าน LINE</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-600">12</span>
            <span className="text-xs text-slate-500">รายการ</span>
          </div>
          <span className="text-3xs text-purple-600 font-medium block mt-1">
            อัปเดตสถานะช่างอัตโนมัติ
          </span>
        </div>
      </div>

      {/* 2 Column Section: QR Code Tools & Automated Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Code & Sharing Materials */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-sky-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>QR Code และลิงก์สำหรับผู้เช่า</span>
              </h4>
              <span className="text-2xs font-bold text-slate-600">{lineId}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center my-4">
              <div className="w-40 h-40 bg-white rounded-xl p-2 mx-auto shadow-xs border border-slate-200 flex items-center justify-center relative">
                {qrLoaded ? (
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fline.me%2FR%2Fti%2Fp%2F%40suksabai_oa"
                    alt="LINE OA QR Code"
                    className="w-full h-full object-contain"
                    onError={() => setQrLoaded(false)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <QrCode className="w-28 h-28 text-white" />
                  </div>
                )}
                {qrLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-3xs font-bold shadow-sm">
                      LINE
                    </div>
                  </div>
                )}
              </div>
              <p className="text-2xs text-slate-500 mt-2 font-medium">
                QR Code เพิ่มเพื่อนบัญชีทางการ หอพักสุขสบาย
              </p>
            </div>

            {/* Direct Link Input with Copy */}
            <div className="space-y-1.5">
              <label className="block text-2xs font-semibold text-slate-600">
                ลิงก์เพิ่มเพื่อน (LINE Add Friend URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={lineAddFriendUrl}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "คัดลอกแล้ว" : "คัดลอก"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleDownloadQr}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold hover:bg-sky-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>โหลด QR ติดป้าย</span>
            </button>
            <a
              href={lineAddFriendUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ทดสอบเปิดใน LINE</span>
            </a>
          </div>
        </div>

        {/* Right Column: Automated Messaging Triggers */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              <span>ระบบแจ้งเตือนอัตโนมัติผ่าน LINE OA (Automated Triggers)</span>
            </h4>
            <span className="text-2xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              เปิดใช้งานครบทุกฟังก์ชัน
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">ส่งใบแจ้งหนี้ประจำเดือนอัตโนมัติ</h5>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    ส่งบิลค่าเช่า ค่าน้ำ ค่าไฟ พร้อมปุ่มสแกน QR Code PromptPay แบบฝังยอดสุทธิให้ผู้เช่าทุกห้องทาง LINE
                  </p>
                </div>
              </div>
              <span className="text-3xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                ทำงานอัตโนมัติ
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">ส่งใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Receipt)</h5>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    เมื่อผู้เช่าส่งสลิปและระบบตรวจสอบความถูกต้องสำเร็จ จะส่งใบเสร็จรับเงินเป็นหลักฐานเข้า LINE ทันที
                  </p>
                </div>
              </div>
              <span className="text-3xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                ทำงานอัตโนมัติ
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">อัปเดตสถานะงานแจ้งซ่อม</h5>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    แจ้งเตือนเมื่อนิติบุคคลรับเรื่อง นัดวันเข้าซ่อมของช่าง และแจ้งเตือนเมื่อซ่อมแซมเสร็จสิ้น
                  </p>
                </div>
              </div>
              <span className="text-3xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                ทำงานอัตโนมัติ
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">ส่งต่อการสนทนาเข้าห้องแชท LINE OA</h5>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    เมื่อผู้เช่าพิมพ์ทักทายหรือมีคำถาม ข้อความจะถูกส่งตรงเข้าแอป LINE Official Account Manager ของเจ้าของหอพักทันที
                  </p>
                </div>
              </div>
              <span className="text-3xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                ทำงานอัตโนมัติ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Connection Status Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
          <div>
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              <span>สถานะการเชื่อมต่อ LINE Official Account ของผู้เช่าทุกห้อง</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              ตรวจสอบว่าห้องพักใดแอดไลน์แล้ว และสามารถกดส่ง SMS/Email เชิญชวนห้องที่ยังไม่ได้แอดได้
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === "all" ? "bg-white text-slate-800 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                ทั้งหมด ({tenants.length})
              </button>
              <button
                onClick={() => setStatusFilter("connected")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === "connected" ? "bg-white text-emerald-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                แอดแล้ว ({connectedCount})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === "pending" ? "bg-white text-amber-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                ยังไม่แอด ({pendingCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, ห้อง, เบอร์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-3 px-4 font-semibold whitespace-nowrap text-center">ห้อง</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">ชื่อผู้เช่า</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">เบอร์โทรศัพท์</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">บัญชี LINE ที่เชื่อมต่อ</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap text-center">สถานะ LINE</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredTenants.map((t) => {
              const isPending = ["104", "205", "308", "402", "410"].includes(t.assignedRoom);
              const isInviteSent = sentInvites[t.id];

              return (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-sky-900 text-center whitespace-nowrap">
                    {t.assignedRoom}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {t.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {t.phone}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {!isPending ? (
                      <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {t.name.split(" ")[0]} (LINE User)
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">ยังไม่พบข้อมูล</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {!isPending ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-2xs font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>เชื่อมต่อแล้ว</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-2xs font-semibold inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>ยังไม่ได้แอดไลน์</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isPending ? (
                      <button
                        onClick={() => handleSendInvite(t)}
                        disabled={isInviteSent}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-2xs font-semibold transition-colors ${
                          isInviteSent
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                        }`}
                      >
                        {isInviteSent ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>ส่งคำเชิญแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>ส่งลิงก์แอด LINE</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-2xs text-slate-400">พร้อมรับบิล/ข้อความ</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
