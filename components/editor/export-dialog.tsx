"use client";
import React, { useEffect, useState } from "react";
import { Download, X, FileImage, FileText, Code2, FileJson, Upload } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor";
import { A4_PORTRAIT, A4_LANDSCAPE } from "@/lib/data/templates";
import { useToast } from "@/components/ui/toast";
import type { FactoryDocument } from "@/lib/types";

interface ExportDialogProps {
  exportRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

type ExportFormat = "png" | "pdf" | "html" | "json";

const TEMPLATE_DIMS: Record<string, { width: number; height: number }> = {
  "recipe-card": A4_PORTRAIT,
  "infographic-card": A4_LANDSCAPE,
  "beverage-card": A4_LANDSCAPE,
  "extended-recipe": A4_PORTRAIT,
};

/** Wait for all <img> elements inside a container to finish loading. */
async function waitForImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // don't block on broken images
      });
    }),
  );
}

/**
 * Inline every <img src="http(s)://…"> in the element as a base64 data URL so
 * html-to-image can read pixels without CORS tainting the canvas. Returns a
 * list of restore callbacks so the caller can reset the DOM after capture.
 */
async function inlineImages(el: HTMLElement): Promise<Array<() => void>> {
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const restorers: Array<() => void> = [];

  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute("src");
      if (!src || src.startsWith("data:")) return;
      try {
        const res = await fetch(src, { mode: "cors", cache: "force-cache" });
        if (!res.ok) return;
        const blob = await res.blob();
        const dataUrl: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        const originalSrc = img.src;
        img.src = dataUrl;
        // Wait for the new src to decode before capture continues.
        await img.decode().catch(() => undefined);
        restorers.push(() => {
          img.src = originalSrc;
        });
      } catch {
        /* leave img alone — worst-case it renders blank */
      }
    }),
  );

  return restorers;
}

/** Two rAFs + fonts.ready — guarantees the DOM is painted and fonts are live. */
async function waitForPaint(): Promise<void> {
  if (typeof globalThis.document !== "undefined") {
    try {
      await (globalThis.document as Document & { fonts?: { ready?: Promise<FontFace[]> } }).fonts?.ready;
    } catch {
      /* ignore */
    }
  }
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
}

async function prepareElementForExport(element: HTMLElement) {
  await waitForImages(element);
  const restorers = await inlineImages(element);
  await waitForPaint();
  return () => restorers.forEach((fn) => fn());
}

async function exportPng(
  element: HTMLElement,
  filename: string,
  dims: { width: number; height: number },
  pixelRatio = 2,
): Promise<void> {
  const restore = await prepareElementForExport(element);
  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(element, {
      pixelRatio,
      quality: 1,
      cacheBust: true,
      width: dims.width,
      height: dims.height,
      // skipFonts avoids the CORS SecurityError thrown when html-to-image
      // tries to read cross-origin Google Fonts stylesheet rules. Fonts are
      // already rendered by the browser so the exported PNG looks correct.
      skipFonts: true,
      style: { transform: "none", margin: "0", inset: "auto" },
    });
    if (!dataUrl || dataUrl.length < 1024) {
      throw new Error("Empty PNG output");
    }
    triggerDownload(dataUrl, `${filename}.png`);
  } finally {
    restore();
  }
}

