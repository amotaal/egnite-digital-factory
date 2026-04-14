/**
 * TemplateTheme — the designer-facing face of the design system.
 *
 * A TemplateTheme is a fully-resolved, self-contained description of *how*
 * a document looks: palette, typography, spacing rhythm, radii, borders,
 * and decorative motifs. The template renderer consumes this theme and
 * nothing else for styling — no hard-coded constants, no inline hex codes.
 *
 * Documents may carry a partial override (see `ThemeOverride`) which is
 * merged onto the preset theme at render time. This lets a designer (or an
 * imported JSON file) tweak a single axis — "make the gold more amber and
 * tighten the spacing" — without re-declaring the whole theme.
 */

import {
  COLORS,
  FONTS,
  RADII,
  SHADOWS,
  SPACING,
  STROKES,
  TYPE,
  DECORATIONS,
} from "./design-tokens";

// ─── Theme shape ──────────────────────────────────────────────────────────────

export interface TemplateTheme {
  /** Identifier used to track which preset spawned this theme (for UI). */
  id: string;
  name: string;

  /** All semantic colour roles consumed by templates. */
  colors: {
    background: string;     // page background
    surface: string;        // cards / panels over the background
    surfaceAlt: string;     // subtle alternative surface (e.g. dosage row)
    accent: string;         // primary brand accent (gold)
    accentSoft: string;     // softer accent tint (gold-light)
    accentStrong: string;   // deeper accent (gold-dark)
    accentFill: string;     // low-saturation accent wash for frames
    accentHeaderFill: string; // header cell fill in dosage-style tables
    ink: string;            // primary text
    inkMuted: string;       // secondary text
    inkSoft: string;        // tertiary text / hints
    divider: string;        // hairline dividers
    onAccent: string;       // text placed on top of accent colour (usually white)
    onDark: string;         // text placed on top of ink/dark (usually accentSoft)
  };

  /** Typeface assignments + a global scale factor. */
  typography: {
    display: string;        // brand display face (Playfair by default)
    sans: string;           // UI / body
    arabic: string;         // Arabic / RTL
    scale: number;          // multiplier applied to every type size
    headingCase: "uppercase" | "none";
    sectionTitleCase: "uppercase" | "none";
  };

  /** Spacing rhythm — everything scales with `scale`. */
  spacing: {
    scale: number;          // 0.8 – 1.3 typical
    pageMarginX: number;    // canvas horizontal padding
    pageMarginY: number;    // canvas vertical padding
    sectionGap: number;     // gap between major sections
    blockGap: number;       // gap between items inside a section
    innerGap: number;       // gap between inline parts (icon + text)
  };

  /** Corner-radius palette for images, cards, badges. */
  radii: {
    image: number;          // hero image corner radius
    card: number;           // dosage card, footer, etc.
    badge: number;          // pills, chips
    step: number;           // step circles (usually full-round)
  };

  /** Stroke weights for dividers, image frames, and borders. */
  strokes: {
    imageFrame: number;
    divider: number;
    sectionRule: number;
    stepRing: number;
  };

  /** Shadow presets. */
  shadows: {
    card: string;
    image: string;
  };

  /** Brand motifs used by some templates (sparkle next to wordmark, etc.). */
  decorations: {
    wordmarkGlyph: string;    // e.g. "✦"
    bulletGlyph: string;      // e.g. "·"
    heroTopStripe: boolean;   // thin gold rule above hero image
    heroBottomStripe: boolean; // thin gold rule below hero image
    stepShape: "circle" | "squircle" | "diamond";
    dividerStyle: "solid" | "dashed" | "dotted";
    frameMode: "ring" | "ring-dashed" | "shadow" | "none";
  };
}

// ─── Deep-partial utility for overrides ───────────────────────────────────────

export type ThemeOverride = {
  [K in keyof TemplateTheme]?: TemplateTheme[K] extends object
    ? { [P in keyof TemplateTheme[K]]?: TemplateTheme[K][P] }
    : TemplateTheme[K];
};

// ─── Canonical Egnite preset ──────────────────────────────────────────────────

/**
 * The default, on-brand Egnite theme. Values derived from:
 *   - `sources/sample_infographic.html`
 *   - `app/globals.css` `@theme` block
 *   - The sample PNG recipe cards in `sources/`
 */
export const EGNITE_CLASSIC: TemplateTheme = {
  id: "egnite-classic",
  name: "Egnite Classic",

  colors: {
    background: COLORS.cream,
    surface: COLORS.surface,
    surfaceAlt: COLORS.goldFill,
    accent: COLORS.gold,
    accentSoft: COLORS.goldLight,
    accentStrong: COLORS.goldDark,
    accentFill: COLORS.goldFill,
    accentHeaderFill: COLORS.goldHeaderFill,
    ink: COLORS.ink,
    inkMuted: COLORS.inkMuted,
    inkSoft: COLORS.inkSoft,
    divider: COLORS.goldDivider,
    onAccent: "#FFFFFF",
    onDark: COLORS.goldLight,
  },

  typography: {
    display: FONTS.display,
    sans: FONTS.sans,
    arabic: FONTS.arabic,
    scale: 1,
    headingCase: "uppercase",
    sectionTitleCase: "uppercase",
  },

  spacing: {
    scale: 1,
    pageMarginX: SPACING.px40,
    pageMarginY: SPACING.px28,
    sectionGap: SPACING.px24,
    blockGap: SPACING.px16,
    innerGap: SPACING.px12,
  },

  radii: {
    image: RADII.lg,     // 12px – slightly softer than sample (15px) at current scale
    card: RADII.lg,
    badge: RADII.pill,
    step: RADII.full,
  },

  strokes: {
    imageFrame: STROKES.bold,
    divider: STROKES.hairline,
    sectionRule: STROKES.thin,
    stepRing: STROKES.regular,
  },

  shadows: {
    card: SHADOWS.md,
    image: SHADOWS.sm,
  },

  decorations: {
    wordmarkGlyph: DECORATIONS.sparkle,
    bulletGlyph: DECORATIONS.dot,
    heroTopStripe: false,
    heroBottomStripe: true,
    stepShape: "circle",
    dividerStyle: "solid",
    frameMode: "ring",
  },
};

