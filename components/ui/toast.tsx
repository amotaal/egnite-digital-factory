"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++toastIdCounter;
    setToasts((list) => [...list, { id, kind, message }]);
    // Auto-dismiss after 3.5s
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value: ToastContextValue = {
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
    dismiss: (id) => setToasts((list) => list.filter((t) => t.id !== id)),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 end-4 z-[200] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => value.dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Animate in after mount
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const icon =
    toast.kind === "success" ? (
      <CheckCircle2 size={18} className="text-green-600 shrink-0" />
    ) : toast.kind === "error" ? (
      <XCircle size={18} className="text-red-600 shrink-0" />
    ) : (
      <Info size={18} className="text-gold shrink-0" />
    );

  const border =
    toast.kind === "success"
      ? "border-green-200"
      : toast.kind === "error"
      ? "border-red-200"
      : "border-gold-light";

  return (
    <div
      className={`pointer-events-auto min-w-[240px] max-w-sm bg-white border ${border} rounded-xl shadow-lg px-4 py-3 flex items-start gap-2.5 transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
      role={toast.kind === "error" ? "alert" : "status"}
    >
      {icon}
      <p className="text-sm text-ink flex-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-ink-muted hover:text-ink p-0.5 rounded"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * Hook for emitting toasts. Falls back to a no-op logger if used outside the
 * provider so that early-rendering components don't crash.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  return {
    success: (m) => console.log("✓", m),
    error: (m) => console.error("✕", m),
    info: (m) => console.log("ℹ", m),
    dismiss: () => {},
  };
}
