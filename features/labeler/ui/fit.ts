import type { LabelBox, LabelerConfig } from "../types";

/** Pixel box derived from a percent-based LabelBox + image dimensions. */
export interface PixelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function boxInPixels(
  imageSize: { w: number; h: number },
  box: LabelBox,
): PixelBox {
  return {
    x: (imageSize.w * box.xPercent) / 100,
    y: (imageSize.h * box.yPercent) / 100,
    width: (imageSize.w * box.widthPercent) / 100,
    height: (imageSize.h * box.heightPercent) / 100,
  };
}

export const LINE_HEIGHT_RATIO = 1.15;

export function wrapFlavor(text: string, config: LabelerConfig): string[] {
  const display = config.uppercase ? text.toUpperCase() : text;
  if (config.oneWordPerLine) {
    return display.split(/\s+/).filter(Boolean);
  }
  return [display];
}

interface CanvasLike {
  font: string;
  letterSpacing?: string;
  measureText: (s: string) => TextMetrics;
}

function setupCtx(
  ctx: CanvasLike,
  config: LabelerConfig,
  fontFamily: string,
  fontSize: number,
) {
  ctx.font = `${config.fontWeight === "bold" ? "bold " : ""}${fontSize}px "${fontFamily}"`;
  ctx.letterSpacing = `${config.letterSpacing}px`;
}

function fits(
  flavors: string[],
  ctx: CanvasLike,
  box: PixelBox,
  config: LabelerConfig,
  fontFamily: string,
  fontSize: number,
): boolean {
  setupCtx(ctx, config, fontFamily, fontSize);
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  for (const flavor of flavors) {
    const lines = wrapFlavor(flavor, config);
    if (lines.length * lineHeight > box.height) return false;
    for (const line of lines) {
      if (ctx.measureText(line).width > box.width) return false;
    }
  }
  return true;
}

/**
 * Client-side counterpart to the server's computeFitSize — uses canvas
 * measurement (close enough for an interactive preview; final pixels still
 * come from the server's opentype.js renderer).
 */
export function computeFitSize(
  flavors: string[],
  imageSize: { w: number; h: number },
  config: LabelerConfig,
  fontFamily: string,
): number {
  if (typeof document === "undefined") return Math.max(6, config.fontSize);
  const box = boxInPixels(imageSize, config.labelBox);
  if (box.width <= 0 || box.height <= 0 || flavors.length === 0) {
    return Math.max(6, config.fontSize);
  }
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return Math.max(6, config.fontSize);

  let lo = 6;
  let hi = Math.max(lo, Math.floor(box.height));
  if (!fits(flavors, probe, box, config, fontFamily, lo)) return lo;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (fits(flavors, probe, box, config, fontFamily, mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  imageSize: { w: number; h: number },
  config: LabelerConfig,
  fontFamily: string,
  fontSize: number,
) {
  const box = boxInPixels(imageSize, config.labelBox);
  setupCtx(ctx, config, fontFamily, fontSize);
  ctx.fillStyle = config.color;
  ctx.textAlign =
    config.align === "left" ? "left" : config.align === "right" ? "right" : "center";
  ctx.textBaseline = "alphabetic";

  const lines = wrapFlavor(text, config);
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const blockHeight = lineHeight * lines.length;
  const startY = box.y + (box.height - blockHeight) / 2 + fontSize;

  let x: number;
  if (config.align === "left") x = box.x;
  else if (config.align === "right") x = box.x + box.width;
  else x = box.x + box.width / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });
}
