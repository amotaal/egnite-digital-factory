import sharp from "sharp";
import { parse as parseFont, Path, type Font } from "opentype.js";
import type { LabelerConfig } from "../types";

export interface LoadedFont {
  font: Font;
}

export async function loadFont(buffer: Buffer): Promise<LoadedFont> {
  // opentype.parse expects an ArrayBuffer view of the file bytes.
  const ab = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
  const font = parseFont(ab);
  return { font };
}

export interface BottleMeta {
  width: number;
  height: number;
}

export async function readBottle(input: Buffer): Promise<{
  buffer: Buffer;
  meta: BottleMeta;
}> {
  // Normalize to PNG for predictable downstream compositing, then read meta.
  const normalized = await sharp(input).png().toBuffer();
  const meta = await sharp(normalized).metadata();
  return {
    buffer: normalized,
    meta: { width: meta.width ?? 0, height: meta.height ?? 0 },
  };
}

interface PixelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function boxInPixels(bottle: BottleMeta, config: LabelerConfig): PixelBox {
  const b = config.labelBox;
  return {
    x: (bottle.width * b.xPercent) / 100,
    y: (bottle.height * b.yPercent) / 100,
    width: (bottle.width * b.widthPercent) / 100,
    height: (bottle.height * b.heightPercent) / 100,
  };
}

function display(text: string, config: LabelerConfig): string {
  return config.uppercase ? text.toUpperCase() : text;
}

function wrapFlavor(text: string, config: LabelerConfig): string[] {
  if (config.oneWordPerLine) {
    return text.split(/\s+/).filter(Boolean);
  }
  // Single-line fallback — width-based wrapping happens at the caller's
  // discretion when autoFit is off.
  return [text];
}

function measureLine(
  line: string,
  font: Font,
  fontSize: number,
  letterSpacing: number,
): number {
  const width = font.getAdvanceWidth(line, fontSize);
  return width + Math.max(0, line.length - 1) * letterSpacing;
}

const LINE_HEIGHT_RATIO = 1.15;

function fits(
  flavors: string[],
  font: Font,
  box: PixelBox,
  config: LabelerConfig,
  fontSize: number,
): boolean {
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  for (const flavor of flavors) {
    const lines = wrapFlavor(display(flavor, config), config);
    if (lines.length * lineHeight > box.height) return false;
    for (const line of lines) {
      if (measureLine(line, font, fontSize, config.letterSpacing) > box.width) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Largest font size at which every flavor fits inside the label box, both by
 * width (longest single word) and by height (most lines). Binary search.
 */
export function computeFitSize(
  flavors: string[],
  font: Font,
  bottle: BottleMeta,
  config: LabelerConfig,
): number {
  const box = boxInPixels(bottle, config);
  if (box.width <= 0 || box.height <= 0 || flavors.length === 0) {
    return Math.max(6, config.fontSize);
  }
  let lo = 6;
  let hi = Math.max(lo, Math.floor(box.height));
  if (!fits(flavors, font, box, config, lo)) return lo;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (fits(flavors, font, box, config, mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Build an SVG that renders the flavor text as glyph paths (so the font is
 * embedded as outlines and we don't depend on any system font being present).
 * The SVG matches the bottle's dimensions so sharp can composite it 1:1.
 *
 * Pass `fontSizeOverride` when batching to keep all labels visually
 * consistent (computed once via computeFitSize).
 */
export function renderLabelSvg(
  text: string,
  bottle: BottleMeta,
  font: Font,
  config: LabelerConfig,
  fontSizeOverride?: number,
): string {
  const box = boxInPixels(bottle, config);
  const fontSize = fontSizeOverride ?? config.fontSize;
  const lines = wrapFlavor(display(text, config), config);

  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const blockHeight = lineHeight * lines.length;
  // Anchor the text block vertically by its center, inside the box.
  const startY = box.y + (box.height - blockHeight) / 2 + fontSize;

  const paths = lines
    .map((line, i) => {
      const width = measureLine(line, font, fontSize, config.letterSpacing);
      let x: number;
      if (config.align === "left") {
        x = box.x;
      } else if (config.align === "right") {
        x = box.x + box.width - width;
      } else {
        x = box.x + (box.width - width) / 2;
      }
      const y = startY + i * lineHeight;
      const path = renderLinePath(line, font, fontSize, x, y, config.letterSpacing);
      return path.toPathData(3);
    })
    .map((d) => `<path d="${d}" fill="${escapeAttr(config.color)}" />`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${bottle.width}" height="${bottle.height}" viewBox="0 0 ${bottle.width} ${bottle.height}">${paths}</svg>`;
}

function escapeAttr(value: string): string {
  return value.replace(/[&"<>]/g, (c) =>
    c === "&" ? "&amp;" : c === '"' ? "&quot;" : c === "<" ? "&lt;" : "&gt;",
  );
}

function renderLinePath(
  line: string,
  font: Font,
  fontSize: number,
  x: number,
  y: number,
  letterSpacing: number,
): Path {
  if (letterSpacing === 0) {
    return font.getPath(line, x, y, fontSize);
  }
  // Manually space glyphs so we can honor letterSpacing.
  const combined = new Path();
  let cursor = x;
  for (const char of [...line]) {
    const p = font.getPath(char, cursor, y, fontSize);
    combined.extend(p);
    cursor += font.getAdvanceWidth(char, fontSize) + letterSpacing;
  }
  return combined;
}

export async function composite(
  bottle: Buffer,
  svg: string,
): Promise<sharp.Sharp> {
  return sharp(bottle).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]);
}
