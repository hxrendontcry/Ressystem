// src/components/common/Toast.jsx
import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 shadow-xl rounded-xl transition-all animate-bounce">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-500 shrink-0" />}
      <span className="text-sm font-medium text-slate-800">{toast.message}</span>
    </div>
  );
};