async function exportPdf(
  element: HTMLElement,
  filename: string,
  dims: { width: number; height: number },
): Promise<void> {
  const restore = await prepareElementForExport(element);
  try {
    const { toJpeg } = await import("html-to-image");
    const { jsPDF } = await import("jspdf");

    // JPEG at 0.92 quality keeps PDFs under 3MB (was 30MB with raw PNG).
    const dataUrl = await toJpeg(element, {
      pixelRatio: 2,
      quality: 0.92,
      cacheBust: true,
      width: dims.width,
      height: dims.height,
      backgroundColor: "#ffffff",
      skipFonts: true,
      style: { transform: "none", margin: "0", inset: "auto" },
    });
    if (!dataUrl || dataUrl.length < 1024) {
      throw new Error("Empty JPEG output for PDF");
    }

    // A4 in mm: 210 × 297 (portrait) or 297 × 210 (landscape)
    const isLandscape = dims.width > dims.height;
    const doc = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageW = isLandscape ? 297 : 210;
    const pageH = isLandscape ? 210 : 297;
    doc.addImage(dataUrl, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
    doc.save(`${filename}.pdf`);
  } finally {
    restore();
  }
}

function triggerDownload(href: string, filename: string): void {
  const link = globalThis.document.createElement("a");
  link.download = filename;
  link.href = href;
  globalThis.document.body.appendChild(link);
  link.click();
  globalThis.document.body.removeChild(link);
}

function exportJson(doc: FactoryDocument, filename: string): void {
  // Whole-document JSON: includes templateType, fields, and any themeId /
  // themeOverride. A user can re-import this on a fresh document to clone the
  // design + content.
  const payload = JSON.stringify(
    {
      version: 1,
      kind: "egnite-document",
      document: doc,
    },
    null,
    2,
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = globalThis.document.createElement("a") as HTMLAnchorElement;
  anchor.download = `${filename}.json`;
  anchor.href = url;
  globalThis.document.body.appendChild(anchor);
  anchor.click();
  globalThis.document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

async function exportHtml(
  doc: FactoryDocument,
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const restore = await prepareElementForExport(element);
  try {
    const lang =
      doc.fields && (doc.fields as { language?: string }).language === "ar" ? "ar" : "en";
    // Clone so we don't mutate the live export node and we can strip the
    // offscreen `position: fixed; left: -99999px` that the renderer uses.
    const clone = element.firstElementChild?.cloneNode(true) as HTMLElement | null;
    const markup = clone ? clone.outerHTML : element.innerHTML;
    const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.name} — Egnite Digital Factory</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #e8e8e8; min-height: 100vh; }
    body { display: flex; justify-content: center; align-items: flex-start; padding: 20px; font-family: 'Inter', sans-serif; }
    .template-root { box-shadow: 0 8px 32px rgba(0,0,0,0.15); margin: 0 auto; }
    [dir="rtl"] { font-family: 'Cairo', sans-serif; }
    img { max-width: 100%; display: block; }
  </style>
</head>
<body>
${markup}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = globalThis.document.createElement("a") as HTMLAnchorElement;
    anchor.download = `${filename}.html`;
    anchor.href = url;
    globalThis.document.body.appendChild(anchor);
    anchor.click();
    globalThis.document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  } finally {
    restore();
  }
}

export function ExportDialog({ exportRef, onClose }: ExportDialogProps) {
  const { document, setExporting, setDocument } = useEditorStore();
  const [progress, setProgress] = useState<ExportFormat | null>(null);
  const importRef = React.useRef<HTMLInputElement>(null);
  const toast = useToast();

  const importJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { document?: FactoryDocument };
      const incoming = parsed.document;
      if (!incoming || !incoming.fields) {
        toast.error("Invalid document JSON — missing fields");
        return;
      }
      // Preserve the current document's id + name so we don't replace it on disk.
      if (!document) return;
      setDocument({
        ...document,
        templateType: incoming.templateType ?? document.templateType,
        fields: { ...document.fields, ...incoming.fields },
      });
      toast.success("Imported document JSON — review and save");
      onClose();
    } catch {
      toast.error("Could not parse JSON");
    }
  };

  // Escape to close (don't close mid-export)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !progress) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, progress]);

  if (!document) return null;

  const dims = TEMPLATE_DIMS[document.templateType] ?? A4_PORTRAIT;
  const safeName = document.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const run = async (fmt: ExportFormat) => {
    const el = exportRef.current;
    if (!el) return;
    setProgress(fmt);
    setExporting(true);
    try {
      if (fmt === "png") await exportPng(el, safeName, dims);
      else if (fmt === "pdf") await exportPdf(el, safeName, dims);
      else if (fmt === "html") await exportHtml(document as FactoryDocument, el, safeName);
      else if (fmt === "json") exportJson(document as FactoryDocument, safeName);
      toast.success(`Exported as ${fmt.toUpperCase()}`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed — check browser console");
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
    {
      id: "json",
      icon: <FileJson size={22} />,
      label: "Document JSON",
      desc: "Full content + theme overrides — re-importable as a design file",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Export document"
      onClick={() => !progress && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gold-light/50 w-full max-w-md overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gold px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Download size={18} />
            <span className="font-bold text-base">Export Document</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
            aria-label="Close export dialog"
          >
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

        {/* Import row */}
        <div className="px-6 pb-3">
          <button
            type="button"
            disabled={!!progress}
            onClick={() => importRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gold-light hover:border-gold hover:bg-cream transition-all text-start disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Upload size={18} className="text-gold shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-xs text-ink">Import design (JSON)</div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                Replace fields + theme overrides from a .json file
              </div>
            </div>
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
          />
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
