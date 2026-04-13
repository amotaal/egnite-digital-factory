"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Save, Download, Globe, ArrowLeft, Check, Clock,
  Loader2, Languages
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CanvasPreview } from "./canvas-preview";
import { FieldPanel } from "./field-panel";
import { ExportDialog } from "./export-dialog";
import { useEditorStore } from "@/lib/store/editor";
import type { FactoryDocument } from "@/lib/types";

interface EditorShellProps {
  initialDocument: FactoryDocument;
}

export function EditorShell({ initialDocument }: EditorShellProps) {
  const router = useRouter();
  const exportRef = useRef<HTMLDivElement>(null);
  const [showExport, setShowExport] = useState(false);

  const {
    document, setDocument, isDirty, isSaving, lastSaved,
    lang, setLang, setSaving, markSaved,
  } = useEditorStore();

  // Load document on mount
  useEffect(() => {
    setDocument(initialDocument);
  }, [initialDocument, setDocument]);

  // Auto-save every 30s when dirty
  const save = useCallback(async () => {
    if (!document) return;
    setSaving(true);
    try {
      await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: document.name, fields: document.fields }),
      });
      markSaved();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }, [document, setSaving, markSaved]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(save, 30_000);
    return () => clearTimeout(timer);
  }, [isDirty, save]);

  // Keyboard shortcut: Cmd/Ctrl+S
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

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const langOptions: { value: "en" | "ar" | "bilingual"; label: string }[] = [
    { value: "en", label: "English" },
    { value: "ar", label: "عربي" },
    { value: "bilingual", label: "EN + AR" },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* ── Editor Toolbar ─────────────────────────────────────────────── */}
      <div className="h-12 bg-white border-b border-gold-light/60 flex items-center px-3 gap-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-1.5">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>

        <div className="h-5 w-px bg-gold-light mx-1" />

        {/* Document name */}
        <input
          className="text-sm font-semibold text-ink bg-transparent border-none outline-none flex-1 min-w-0 truncate"
          value={document.name}
          onChange={(e) => useEditorStore.getState().updateFields({ __name: e.target.value })}
          onBlur={(e) => {
            const store = useEditorStore.getState();
            if (store.document) {
              store.setDocument({ ...store.document, name: e.target.value });
              store.updateFields({}); // trigger dirty
            }
          }}
          spellCheck={false}
        />

        <div className="flex-1" />

        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-cream rounded-lg p-1">
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
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gold-light mx-1" />

        {/* Save status */}
        <div className="text-xs text-ink-muted flex items-center gap-1.5 min-w-[80px]">
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
      </div>

      {/* ── Main layout ────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: Field panel */}
        <aside className="w-72 shrink-0 bg-white border-e border-gold-light/50 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-gold-light/30 bg-cream">
            <span className="text-[10px] font-black uppercase tracking-widest text-gold">
              Content Editor
            </span>
          </div>
          <FieldPanel />
        </aside>

        {/* Canvas */}
        <CanvasPreview document={document} lang={lang} exportRef={exportRef} />
      </div>

      {/* Export dialog */}
      {showExport && (
        <ExportDialog exportRef={exportRef} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
