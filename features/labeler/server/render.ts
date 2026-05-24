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

/**
 * Build an SVG that renders the flavor text as glyph paths (so the font is
 * embedded as outlines and we don't depend on any system font being present).
 * The SVG matches the bottle's dimensions so sharp can composite it 1:1.
 */
export function renderLabelSvg(
  text: string,
  bottle: BottleMeta,
  font: Font,
  config: LabelerConfig,
): string {
  const display = config.uppercase ? text.toUpperCase() : text;
  const fontSize = config.fontSize;
  const maxWidth = (bottle.width * config.maxWidthPercent) / 100;

  // Break the text into lines that fit `maxWidth` at the chosen size.
  const lines = wrapText(display, font, fontSize, maxWidth, config.letterSpacing);

  const lineHeight = fontSize * 1.15;
  const blockHeight = lineHeight * lines.length;
  const centerX = (bottle.width * config.xPercent) / 100;
  const centerY = (bottle.height * config.yPercent) / 100;
  // Anchor the text block vertically by its center.
  const startY = centerY - blockHeight / 2 + fontSize;

  const paths = lines
    .map((line, i) => {
      const width = measureLine(line, font, fontSize, config.letterSpacing);
      let x = centerX;
      if (config.align === "left") x = centerX - maxWidth / 2;
      else if (config.align === "right") x = centerX + maxWidth / 2 - width;
      else x = centerX - width / 2;
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

function measureLine(
  line: string,
  font: Font,
  fontSize: number,
  letterSpacing: number,
): number {
  const width = font.getAdvanceWidth(line, fontSize);
  return width + Math.max(0, line.length - 1) * letterSpacing;
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

function wrapText(
  text: string,
  font: Font,
  fontSize: number,
  maxWidth: number,
  letterSpacing: number,
): string[] {
  if (!text) return [""];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (measureLine(candidate, font, fontSize, letterSpacing) <= maxWidth) {
      current = candidate;
    } else if (current) {
      lines.push(current);
      current = word;
    } else {
      // Single word longer than maxWidth — accept overflow rather than crash.
      lines.push(word);
      current = "";
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function composite(
  bottle: Buffer,
  svg: string,
): Promise<sharp.Sharp> {
  return sharp(bottle).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]);
}
