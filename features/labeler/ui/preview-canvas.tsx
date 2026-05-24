"use client";
import { useEffect, useRef, useState } from "react";
import type { LabelerConfig } from "../types";

interface PreviewCanvasProps {
  imageUrl: string | null;
  text: string;
  fontFamily: string | null;
  config: LabelerConfig;
}

export function PreviewCanvas({ imageUrl, text, fontFamily, config }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  // Measure the image only when we have a URL. When the URL clears, `size`
  // becomes stale but the placeholder branch below renders instead, so no
  // synchronous setState is needed here.
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => setSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl || !size) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas backing store to image; CSS sizes it down responsively.
    canvas.width = size.w;
    canvas.height = size.h;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.drawImage(img, 0, 0, size.w, size.h);
      drawText(ctx, text, size, fontFamily, config);
    };
    img.src = imageUrl;
  }, [imageUrl, size, text, fontFamily, config]);

  if (!imageUrl) {
    return (
      <div className="aspect-[3/4] w-full max-w-md mx-auto rounded-xl bg-cream-dark border border-gold-light/60 flex items-center justify-center text-sm text-ink-muted">
        Upload a bottle image to see the preview
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-xl border border-gold-light/60 bg-white"
      />
    </div>
  );
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  size: { w: number; h: number },
  fontFamily: string | null,
  config: LabelerConfig,
) {
  const display = config.uppercase ? text.toUpperCase() : text;
  const family = fontFamily ?? "system-ui";
  ctx.fillStyle = config.color;
  ctx.font = `${config.fontWeight === "bold" ? "bold " : ""}${config.fontSize}px "${family}"`;
  ctx.textAlign =
    config.align === "left" ? "left" : config.align === "right" ? "right" : "center";
  ctx.textBaseline = "alphabetic";
  // Canvas API has letterSpacing in modern browsers; cast for older typings.
  (ctx as unknown as { letterSpacing?: string }).letterSpacing = `${config.letterSpacing}px`;

  const maxWidth = (size.w * config.maxWidthPercent) / 100;
  const lines = wrap(display, ctx, maxWidth);
  const lineHeight = config.fontSize * 1.15;
  const blockHeight = lineHeight * lines.length;
  const centerX = (size.w * config.xPercent) / 100;
  const centerY = (size.h * config.yPercent) / 100;
  const startY = centerY - blockHeight / 2 + config.fontSize;

  let x = centerX;
  if (config.align === "left") x = centerX - maxWidth / 2;
  else if (config.align === "right") x = centerX + maxWidth / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });
}

function wrap(text: string, ctx: CanvasRenderingContext2D, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else if (current) {
      lines.push(current);
      current = word;
    } else {
      lines.push(word);
      current = "";
    }
  }
  if (current) lines.push(current);
  return lines;
}
