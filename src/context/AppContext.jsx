// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from "react";
import {
  initialRooms,
  initialTenants,
  initialContracts,
  initialInvoices,
  initialRepairs,
  initialAnnouncements,
  initialDepositRefunds,
  initialUtilityRates,
  initialLineChatMessages,
  aiAnalyticsSummary,
} from "../data/mockData";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Mode: 'tenant' or 'admin'
  const [currentRole, setCurrentRole] = useState("tenant");
  const [currentTenantId, setCurrentTenantId] = useState("T001");
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [admin2FAVerified, setAdmin2FAVerified] = useState(true);
  
  // App Data States
  const [rooms, setRooms] = useState(initialRooms);
  const [tenants, setTenants] = useState(initialTenants);
  const [contracts, setContracts] = useState(initialContracts);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [repairs, setRepairs] = useState(initialRepairs);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [depositRefunds, setDepositRefunds] = useState(initialDepositRefunds);
  const [utilityRates, setUtilityRates] = useState(initialUtilityRates);
  const [lineMessages, setLineMessages] = useState(initialLineChatMessages);
  const [toast, setToast] = useState(null);

  // Active navigation tab
  // For Tenant: 'room', 'contract', 'bills', 'repair', 'announcements', 'deposit', 'profile', 'line'
  // For Admin: 'dashboard', 'ai-insights', 'rooms', 'tenants', 'contracts', 'meters', 'billing', 'slips', 'payments', 'repairs', 'announcements', 'rates', 'line-oa', 'reports'
  const [tenantActiveTab, setTenantActiveTab] = useState("room");
  const [adminActiveTab, setAdminActiveTab] = useState("dashboard");

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper getters
  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];
  const currentRoom = rooms.find((r) => r.roomNumber === currentTenant?.assignedRoom);
  const currentContract = contracts.find((c) => c.tenantId === currentTenantId);
  const currentInvoices = invoices.filter((i) => i.tenantId === currentTenantId);
  const currentRepairs = repairs.filter((r) => r.tenantId === currentTenantId);
  const currentDepositRefund = depositRefunds.find((d) => d.tenantId === currentTenantId);

  // Tenant Actions
  const updateTenantProfile = (updatedFields) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === currentTenantId ? { ...t, ...updatedFields } : t))
    );
    showToast("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
  };

  const confirmContract = (contractNumber) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setContracts((prev) =>
      prev.map((c) =>
        c.contractNumber === contractNumber
          ? { ...c, confirmedByTenant: true, confirmedAt: formatted }
          : c
      )
    );
    showToast("ยืนยันการรับทราบสัญญาเช่าและเงื่อนไขเรียบร้อยแล้ว");
  };

  const requestRenewal = (contractNumber, months, note) => {
    const nowStr = new Date().toLocaleString("th-TH");
    setContracts((prev) =>
      prev.map((c) =>
        c.contractNumber === contractNumber
          ? {
              ...c,
              renewalRequest: {
                requestedAt: nowStr,
                requestedMonths: months,
                status: "pending",
                note,
              },
            }
          : c
      )
    );
    showToast("ยื่นคำขอต่ออายุสัญญาเรียบร้อยแล้ว รอการอนุมัติจากผู้ดูแล");
  };

  const requestMoveOut = (contractNumber, moveOutDate, reason) => {
    const nowStr = new Date().toLocaleString("th-TH");
    setContracts((prev) =>
      prev.map((c) =>
        c.contractNumber === contractNumber
          ? {
              ...c,
              moveOutRequest: {
                requestedAt: nowStr,
                moveOutDate,
                reason,
                status: "pending",
              },
            }
          : c
      )
    );
    showToast("ยื่นคำขอแจ้งออกจากห้องพักเรียบร้อยแล้ว ผู้ดูแลจะติดต่อกลับ");
  };

  const submitSlipPayment = (invoiceNumber, paymentInfo) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber === invoiceNumber) {
          return {
            ...inv,
            status: "under_review",
            paymentDetails: {
              ...paymentInfo,
              slipVerifyResult: "สลิปถูกต้อง (Slip OK: ระบบ AI ตรวจสอบยอดเงินและเลขบัญชีตรงกัน)",
              verifyStatus: "pending",
              rejectionReason: "",
            },
          };
        }
        return inv;
      })
    );
    showToast("แจ้งชำระเงินและอัปโหลดสลิปเรียบร้อยแล้ว อยู่ระหว่างตรวจสอบ");
  };

  const submitRepairRequest = (repairData) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const newId = `REP-${now.getFullYear()}-${String(repairs.length + 1).padStart(3, "0")}`;
    const newTicket = {
      id: newId,
      tenantId: currentTenantId,
      tenantName: currentTenant.name,
      roomNumber: currentTenant.assignedRoom,
      createdAt: formattedDate,
      status: "pending",
      adminNote: "รับเรื่องในระบบเรียบร้อย รอเจ้าหน้าที่จ่ายงานช่าง",
      ...repairData,
    };
    setRepairs([newTicket, ...repairs]);
    showToast(`แจ้งซ่อมรหัส ${newId} สำเร็จ เจ้าหน้าที่จะเร่งดำเนินการ`);
  };

  // Admin Actions
  const adminVerifySlip = (invoiceNumber, decision, reason = "") => {
    const nowStr = new Date().toLocaleString("th-TH");
    const recNumber = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber === invoiceNumber) {
          if (decision === "approve") {
            return {
              ...inv,
              status: "paid",
              paymentDetails: {
                ...inv.paymentDetails,
                verifyStatus: "approved",
                reviewedAt: nowStr,
              },
              receipt: {
                receiptNumber: recNumber,
                paidAmount: inv.paymentDetails?.transferAmount || inv.netTotal,
                paidDate: nowStr.split(" ")[0],
                issuedDate: nowStr,
              },
            };
          } else {
            return {
              ...inv,
              status: "pending_payment",
              paymentDetails: {
                ...inv.paymentDetails,
                verifyStatus: "rejected",
                rejectionReason: reason || "ยอดเงินไม่ตรง หรือสลิปไม่ชัดเจน",
                reviewedAt: nowStr,
              },
            };
          }
        }
        return inv;
      })
    );
    showToast(
      decision === "approve"
        ? `อนุมัติการชำระเงินและออกใบเสร็จเลขที่ ${recNumber} อัตโนมัติเรียบร้อย`
        : `ปฏิเสธการชำระเงินแล้ว ระบบได้แจ้งเตือนผู้เช่าให้แก้ไข`,
      decision === "approve" ? "success" : "error"
    );
  };

  const adminRecordManualPayment = (invoiceNumber, data) => {
    const nowStr = new Date().toLocaleString("th-TH");
    const recNumber = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber === invoiceNumber) {
          return {
            ...inv,
            status: "paid",
            paymentDetails: {
              transferAmount: data.amount,
              transferDateTime: data.dateTime || nowStr,
              sourceAccountName: "ชำระเงินสด / รับตรงที่สำนักงาน",
              sourceBank: data.method || "เงินสด",
              slipUrl: "",
              slipVerifyResult: "ชำระด้วยตนเอง (Manual Cash/Direct)",
              verifyStatus: "approved",
              reviewedAt: nowStr,
              note: data.note,
            },
            receipt: {
              receiptNumber: recNumber,
              paidAmount: data.amount,
              paidDate: (data.dateTime || nowStr).split(" ")[0],
              issuedDate: nowStr,
            },
          };
        }
        return inv;
      })
    );
    showToast(`บันทึกการชำระเงินด้วยตนเองและออกใบเสร็จ ${recNumber} เรียบร้อยแล้ว`);
  };

  const adminSendNotification = (invoiceNumber, channel = "all") => {
    showToast(`ส่งการแจ้งเตือนยอดชำระไปยังผู้เช่าผ่าน ${channel === "all" ? "Email และ LINE OA" : channel} สำเร็จ`);
  };

  const adminApproveRenewal = (contractNumber) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.contractNumber === contractNumber && c.renewalRequest) {
          const currentEnd = new Date(c.endDate);
          currentEnd.setMonth(currentEnd.getMonth() + (c.renewalRequest.requestedMonths || 12));
          const newEndDate = currentEnd.toISOString().split("T")[0];
          return {
            ...c,
            endDate: newEndDate,
            renewalRequest: {
              ...c.renewalRequest,
              status: "approved",
            },
          };
        }
        return c;
      })
    );
    showToast("อนุมัติคำขอต่ออายุสัญญาเรียบร้อยแล้ว วันสิ้นสุดสัญญาได้รับการขยายแล้ว");
  };

  const adminRejectRenewal = (contractNumber, reason = "") => {
    setContracts((prev) =>
      prev.map((c) =>
        c.contractNumber === contractNumber && c.renewalRequest
          ? {
              ...c,
              renewalRequest: {
                ...c.renewalRequest,
                status: "rejected",
                rejectionReason: reason,
              },
            }
          : c
      )
    );
    showToast("ปฏิเสธคำขอต่ออายุสัญญาเช่าเรียบร้อยแล้ว", "error");
  };

  const adminConfirmMoveOut = (contractNumber, confirmedDate) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.contractNumber === contractNumber && c.moveOutRequest
          ? {
              ...c,
              moveOutRequest: {
                ...c.moveOutRequest,
                status: "approved",
                confirmedDate: confirmedDate || c.moveOutRequest.moveOutDate,
              },
            }
          : c
      )
    );
    showToast("ยืนยันวันแจ้งออกจากห้องพักของผู้เช่าเรียบร้อยแล้ว");
  };

  const adminUpdateRepairStatus = (repairId, status, adminNote = "") => {
    const nowStr = new Date().toLocaleString("th-TH");
    setRepairs((prev) =>
      prev.map((r) =>
        r.id === repairId
          ? {
              ...r,
              status,
              adminNote: adminNote || r.adminNote,
              updatedAt: nowStr,
            }
          : r
      )
    );
    showToast(`อัปเดตสถานะงานซ่อม ${repairId} เป็น ${status === "completed" ? "เสร็จสิ้น" : status === "in_progress" ? "กำลังดำเนินการ" : "รอดำเนินการ"}`);
  };

  const adminUpdateUtilityRates = (newRates) => {
    setUtilityRates(newRates);
    showToast("อัปเดตอัตราค่าบริการและเงื่อนไขการเรียกเก็บเงินสำเร็จ");
  };

  const adminRecordMeter = (meterEntry) => {
    // Check if invoice needs to be generated or updated
    showToast(`บันทึกเลขมิเตอร์ห้อง ${meterEntry.roomNumber} ประจำงวด ${meterEntry.monthYear} สำเร็จ`);
  };

  const adminGenerateInvoice = (invoiceData) => {
    setInvoices([invoiceData, ...invoices]);
    showToast(`สร้างใบแจ้งหนี้เลขที่ ${invoiceData.invoiceNumber} และส่งการแจ้งเตือนสำเร็จ`);
  };

  const adminAddRoom = (roomData) => {
    setRooms([...rooms, roomData]);
    showToast(`เพิ่มห้องพัก ${roomData.roomNumber} สำเร็จ`);
  };

  const adminUpdateRoom = (roomData) => {
    setRooms(rooms.map((r) => (r.id === roomData.id ? roomData : r)));
    showToast(`อัปเดตข้อมูลห้องพัก ${roomData.roomNumber} เรียบร้อย`);
  };

  const adminDeleteRoom = (roomId) => {
    setRooms(rooms.filter((r) => r.id !== roomId));
    showToast("ลบห้องพักเรียบร้อยแล้ว");
  };

  const adminAddTenant = (tenantData) => {
    setTenants([...tenants, tenantData]);
    showToast(`เพิ่มผู้เช่า ${tenantData.name} เข้าสู่ระบบสำเร็จ`);
  };

  const adminUpdateTenant = (tenantData) => {
    setTenants(tenants.map((t) => (t.id === tenantData.id ? tenantData : t)));
    showToast(`อัปเดตข้อมูลผู้เช่า ${tenantData.name} สำเร็จ`);
  };

  const adminSendInvitation = (tenantId) => {
    showToast("ส่งลิงก์คำเชิญเปิดใช้งานบัญชีไปยัง Email ผู้เช่าเรียบร้อยแล้ว");
  };

  const adminAddAnnouncement = (announcementData) => {
    setAnnouncements([announcementData, ...announcements]);
    showToast("สร้างและเผยแพร่ประกาศข่าวสารเรียบร้อยแล้ว");
  };

  const adminDeleteAnnouncement = (annId) => {
    setAnnouncements(announcements.filter((a) => a.id !== annId));
    showToast("ลบประกาศเรียบร้อยแล้ว");
  };

  const adminRecordDepositDeduction = (refundData) => {
    setDepositRefunds([refundData, ...depositRefunds.filter((d) => d.id !== refundData.id)]);
    showToast("บันทึกรายการหักเงินประกันและยอดคืนสุทธิเรียบร้อยแล้ว");
  };

  const sendLineMessage = (text) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg = {
      id: Date.now(),
      sender: currentRole === "tenant" ? "tenant" : "admin",
      senderName: currentRole === "tenant" ? `${currentTenant.name} (${currentTenant.assignedRoom})` : "ผู้ดูแลหอพัก (Admin)",
      text,
      time: timeStr,
    };
    setLineMessages((prev) => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentTenantId,
        setCurrentTenantId,
        isAuthenticated,
        setIsAuthenticated,
        admin2FAVerified,
        setAdmin2FAVerified,
        tenantActiveTab,
        setTenantActiveTab,
        adminActiveTab,
        setAdminActiveTab,
        rooms,
        tenants,
        contracts,
        invoices,
        repairs,
        announcements,
        depositRefunds,
        utilityRates,
        lineMessages,
        aiAnalyticsSummary,
        toast,
        showToast,
        // Getters
        currentTenant,
        currentRoom,
        currentContract,
        currentInvoices,
        currentRepairs,
        currentDepositRefund,
        // Tenant Methods
        updateTenantProfile,
        confirmContract,
        requestRenewal,
        requestMoveOut,
        submitSlipPayment,
        submitRepairRequest,
        // Admin Methods
        adminVerifySlip,
        adminRecordManualPayment,
        adminSendNotification,
        adminApproveRenewal,
        adminRejectRenewal,
        adminConfirmMoveOut,
        adminUpdateRepairStatus,
        adminUpdateUtilityRates,
        adminRecordMeter,
        adminGenerateInvoice,
        adminAddRoom,
        adminUpdateRoom,
        adminDeleteRoom,
        adminAddTenant,
        adminUpdateTenant,
        adminSendInvitation,
        adminAddAnnouncement,
        adminDeleteAnnouncement,
        adminRecordDepositDeduction,
        sendLineMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
