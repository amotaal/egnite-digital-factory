"use client";
import { create } from "zustand";
import type { FactoryDocument } from "@/lib/types";

interface EditorState {
  document: FactoryDocument | null;
  selectedField: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
  lastSaved: Date | null;
  lang: "en" | "ar" | "bilingual";

  // Actions
  setDocument: (doc: FactoryDocument) => void;
  setDocumentName: (name: string) => void;
  updateFields: (partial: Record<string, unknown>) => void;
  setSelectedField: (field: string | null) => void;
  setLang: (lang: "en" | "ar" | "bilingual") => void;
  setSaving: (v: boolean) => void;
  setExporting: (v: boolean) => void;
  markSaved: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: null,
  selectedField: null,
  isDirty: false,
  isSaving: false,
  isExporting: false,
  lastSaved: null,
  lang: "en",

  setDocument: (doc) =>
    set({ document: doc, isDirty: false, lang: (doc.fields as { language?: string }).language as "en" | "ar" | "bilingual" ?? "en" }),

  setDocumentName: (name) => {
    const { document } = get();
    if (!document) return;
    set({ document: { ...document, name }, isDirty: true });
  },

  updateFields: (partial) => {
    const { document } = get();
    if (!document) return;
    set({
      document: {
        ...document,
        fields: { ...document.fields, ...partial },
      },
      isDirty: true,
    });
  },

  setSelectedField: (field) => set({ selectedField: field }),

  setLang: (lang) => {
    set({ lang });
    get().updateFields({ language: lang });
  },

  setSaving: (v) => set({ isSaving: v }),
  setExporting: (v) => set({ isExporting: v }),

  markSaved: () => set({ isDirty: false, lastSaved: new Date() }),
}));
