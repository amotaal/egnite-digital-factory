import type { LabelerFlavor } from "../types";

export const MAX_FLAVORS = 500;

/**
 * Strip HTML tags, markdown bullets/numbers, and excess punctuation so the
 * user can paste from txt / md / html / a copied list without grooming.
 */
function stripMarkup(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/^[\s>*\-+]+/g, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/\|/g, " ")
    .trim();
}

function slugify(text: string): string {
  const base = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "flavor";
}

export interface ParseFlavorsResult {
  flavors: LabelerFlavor[];
  duplicates: string[];
  truncated: boolean;
}

export function parseFlavors(raw: string): ParseFlavorsResult {
  const lines = raw
    .split(/\r?\n/)
    .map(stripMarkup)
    .filter((line) => line.length > 0);

  const seen = new Set<string>();
  const flavors: LabelerFlavor[] = [];
  const duplicates: string[] = [];
  const slugCounts = new Map<string, number>();

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (seen.has(normalized)) {
      duplicates.push(line);
      continue;
    }
    seen.add(normalized);
    const base = slugify(line);
    const n = slugCounts.get(base) ?? 0;
    slugCounts.set(base, n + 1);
    const slug = n === 0 ? base : `${base}-${n + 1}`;
    flavors.push({ text: line, slug });
    if (flavors.length >= MAX_FLAVORS) break;
  }

  return {
    flavors,
    duplicates,
    truncated: lines.length > MAX_FLAVORS,
  };
}