/**
 * "Editorial" variant — airier, serif-forward, subtler dividers. Aimed at
 * long-form extended recipes / multi-page guides.
 */
export const EGNITE_EDITORIAL: TemplateTheme = {
  ...EGNITE_CLASSIC,
  id: "egnite-editorial",
  name: "Egnite Editorial",
  typography: {
    ...EGNITE_CLASSIC.typography,
    scale: 1.05,
    headingCase: "none",
    sectionTitleCase: "uppercase",
  },
  spacing: {
    ...EGNITE_CLASSIC.spacing,
    scale: 1.05,
    sectionGap: SPACING.px32,
    blockGap: SPACING.px20,
  },
  decorations: {
    ...EGNITE_CLASSIC.decorations,
    dividerStyle: "solid",
    frameMode: "shadow",
    heroBottomStripe: true,
    heroTopStripe: true,
  },
};

/**
 * "Bold" variant — darker header, higher-contrast accents. Aimed at beverage
 * / product cards where a strong hero crop reads better on a dark plate.
 */
export const EGNITE_BOLD: TemplateTheme = {
  ...EGNITE_CLASSIC,
  id: "egnite-bold",
  name: "Egnite Bold",
  colors: {
    ...EGNITE_CLASSIC.colors,
    accent: COLORS.goldDark,
    accentStrong: COLORS.ink,
  },
  typography: {
    ...EGNITE_CLASSIC.typography,
    scale: 1,
    headingCase: "uppercase",
  },
  decorations: {
    ...EGNITE_CLASSIC.decorations,
    frameMode: "shadow",
    stepShape: "circle",
  },
};

/**
 * "Minimal" variant — no decorative stripes, thinner strokes, tight spacing.
 * Useful for dense multi-step fillings.
 */
export const EGNITE_MINIMAL: TemplateTheme = {
  ...EGNITE_CLASSIC,
  id: "egnite-minimal",
  name: "Egnite Minimal",
  spacing: {
    ...EGNITE_CLASSIC.spacing,
    scale: 0.92,
    sectionGap: SPACING.px16,
    blockGap: SPACING.px10,
  },
  strokes: {
    imageFrame: STROKES.thin,
    divider: STROKES.hairline,
    sectionRule: STROKES.hairline,
    stepRing: STROKES.thin,
  },
  decorations: {
    ...EGNITE_CLASSIC.decorations,
    heroBottomStripe: false,
    frameMode: "none",
  },
};

export const THEME_PRESETS: readonly TemplateTheme[] = [
  EGNITE_CLASSIC,
  EGNITE_EDITORIAL,
  EGNITE_BOLD,
  EGNITE_MINIMAL,
];

export function getThemePreset(id: string): TemplateTheme | undefined {
  return THEME_PRESETS.find((t) => t.id === id);
}

// ─── Merging ──────────────────────────────────────────────────────────────────

/**
 * Resolve a final theme by merging the override on top of the base preset.
 * Only the keys that are explicitly overridden are replaced — everything else
 * inherits from the preset. (Shallow-per-bucket merge, which matches how the
 * theme is shaped: each bucket is flat.)
 */
export function resolveTheme(
  base: TemplateTheme,
  override?: ThemeOverride | null,
): TemplateTheme {
  if (!override) return base;
  return {
    ...base,
    ...override,
    colors: { ...base.colors, ...(override.colors ?? {}) },
    typography: { ...base.typography, ...(override.typography ?? {}) },
    spacing: { ...base.spacing, ...(override.spacing ?? {}) },
    radii: { ...base.radii, ...(override.radii ?? {}) },
    strokes: { ...base.strokes, ...(override.strokes ?? {}) },
    shadows: { ...base.shadows, ...(override.shadows ?? {}) },
    decorations: { ...base.decorations, ...(override.decorations ?? {}) },
  };
}

/**
 * Compute legacy `primaryColor` / `backgroundColor` overrides onto a theme.
 * Existing documents only expose two colour knobs — we preserve that UX by
 * mapping those two values onto the appropriate semantic roles.
 */
export function applyLegacyColorOverride(
  base: TemplateTheme,
  primary: string | undefined,
  background: string | undefined,
): TemplateTheme {
  if (!primary && !background) return base;
  return {
    ...base,
    colors: {
      ...base.colors,
      ...(primary ? { accent: primary } : {}),
      ...(background ? { background } : {}),
    },
  };
}

// ─── Typography helpers ───────────────────────────────────────────────────────

export function scaledSize(typeKey: keyof typeof TYPE, theme: TemplateTheme): number {
  return Math.round(TYPE[typeKey].size * theme.typography.scale);
}

export function scaledSpacing(value: number, theme: TemplateTheme): number {
  return Math.round(value * theme.spacing.scale);
}

/** Resolve the appropriate font-family for a given language role. */
export function fontFor(
  role: "display" | "sans" | "body" | "heading",
  theme: TemplateTheme,
  isRtl: boolean,
): string {
  if (isRtl) return theme.typography.arabic;
  if (role === "display" || role === "heading") return theme.typography.display;
  return theme.typography.sans;
}
