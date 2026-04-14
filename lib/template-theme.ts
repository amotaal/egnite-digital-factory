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
 * imported JSON file) tweak a single axis — "make the orange more amber" —
 * without re-declaring the whole theme.
 *
 * There are two canonical preset families, matching the two sub-palettes
 * the Egnite brand actually uses in the wild:
 *
 *   `egnite-recipe-card`  — orange + charcoal, bracket-frame hero, orange
 *                           section-underline rules, orange "ENJOY EVERY
 *                           BITE" stamp, full-width charcoal footer bar
 *                           with orange social circles. Matches
 *                           sources/{bubblegum,coconut,coffeebean,creamy,
 *                           hazelnut,lemon,mixedberries,wildberry,
 *                           strawberry}*.png.
 *
 *   `egnite-infographic`  — gold + charcoal, centered title flanked by
 *                           gold hairline rules, gold-ringed numbered
 *                           step circles, subtle speckle page texture,
 *                           same charcoal footer bar. Matches
 *                           sources/sample_infographic.{html,jpg} and
 *                           the biscuit-filling hybrid.
 *
 * Plus two variants layered on top:
 *   `egnite-extended-recipe` — recipe-card palette with editorial spacing
 *                             for 2-page guides.
 *   `egnite-beverage-card`   — charcoal-banner header + horizontal step
 *                             flow, matches sources/other_infographic.jpeg.
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
  TEXTURES,
} from "./design-tokens";

// ─── Theme shape ──────────────────────────────────────────────────────────────

export interface TemplateTheme {
  id: string;
  name: string;

  /** Semantic colour roles consumed by the renderer. */
  colors: {
    background: string;        // page background
    backgroundTexture: string; // CSS background-image (e.g. paper speckle), or ""
    surface: string;           // cards / panels over the background
    surfaceAlt: string;        // subtle alternative surface (e.g. dosage wash)
    accent: string;            // primary brand accent (orange OR gold)
    accentSoft: string;        // 10–20% accent wash
    accentStrong: string;      // deeper accent
    accentFill: string;        // low-saturation accent wash for frames
    accentHeaderFill: string;  // header cell fill in dosage-style tables
    ink: string;               // primary text (charcoal)
    inkMuted: string;          // secondary text (slate)
    inkSoft: string;           // tertiary / captions
    divider: string;           // hairline dividers
    footerBg: string;          // full-width footer bar background
    footerInk: string;         // text on footer
    footerAccent: string;      // accent on footer (social-circle fill)
    onAccent: string;          // text on top of accent colour (usually #FFF)
    onDark: string;            // text on top of charcoal
  };

  typography: {
    display: string;           // heavy display face
    sans: string;              // UI / body
    arabic: string;            // RTL
    wordmark: string;          // lockup face
    scale: number;             // multiplier applied to every type size
    headingCase: "uppercase" | "none";
    sectionTitleCase: "uppercase" | "none";
    headingVariant: "displayHero" | "displayTitle" | "h1";  // which token headings use
  };

  spacing: {
    scale: number;
    pageMarginX: number;
    pageMarginY: number;
    sectionGap: number;
    blockGap: number;
    innerGap: number;
  };

  radii: {
    image: number;
    card: number;
    badge: number;
    step: number;
    pill: number;
  };

  strokes: {
    imageFrame: number;
    divider: number;
    sectionRule: number;
    stepRing: number;
  };

  shadows: {
    card: string;
    image: string;
    stamp: string;
  };

  /** Brand motifs. */
  decorations: {
    wordmarkGlyph: string;        // flame / sparkle
    bulletGlyph: string;
    heroFrameStyle: "bracket" | "ring" | "shadow" | "stripe" | "none";
    heroTopStripe: boolean;
    heroBottomStripe: boolean;
    stepShape: "circle" | "squircle" | "diamond";
    stepFill: "accent" | "ring" | "ink";
    dividerStyle: "solid" | "dashed" | "dotted";
    sectionHeaderUnderline: boolean;
    titleFlankingRule: boolean;
    badgeStamp: boolean;         // "ENJOY EVERY BITE" stamp in recipe cards
    footerVariant: "bar" | "cream" | "accent";
    ingredientCard: boolean;     // wrap ingredients in a white rounded card
  };
}

// ─── Deep-partial utility for overrides ───────────────────────────────────────

export type ThemeOverride = {
  [K in keyof TemplateTheme]?: TemplateTheme[K] extends object
    ? { [P in keyof TemplateTheme[K]]?: TemplateTheme[K][P] }
    : TemplateTheme[K];
};

// ─── Preset: Recipe Card (orange + charcoal) ─────────────────────────────────

