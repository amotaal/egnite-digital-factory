/**
 * TemplateSpec — the data-driven description of a template's *structure*.
 *
 * A spec lays out which content regions (header, hero, body columns, footer,
 * etc.) appear on the page, in what order, and with what layout knobs
 * (column proportions, aspect ratios, optional stripes). It does NOT carry
 * any brand styling: that comes from `TemplateTheme`.
 *
 * Together, a `TemplateSpec` + a `TemplateTheme` + `DocumentFields` is enough
 * for the renderer to produce a page without reading any hard-coded
 * constants. That same triple can be serialised to JSON and imported.
 */

import type { TemplateTheme } from "./template-theme";
import type { TemplateType } from "./types";

// ─── Primitive block types ────────────────────────────────────────────────────

/** Where the content for each region is sourced from on DocumentFields. */
export type SlotBinding =
  | "title"
  | "subtitle"
  | "prepTime"
  | "cookTime"
  | "servings"
  | "difficulty"
  | "heroImage"
  | "ingredients"
  | "instructions"
  | "steps"        // beverage "steps"
  | "sections"
  | "dosage"       // beverage single dosage
  | "dosageEssence"
  | "dosageEmulsion"
  | "storageNote"
  | "badgeText"
  | "tagline"
  | "footerTagline"
  | "logoText"
  | "products";

// ─── Region: Header ───────────────────────────────────────────────────────────

export interface HeaderRegion {
  type: "header";
  variant: "centered" | "wordmark-split" | "banner";
  /** Show the decorative sparkle glyph next to the Egnite wordmark. */
  showSparkle?: boolean;
  /** Website / tagline on the opposite side of the wordmark. */
  showWebsite?: boolean;
  /** Whether the header displays a bottom rule in the accent colour. */
  rule?: "none" | "hairline" | "bold";
  /** For the "banner" variant — fills the header with accent colour. */
  fill?: "surface" | "accent" | "ink";
}

// ─── Region: Hero image ───────────────────────────────────────────────────────

export interface HeroRegion {
  type: "hero";
  /** Aspect ratio as width/height (e.g. 4/3 = 1.333). */
  aspectRatio: number | null; // null = fixed height
  /** Fixed height in px (used when aspectRatio is null). */
  height?: number;
  /** Image treatment. */
  frame: "none" | "ring" | "ring-inset" | "shadow";
  /** Corner radius key on the theme. */
  corner: "image" | "card" | "none";
  /** Show gold stripes above / below the image. */
  stripeAbove?: boolean;
  stripeBelow?: boolean;
  /** Placement within its parent stack. */
  placement?: "full-bleed" | "padded";
}

// ─── Region: Title block ──────────────────────────────────────────────────────

export interface TitleRegion {
  type: "title";
  variant: "stacked" | "eyebrow-title";
  eyebrow?: SlotBinding | null;   // e.g. "prepTime" → "Preparation Time: 11 minutes"
  showSubtitle: boolean;
  align: "start" | "center" | "end";
  size: "hero" | "h1" | "h2";     // controls which type token the title uses
  showMetaRow: boolean;           // prep/cook/yield row under title
  metaItems: readonly SlotBinding[];
}

// ─── Region: Body layout ──────────────────────────────────────────────────────

export type BodyColumnKind =
  | "ingredients"
  | "instructions"
  | "steps-horizontal"
  | "hero-and-dosage"
  | "dosage"
  | "storage-note"
  | "sections"
  | "hero";

export interface BodyColumn {
  kind: BodyColumnKind;
  /** Fractional weight (e.g. 1, 1.5). */
  weight: number;
  /** Which slot(s) to render. */
  source?: SlotBinding;
  /** Optional per-column title. */
  sectionTitle?: { en: string; ar: string } | null;
  /** Circle / number / emoji treatment for step/ingredient bullets. */
  bulletStyle?: "emoji-ring" | "numbered-circle" | "icon-only" | "numbered-only";
  /** Show vertical rule on the inline-end of this column. */
  trailingDivider?: boolean;
}

