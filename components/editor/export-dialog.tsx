"use client";
import React, { useRef, useState } from "react";
import { Download, X, FileImage, FileText, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor";
import { A4_PORTRAIT, A4_LANDSCAPE } from "@/lib/data/templates";
import type { FactoryDocument } from "@/lib/types";

interface ExportDialogProps {
  exportRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

type ExportFormat = "png" | "pdf" | "html";

const TEMPLATE_DIMS: Record<string, { width: number; height: number }> = {
  "recipe-card": A4_PORTRAIT,
  "infographic-card": A4_LANDSCAPE,
  "beverage-card": A4_LANDSCAPE,
  "extended-recipe": A4_PORTRAIT,
};

async function exportPng(
  element: HTMLElement,
  filename: string,
  pixelRatio = 3
): Promise<void> {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(element, {
    pixelRatio,
    quality: 1,
    cacheBust: true,
    skipFonts: false,
  });
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

async function exportPdf(
  element: HTMLElement,
  filename: string,
  dims: { width: number; height: number }
): Promise<void> {
  const { toPng } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");

  const dataUrl = await toPng(element, { pixelRatio: 3, quality: 1, cacheBust: true });

  // A4 in mm: 210 × 297 (portrait) or 297 × 210 (landscape)
  const isLandscape = dims.width > dims.height;
  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = isLandscape ? 297 : 210;
  const pageH = isLandscape ? 210 : 297;
  doc.addImage(dataUrl, "PNG", 0, 0, pageW, pageH);
  doc.save(`${filename}.pdf`);
}

function exportHtml(doc: FactoryDocument, element: HTMLElement, filename: string): void {
  const lang = doc.fields && (doc.fields as {language?: string}).language === 'ar' ? 'ar' : 'en';
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.name} — Egnite Digital Factory</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #e8e8e8; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 20px; font-family: 'Inter', sans-serif; }
    .template-root { box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
    [dir="rtl"] { font-family: 'Cairo', sans-serif; }
  </style>
</head>
<body>
${element.outerHTML}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = globalThis.document.createElement("a") as HTMLAnchorElement;
  anchor.download = `${filename}.html`;
  anchor.href = url;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportDialog({ exportRef, onClose }: ExportDialogProps) {
  const { document, setExporting } = useEditorStore();
  const [progress, setProgress] = useState<ExportFormat | null>(null);

  if (!document) return null;

  const dims = TEMPLATE_DIMS[document.templateType] ?? A4_PORTRAIT;
  const safeName = document.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const run = async (fmt: ExportFormat) => {
    const el = exportRef.current;
    if (!el) return;
    setProgress(fmt);
    setExporting(true);
    try {
      if (fmt === "png") await exportPng(el, safeName);
      else if (fmt === "pdf") await exportPdf(el, safeName, dims);
      else if (fmt === "html") exportHtml(document as FactoryDocument, el, safeName);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Check console for details.");
    } finally {
      setProgress(null);
      setExporting(false);
    }
  };

  const formats: { id: ExportFormat; icon: React.ReactNode; label: string; desc: string }[] = [
    {
      id: "png",
      icon: <FileImage size={22} />,
      label: "PNG Image",
      desc: "High-resolution (3×) — ideal for social media and printing",
    },
    {
      id: "pdf",
      icon: <FileText size={22} />,
      label: "PDF Document",
      desc: "A4 PDF ready for print at any resolution",
    },
    {
      id: "html",
      icon: <Code2 size={22} />,
      label: "HTML File",
      desc: "Standalone HTML with embedded fonts — editable in browser",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gold-light/50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gold px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Download size={18} />
            <span className="font-bold text-base">Export Document</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Document info */}
        <div className="px-6 py-3 border-b border-gold-light/40 bg-cream text-sm text-ink-muted">
          <span className="font-medium text-ink">{document.name}</span>
          {" · "}
          {dims.width} × {dims.height}px · A4 {dims.width > dims.height ? "Landscape" : "Portrait"}
        </div>

        {/* Format options */}
        <div className="p-6 flex flex-col gap-3">
          {formats.map(({ id, icon, label, desc }) => (
            <button
              key={id}
              disabled={!!progress}
              onClick={() => run(id)}
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gold-light/50 hover:border-gold hover:bg-cream transition-all text-start disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="text-gold shrink-0">{icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-ink">{label}</div>
                <div className="text-xs text-ink-muted mt-0.5">{desc}</div>
              </div>
              {progress === id && (
                <div className="size-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>

        <div className="px-6 pb-5 text-center">
          <p className="text-[11px] text-ink-muted/60">
            PNG exports at 3× resolution for pixel-perfect quality
          </p>
        </div>
      </div>
    </div>
  );
}