export const EGNITE_RECIPE_CARD: TemplateTheme = {
  id: "egnite-recipe-card",
  name: "Egnite Recipe Card",
  colors: {
    background: COLORS.cream,
    backgroundTexture: TEXTURES.none,
    surface: COLORS.surface,
    surfaceAlt: COLORS.orangeTint,
    accent: COLORS.orange,
    accentSoft: COLORS.orangeTint,
    accentStrong: COLORS.orangeDeep,
    accentFill: COLORS.orangeTint,
    accentHeaderFill: COLORS.peachSoft,
    ink: COLORS.charcoal,
    inkMuted: COLORS.slate,
    inkSoft: COLORS.slateSoft,
    divider: COLORS.orangeTint,
    footerBg: COLORS.charcoal,
    footerInk: "#FFFFFF",
    footerAccent: COLORS.orange,
    onAccent: "#FFFFFF",
    onDark: "#FFFFFF",
  },
  typography: {
    display: FONTS.heavy,
    sans: FONTS.sans,
    arabic: FONTS.arabic,
    wordmark: FONTS.wordmark,
    scale: 1,
    headingCase: "uppercase",
    sectionTitleCase: "uppercase",
    headingVariant: "displayTitle",
  },
  spacing: {
    scale: 1,
    pageMarginX: SPACING.px36,
    pageMarginY: SPACING.px28,
    sectionGap: SPACING.px24,
    blockGap: SPACING.px16,
    innerGap: SPACING.px12,
  },
  radii: {
    image: RADII.md,           // ~8px, matches bracket-frame image radius
    card: RADII.card,          // 16px per brand guideline
    badge: RADII.pill,
    step: RADII.full,
    pill: RADII.pill,
  },
  strokes: {
    imageFrame: STROKES.thin,  // the bracket hairline
    divider: STROKES.hairline,
    sectionRule: STROKES.thin, // orange underline under section titles
    stepRing: STROKES.regular,
  },
  shadows: {
    card: SHADOWS.card,
    image: SHADOWS.sm,
    stamp: SHADOWS.sm,
  },
  decorations: {
    wordmarkGlyph: DECORATIONS.flame,
    bulletGlyph: DECORATIONS.dot,
    heroFrameStyle: "bracket",
    heroTopStripe: false,
    heroBottomStripe: false,
    stepShape: "circle",
    stepFill: "ink",
    dividerStyle: "solid",
    sectionHeaderUnderline: true,
    titleFlankingRule: false,
    badgeStamp: true,
    footerVariant: "bar",
    ingredientCard: true,
  },
};

// ─── Preset: Infographic (gold + charcoal) ───────────────────────────────────

export const EGNITE_INFOGRAPHIC: TemplateTheme = {
  id: "egnite-infographic",
  name: "Egnite Infographic",
  colors: {
    background: COLORS.cream,
    backgroundTexture: TEXTURES.speckle,
    surface: COLORS.surface,
    surfaceAlt: COLORS.goldFill,
    accent: COLORS.gold,
    accentSoft: COLORS.goldSoft,
    accentStrong: COLORS.goldDark,
    accentFill: COLORS.goldFill,
    accentHeaderFill: COLORS.goldHeaderFill,
    ink: COLORS.charcoal,
    inkMuted: COLORS.slate,
    inkSoft: COLORS.slateSoft,
    divider: COLORS.goldDivider,
    footerBg: COLORS.charcoal,
    footerInk: "#FFFFFF",
    footerAccent: COLORS.orange,
    onAccent: "#FFFFFF",
    onDark: "#FFFFFF",
  },
  typography: {
    display: FONTS.sans,
    sans: FONTS.sans,
    arabic: FONTS.arabic,
    wordmark: FONTS.wordmark,
    scale: 1,
    headingCase: "uppercase",
    sectionTitleCase: "uppercase",
    headingVariant: "displayHero",
  },
  spacing: {
    scale: 1,
    pageMarginX: SPACING.px40,
    pageMarginY: SPACING.px28,
    sectionGap: SPACING.px28,
    blockGap: SPACING.px20,
    innerGap: SPACING.px14,
  },
  radii: {
    image: RADII.card,
    card: RADII.lg,
    badge: RADII.pill,
    step: RADII.full,
    pill: RADII.pill,
  },
  strokes: {
    imageFrame: STROKES.regular,
    divider: STROKES.hairline,
    sectionRule: STROKES.hairline,
    stepRing: STROKES.regular,
  },
  shadows: {
    card: SHADOWS.sm,
    image: SHADOWS.none,
    stamp: SHADOWS.none,
  },
  decorations: {
    wordmarkGlyph: DECORATIONS.flame,
    bulletGlyph: DECORATIONS.dot,
    heroFrameStyle: "ring",
    heroTopStripe: false,
    heroBottomStripe: false,
    stepShape: "circle",
    stepFill: "ring",
    dividerStyle: "solid",
    sectionHeaderUnderline: true,
    titleFlankingRule: true,
    badgeStamp: false,
    footerVariant: "bar",
    ingredientCard: false,
  },
};

