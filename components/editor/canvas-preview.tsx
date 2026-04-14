"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { FactoryDocument } from "@/lib/types";
import { RecipeCard } from "@/components/templates/recipe-card";
import { InfographicCard } from "@/components/templates/infographic-card";
import { BeverageCard } from "@/components/templates/beverage-card";
import { ExtendedRecipe } from "@/components/templates/extended-recipe";
import { A4_PORTRAIT, A4_LANDSCAPE } from "@/lib/data/templates";

interface CanvasPreviewProps {
  document: FactoryDocument;
  lang: "en" | "ar" | "bilingual";
  /** Ref for the full-size (unscaled) template — used for export */
  exportRef?: React.RefObject<HTMLDivElement | null>;
}

function TemplateRenderer({
  document,
  lang,
}: {
  document: FactoryDocument;
  lang: "en" | "ar" | "bilingual";
}) {
  const fields = document.fields as unknown as Record<string, unknown>;
  const merged = { ...fields, language: lang };

  if (document.templateType === "recipe-card") {
    return <RecipeCard fields={merged as never} />;
  }
  if (document.templateType === "infographic-card") {
    return <InfographicCard fields={merged as never} />;
  }
  if (document.templateType === "beverage-card") {
    return <BeverageCard fields={merged as never} />;
  }
  if (document.templateType === "extended-recipe") {
    return <ExtendedRecipe fields={merged as never} />;
  }
  return (
    <div className="flex items-center justify-center h-full text-ink-muted">
      Template not available
    </div>
  );
}

const TEMPLATE_DIMS: Record<string, { width: number; height: number }> = {
  "recipe-card": A4_PORTRAIT,
  "infographic-card": A4_LANDSCAPE,
  "beverage-card": A4_LANDSCAPE,
  "extended-recipe": A4_PORTRAIT,
};

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function CanvasPreview({ document, lang, exportRef }: CanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [userZoom, setUserZoom] = useState<number | null>(null); // null = fit
  const [trackedDocId, setTrackedDocId] = useState(document.id);

  // Reset user zoom when the document switches — React's "adjust state while
  // rendering" pattern, strictly preferred over a reset useEffect.
  if (trackedDocId !== document.id) {
    setTrackedDocId(document.id);
    setUserZoom(null);
  }

  const dims = TEMPLATE_DIMS[document.templateType] ?? A4_PORTRAIT;

  // Compute fit-to-viewport scale
  useEffect(() => {
    const updateFit = () => {
      if (!containerRef.current) return;
      const availW = containerRef.current.offsetWidth - 32;
      const availH = containerRef.current.offsetHeight - 80; // leave room for toolbar

      const scaleByW = availW / dims.width;
      const scaleByH =
        dims.width > dims.height && availH > 0 ? availH / dims.height : Infinity;

      setFitScale(Math.min(1, scaleByW, scaleByH));
    };

    updateFit();
    const ro = new ResizeObserver(updateFit);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [dims.width, dims.height]);

  const scale = userZoom ?? fitScale;

  // Mouse-wheel zoom (Ctrl/Cmd + wheel, or plain wheel over the canvas surface)
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      // Only hijack the wheel when the user is holding Ctrl/Cmd, so plain
      // scrolling still pans long portrait templates.
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1 + ZOOM_STEP : 1 - ZOOM_STEP;
      setUserZoom((prev) => clamp((prev ?? fitScale) * factor, MIN_ZOOM, MAX_ZOOM));
    },
    [fitScale],
  );

  // Keyboard shortcuts (+ / - / 0)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setUserZoom((p) => clamp((p ?? fitScale) + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
      } else if (e.key === "-") {
        e.preventDefault();
        setUserZoom((p) => clamp((p ?? fitScale) - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
      } else if (e.key === "0") {
        e.preventDefault();
        setUserZoom(null);
      } else if (e.key === "1") {
        e.preventDefault();
        setUserZoom(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fitScale]);

  const zoomIn = () =>
    setUserZoom((p) => clamp((p ?? fitScale) + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
  const zoomOut = () =>
    setUserZoom((p) => clamp((p ?? fitScale) - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
  const zoomFit = () => setUserZoom(null);
  const zoom100 = () => setUserZoom(1);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-zinc-200/60 overflow-hidden relative"
      onWheel={handleWheel}
    >
      {/* Scroll area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4">
        <div
          style={{
            width: dims.width * scale,
            height: dims.height * scale,
            flexShrink: 0,
            overflow: "hidden",
            boxShadow: "0 6px 28px rgba(0,0,0,0.18)",
            background: "#fff",
          }}
        >
          <div
            style={{
              width: dims.width,
              height: dims.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <TemplateRenderer document={document} lang={lang} />
          </div>
        </div>
      </div>

      {/* Zoom toolbar */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur shadow-lg rounded-full px-2 py-1 border border-zinc-200 text-sm"
        role="toolbar"
        aria-label="Zoom controls"
      >
        <button
          type="button"
          onClick={zoomOut}
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 disabled:opacity-40"
          aria-label="Zoom out"
          disabled={scale <= MIN_ZOOM + 0.001}
        >
          −
        </button>
        <button
          type="button"
          onClick={zoomFit}
          className={`px-3 h-8 rounded-full hover:bg-zinc-100 font-medium text-zinc-700 ${
            userZoom === null ? "bg-zinc-100" : ""
          }`}
          title="Fit to viewport (Ctrl/Cmd + 0)"
        >
          Fit
        </button>
        <button
          type="button"
          onClick={zoom100}
          className={`px-3 h-8 rounded-full hover:bg-zinc-100 font-medium text-zinc-700 ${
            userZoom === 1 ? "bg-zinc-100" : ""
          }`}
          title="Actual size (Ctrl/Cmd + 1)"
        >
          100%
        </button>
        <span className="px-2 font-mono text-xs text-zinc-600 tabular-nums min-w-[44px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 disabled:opacity-40"
          aria-label="Zoom in"
          disabled={scale >= MAX_ZOOM - 0.001}
        >
          +
        </button>
      </div>

      {/* Hidden full-size template for export */}
      <div
        ref={exportRef as React.RefObject<HTMLDivElement>}
        style={{
          position: "fixed",
          left: -99999,
          top: 0,
          width: dims.width,
          height: dims.height,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <TemplateRenderer document={document} lang={lang} />
      </div>
    </div>
  );
}
