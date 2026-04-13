"use client";
import React, { useRef, useEffect, useState } from "react";
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

export function CanvasPreview({ document, lang, exportRef }: CanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const dims = TEMPLATE_DIMS[document.templateType] ?? A4_PORTRAIT;

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availW = containerRef.current.offsetWidth - 32;
      const availH = containerRef.current.offsetHeight - 32;

      const scaleByW = availW / dims.width;
      // For landscape templates, also cap by height so they never require vertical
      // scrolling (they're short enough to fit). Portrait templates are allowed to
      // be taller than the viewport — overflow-auto handles the scroll.
      const scaleByH =
        dims.width > dims.height && availH > 0 ? availH / dims.height : Infinity;

      setScale(Math.min(1, scaleByW, scaleByH));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [dims.width, dims.height]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center bg-zinc-200/60 overflow-auto p-4"
    >
      {/* Scaled preview */}
      <div
        style={{
          width: dims.width * scale,
          height: dims.height * scale,
          flexShrink: 0,
          overflow: "hidden", // clip the transform-scaled child to the correct box
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
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
