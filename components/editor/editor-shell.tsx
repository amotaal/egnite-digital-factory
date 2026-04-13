"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Save, Download, ArrowLeft, Check, Clock,
  Loader2, Languages, PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CanvasPreview } from "./canvas-preview";
import { FieldPanel } from "./field-panel";
import { ExportDialog } from "./export-dialog";
import { useEditorStore } from "@/lib/store/editor";
import { useToast } from "@/components/ui/toast";
import type { FactoryDocument } from "@/lib/types";

interface EditorShellProps {
  initialDocument: FactoryDocument;
}

export function EditorShell({ initialDocument }: EditorShellProps) {
  const router = useRouter();
  const exportRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [showExport, setShowExport] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [nameInput, setNameInput] = useState(initialDocument.name);

  const {
    document, setDocument, setDocumentName, isDirty, isSaving, lastSaved,
    lang, setLang, setSaving, markSaved,
  } = useEditorStore();

  // Load document on mount and sync name input
  useEffect(() => {
    setDocument(initialDocument);
    setNameInput(initialDocument.name);
  }, [initialDocument, setDocument]);

  // Re-sync name when doc id changes
  useEffect(() => {
    if (document) setNameInput(document.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?.id]);

  // Collapse the AR panel by default on narrow screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) setRightOpen(false);
      if (window.innerWidth < 1024) setLeftOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Warn before closing/refreshing the tab with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const save = useCallback(async () => {
    const current = useEditorStore.getState().document;
    if (!current) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: current.name, fields: current.fields }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      markSaved();
      toast.success("Saved");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [setSaving, markSaved, toast]);

  // Auto-save every 30s when dirty
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(save, 30_000);
    return () => clearTimeout(timer);
  }, [isDirty, save]);

  // Cmd/Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  const handleBack = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Leave without saving?")) return;
    }
    router.push("/dashboard");
  };

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const langOptions: { value: "en" | "ar" | "bilingual"; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ar", label: "AR" },
    { value: "bilingual", label: "EN+AR" },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* ── Editor Toolbar ─────────────────────────────────────────────── */}
      <div className="h-12 bg-white border-b border-gold-light/60 flex items-center px-3 gap-2 shrink-0">
        <button
          onClick={() => setLeftOpen((v) => !v)}
          className="text-ink-muted hover:text-ink p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          title={leftOpen ? "Hide English panel" : "Show English panel"}
          aria-label={leftOpen ? "Hide English panel" : "Show English panel"}
        >
          {leftOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>

        <div className="h-5 w-px bg-gold-light mx-1" />

        <input
          className="text-sm font-semibold text-ink bg-transparent border-none outline-none flex-1 min-w-0 truncate hover:bg-cream-dark focus:bg-cream-dark rounded px-1 transition-colors"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={(e) => {
            const trimmed = e.target.value.trim() || document.name;
            setNameInput(trimmed);
            setDocumentName(trimmed);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          spellCheck={false}
          title="Click to rename document"
          aria-label="Document name"
        />

        <div className="flex-1" />

        {/* Language toggle — affects canvas preview only */}
        <div className="flex items-center gap-1 bg-cream rounded-lg p-1" role="tablist" aria-label="Canvas language">
          <Languages size={13} className="text-ink-muted ms-1" />
          {langOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLang(opt.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                lang === opt.value
                  ? "bg-gold text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
              role="tab"
              aria-selected={lang === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gold-light mx-1" />

        {/* Save status */}
        <div className="text-xs text-ink-muted flex items-center gap-1.5 min-w-[72px]" aria-live="polite">
          {isSaving ? (
            <>
              <Loader2 size={11} className="animate-spin" />
              Saving…
            </>
          ) : isDirty ? (
            <>
              <Clock size={11} />
              Unsaved
            </>
          ) : lastSaved ? (
            <>
              <Check size={11} className="text-green-600" />
              Saved
            </>
          ) : null}
        </div>

        <Button variant="secondary" size="sm" onClick={save} disabled={isSaving} className="gap-1.5">
          <Save size={14} />
          Save
        </Button>

        <Button variant="primary" size="sm" onClick={() => setShowExport(true)} className="gap-1.5">
          <Download size={14} />
          Export
        </Button>

        <button
          onClick={() => setRightOpen((v) => !v)}
          className="text-ink-muted hover:text-ink p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          title={rightOpen ? "Hide Arabic panel" : "Show Arabic panel"}
          aria-label={rightOpen ? "Hide Arabic panel" : "Show Arabic panel"}
        >
          {rightOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
      </div>

      {/* ── Main layout: EN | Canvas | AR ──────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: English editor */}
        {leftOpen && (
          <aside
            className="w-72 shrink-0 bg-white border-e border-gold-light/50 flex flex-col overflow-hidden"
            aria-label="English content editor"
          >
            <div className="px-3 py-2 border-b border-gold-light/30 bg-cream flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gold">
                🇬🇧 English
              </span>
              <span className="text-[9px] text-ink-muted">LTR</span>
            </div>
            <FieldPanel lang="en" />
          </aside>
        )}

        {/* Canvas */}
        <CanvasPreview document={document} lang={lang} exportRef={exportRef} />

        {/* Right sidebar: Arabic editor */}
        {rightOpen && (
          <aside
            className="w-72 shrink-0 bg-white border-s border-gold-light/50 flex flex-col overflow-hidden"
            aria-label="Arabic content editor"
            dir="rtl"
          >
            <div className="px-3 py-2 border-b border-gold-light/30 bg-cream flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gold">
                🇸🇦 العربية
              </span>
              <span className="text-[9px] text-ink-muted">RTL</span>
            </div>
            <FieldPanel lang="ar" />
          </aside>
        )}
      </div>

      {/* Export dialog */}
      {showExport && (
        <ExportDialog exportRef={exportRef} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