export interface BodyRegion {
  type: "body";
  /** Main axis: vertical stack or horizontal grid of columns. */
  direction: "row" | "column";
  columns: readonly BodyColumn[];
  /** Gap between columns (uses theme spacing by default). */
  gap?: number;
  /** Optional region title shown above the body. */
  intro?: { en: string; ar: string } | null;
}

// ─── Region: Dosage block (separate, used inside hero-and-dosage) ─────────────

export interface DosageRegion {
  type: "dosage";
  variant: "two-up" | "single";   // two-up = Essence + Emulsion
  showHeader: boolean;
  headerLabel: { en: string; ar: string };
}

// ─── Region: Storage / tip / note callout ─────────────────────────────────────

export interface CalloutRegion {
  type: "callout";
  tone: "dark" | "cream" | "accent";
  source: SlotBinding;
  label?: { en: string; ar: string } | null;
}

// ─── Region: Footer ───────────────────────────────────────────────────────────

export interface FooterRegion {
  type: "footer";
  variant: "tagline-logo-social" | "tagline-badge" | "wordmark-only";
  fill: "accent-soft" | "accent" | "cream" | "ink";
  showSocial: boolean;
  showWebsite: boolean;
  showBadge: boolean;
}

// ─── Region: Extra sub-sections (sections bag from recipe-card) ──────────────

export interface ExtraSectionsRegion {
  type: "extra-sections";
  source: "sections";
  layout: "chips" | "stacked" | "two-col";
}

export type Region =
  | HeaderRegion
  | HeroRegion
  | TitleRegion
  | BodyRegion
  | DosageRegion
  | CalloutRegion
  | FooterRegion
  | ExtraSectionsRegion;

// ─── Full spec ────────────────────────────────────────────────────────────────

export interface TemplateSpec {
  /** Stable id — matches `TemplateType` for built-in templates. */
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };

  /** Canvas dimensions. */
  page: {
    width: number;
    height: number;
    orientation: "portrait" | "landscape";
    format: "A4" | "custom";
    /** Optional outer bleed/margin around the canvas. */
    outerBorder?: boolean;
  };

  /** Preferred theme preset id (resolved via `getThemePreset`). */
  defaultThemeId: string;

  /** Ordered list of regions from top to bottom of the page. */
  regions: readonly Region[];
}

// ─── Type guards for the renderer ─────────────────────────────────────────────

export function isHeader(r: Region): r is HeaderRegion { return r.type === "header"; }
export function isHero(r: Region): r is HeroRegion { return r.type === "hero"; }
export function isTitle(r: Region): r is TitleRegion { return r.type === "title"; }
export function isBody(r: Region): r is BodyRegion { return r.type === "body"; }
export function isDosage(r: Region): r is DosageRegion { return r.type === "dosage"; }
export function isCallout(r: Region): r is CalloutRegion { return r.type === "callout"; }
export function isFooter(r: Region): r is FooterRegion { return r.type === "footer"; }
export function isExtraSections(r: Region): r is ExtraSectionsRegion { return r.type === "extra-sections"; }

// ─── Spec + theme resolver ────────────────────────────────────────────────────

export interface ResolvedTemplate {
  spec: TemplateSpec;
  theme: TemplateTheme;
}

/** Lightweight sanity check used at load time. */
export function validateSpec(spec: TemplateSpec): void {
  if (!spec.regions || spec.regions.length === 0) {
    throw new Error(`TemplateSpec "${spec.id}" must have at least one region.`);
  }
  if (spec.page.width <= 0 || spec.page.height <= 0) {
    throw new Error(`TemplateSpec "${spec.id}" has invalid page dimensions.`);
  }
}

/** Is `id` a known built-in template type? */
export function isTemplateType(id: string): id is TemplateType {
  return id === "recipe-card" || id === "infographic-card" || id === "beverage-card" || id === "extended-recipe";
}
