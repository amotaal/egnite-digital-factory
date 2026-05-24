"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LabelerConfig } from "../types";
import { computeFitSize, drawLabel, wrapFlavor } from "./fit";

interface MultiPreviewProps {
  imageUrl: string | null;
  fontFamily: string | null;
  config: LabelerConfig;
  flavors: string[];
}

interface Pick {
  label: string;
  flavor: string;
}

/** Pick the most informative flavors so the user can eyeball worst cases. */
function pickSamples(flavors: string[], config: LabelerConfig): Pick[] {
  if (flavors.length === 0) return [];
  const measure = (f: string) => {
    const lines = wrapFlavor(f, config);
    const widest = lines.reduce((max, l) => Math.max(max, l.length), 0);
    return { lines: lines.length, widest };
  };

  let widestFlavor = flavors[0];
  let tallestFlavor = flavors[0];
  let widestScore = -1;
  let tallestScore = -1;
  for (const f of flavors) {
    const m = measure(f);
    if (m.widest > widestScore) {
      widestScore = m.widest;
      widestFlavor = f;
    }
    if (m.lines > tallestScore) {
      tallestScore = m.lines;
      tallestFlavor = f;
    }
  }
  const first = flavors[0];
  const last = flavors[flavors.length - 1];

  const seen = new Set<string>();
  const out: Pick[] = [];
  const add = (label: string, flavor: string) => {
    if (seen.has(flavor)) return;
    seen.add(flavor);
    out.push({ label, flavor });
  };
  add("First", first);
  add("Widest word", widestFlavor);
  add("Most lines", tallestFlavor);
  add("Last", last);
  return out;
}

export function MultiPreview({ imageUrl, fontFamily, config, flavors }: MultiPreviewProps) {
  const samples = useMemo(() => pickSamples(flavors, config), [flavors, config]);
  if (!imageUrl) return null;
  if (samples.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-ink-muted mb-2">
        Sanity check — same image size + same font size across these four.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {samples.map((s) => (
          <SamplePreview
            key={`${s.label}-${s.flavor}`}
            sample={s}
            imageUrl={imageUrl}
            fontFamily={fontFamily}
            config={config}
            allFlavors={flavors}
          />
        ))}
      </div>
    </div>
  );
}

interface SampleProps {
  sample: Pick;
  imageUrl: string;
  fontFamily: string | null;
  config: LabelerConfig;
  allFlavors: string[];
}

function SamplePreview({ sample, imageUrl, fontFamily, config, allFlavors }: SampleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<{ el: HTMLImageElement; w: number; h: number } | null>(null);

  // Load the image when the URL changes (setState happens in the onload callback)
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage({ el: img, w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  // Re-paint whenever the image or any visual prop changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = image.w;
    canvas.height = image.h;
    ctx.clearRect(0, 0, image.w, image.h);
    ctx.drawImage(image.el, 0, 0, image.w, image.h);
    if (fontFamily) {
      const fontSize = config.autoFit
        ? computeFitSize(allFlavors, { w: image.w, h: image.h }, config, fontFamily)
        : config.fontSize;
      drawLabel(ctx, sample.flavor, { w: image.w, h: image.h }, config, fontFamily, fontSize);
    }
  }, [image, fontFamily, config, sample.flavor, allFlavors]);

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg border border-gold-light/60 bg-white"
      />
      <p className="text-[10px] text-ink-muted text-center leading-tight">
        <span className="font-semibold text-ink">{sample.label}</span>
        <br />
        <span className="truncate block max-w-full">{sample.flavor}</span>
      </p>
    </div>
  );
}