// ─── Preset: Extended Recipe (editorial orange) ──────────────────────────────

export const EGNITE_EXTENDED_RECIPE: TemplateTheme = {
  ...EGNITE_RECIPE_CARD,
  id: "egnite-extended-recipe",
  name: "Egnite Extended Recipe",
  typography: {
    ...EGNITE_RECIPE_CARD.typography,
    scale: 1.02,
    headingVariant: "displayTitle",
  },
  spacing: {
    ...EGNITE_RECIPE_CARD.spacing,
    scale: 1.04,
    sectionGap: SPACING.px32,
    blockGap: SPACING.px20,
  },
  decorations: {
    ...EGNITE_RECIPE_CARD.decorations,
    heroTopStripe: true,
    heroBottomStripe: true,
  },
};

// ─── Preset: Beverage Card (charcoal banner + horizontal flow) ───────────────

export const EGNITE_BEVERAGE_CARD: TemplateTheme = {
  ...EGNITE_INFOGRAPHIC,
  id: "egnite-beverage-card",
  name: "Egnite Beverage Card",
  colors: {
    ...EGNITE_INFOGRAPHIC.colors,
    backgroundTexture: TEXTURES.bubbles,
    accent: COLORS.charcoal,
    accentSoft: COLORS.peachSoft,
    accentStrong: COLORS.charcoalDark,
    accentHeaderFill: COLORS.goldHeaderFill,
    divider: COLORS.goldDivider,
  },
  decorations: {
    ...EGNITE_INFOGRAPHIC.decorations,
    heroFrameStyle: "shadow",
    stepFill: "accent",
    stepShape: "circle",
    titleFlankingRule: false,
    sectionHeaderUnderline: true,
  },
};

export const THEME_PRESETS: readonly TemplateTheme[] = [
  EGNITE_RECIPE_CARD,
  EGNITE_INFOGRAPHIC,
  EGNITE_EXTENDED_RECIPE,
  EGNITE_BEVERAGE_CARD,
];

export function getThemePreset(id: string | undefined): TemplateTheme {
  if (!id) return EGNITE_RECIPE_CARD;
  return THEME_PRESETS.find((t) => t.id === id) ?? EGNITE_RECIPE_CARD;
}

// ─── Merging ──────────────────────────────────────────────────────────────────

export function resolveTheme(
  base: TemplateTheme,
  override?: ThemeOverride | null,
): TemplateTheme {
  if (!override) return base;
  return {
    ...base,
    ...override,
    colors:       { ...base.colors,       ...(override.colors ?? {}) },
    typography:   { ...base.typography,   ...(override.typography ?? {}) },
    spacing:      { ...base.spacing,      ...(override.spacing ?? {}) },
    radii:        { ...base.radii,        ...(override.radii ?? {}) },
    strokes:      { ...base.strokes,      ...(override.strokes ?? {}) },
    shadows:      { ...base.shadows,      ...(override.shadows ?? {}) },
    decorations:  { ...base.decorations,  ...(override.decorations ?? {}) },
  };
}

/**
 * Apply the legacy `primaryColor` / `backgroundColor` knobs exposed by the
 * original editor UI. Maps those two values onto semantic roles.
 */
export function applyLegacyColorOverride(
  base: TemplateTheme,
  primary: string | undefined | null,
  background: string | undefined | null,
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

export function scaledSize(
  typeKey: keyof typeof TYPE,
  theme: TemplateTheme,
): number {
  return Math.round(TYPE[typeKey].size * theme.typography.scale);
}

export function scaledSpacing(value: number, theme: TemplateTheme): number {
  return Math.round(value * theme.spacing.scale);
}

export function fontFor(
  role: "display" | "sans" | "body" | "heading" | "wordmark",
  theme: TemplateTheme,
  isRtl: boolean,
): string {
  if (isRtl) return theme.typography.arabic;
  if (role === "display" || role === "heading") return theme.typography.display;
  if (role === "wordmark") return theme.typography.wordmark;
  return theme.typography.sans;
}

/** Pick a TYPE token and return a ready-to-spread style object. */
export function typeStyle(
  typeKey: keyof typeof TYPE,
  theme: TemplateTheme,
  overrides: Partial<React.CSSProperties> = {},
): React.CSSProperties {
  const t = TYPE[typeKey];
  return {
    fontSize: Math.round(t.size * theme.typography.scale),
    fontWeight: t.weight,
    letterSpacing: t.tracking,
    lineHeight: t.leading,
    textTransform:
      t.case === "uppercase" ? "uppercase"
      : t.case === "lowercase" ? "lowercase"
      : "none",
    ...overrides,
  };
}
