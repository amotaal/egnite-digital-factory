/**
 * Egnite Design Tokens — the single source of truth for brand styling.
 *
 * Every template reads from here (directly or via TemplateTheme). No template
 * component should ever hard-code a colour, font-family, radius, or spacing
 * value again. If a designer wants to change the brand, they change this
 * file (or override it per-document via `themeOverride`).
 *
 * Authoritative hex values and type/radius tokens come from:
 *   - Egnite Brand Guideline v3-1.pdf (identity & print)
 *   - Egnite Website Guideline.pdf (digital — authoritative for web sizes)
 * Stylistic choices (uppercase display titles, bracket-frame heroes, the
 * full-width charcoal footer bar, "ENJOY EVERY BITE" stamp) come from the
 * handcrafted reference artefacts in sources/*.png and sample_infographic.html
 * — those are the target the factory is supposed to match.
 *
 * There are two canonical sub-palettes that both belong to the brand:
 *   ORANGE (#EE7623) — used by recipe-card / extended-recipe templates
 *   GOLD   (#B88A3E) — used by infographic templates
 * They are selected per-theme, not mixed within one document.
 */

// ─── Brand palette (authoritative hexes from PDFs) ────────────────────────────
export const COLORS = {
  // Primary
  orange:        "#EE7623",        // PRIMARY brand accent (recipe cards, CTAs)
  charcoal:      "#2C3A3C",        // primary ink (headings, body-strong, footer bar)
  cream:         "#F9F7F2",        // canonical page / surface background

  // Orange family
  orangeWarm:    "#F08A3C",
  orangeDeep:    "#D94F1C",
  orangeTint:    "#FFF3EB",        // 10% orange wash — card fills, hover, tag fills
  peachSoft:     "#FDE4CC",

  // Charcoal family
  charcoalDark:  "#1E2A33",        // deepest ink for hero headlines
  charcoalSoft:  "#3F5058",        // slightly lighter charcoal

  // Infographic gold family
  gold:          "#B88A3E",        // infographic primary accent
  goldLight:     "#D6A85A",
  goldSoft:      "#EBD4A4",
  goldDark:      "#8B6A35",
  goldFill:      "#F8F1E3",
  goldHeaderFill:"#F0E2C8",
  goldDivider:   "#D3C5B0",

  // Body / muted text
  slate:         "#8D99AE",        // secondary body copy on cream (per web guideline)
  slateSoft:     "#AAB2C0",

  // Secondary palette (opt-in)
  plum:          "#6D597A",        // limited badges, secondary tags
  warmGold:      "#E9C46A",        // free-ship / "sweet & creamy" tag
  teal:          "#00A896",        // new-drop / success accent
  tealTint:      "#E8F8F5",
  emerald:       "#0E7C65",
  rose:          "#B91C55",
  slateBrand:    "#475569",
  amber:         "#D97706",
  ocean:         "#0369A1",
  warmBrown:     "#6A4A2A",

  // Utility / neutrals
  surface:       "#FFFFFF",        // pure white (avoid as primary page bg per brand)
  black:         "#000000",
  blueGrey:      "#B7C2CA",        // carbonated-speckle decorative dot
} as const;

export type ColorToken = keyof typeof COLORS;

// Legacy alias — some code still imports `cream` as the warmer tone from the
// original globals.css `@theme`. Keep it available so migrations don't break.
export const LEGACY_COLORS = {
  cream: "#FCFAF4",
  ink: "#1A1A1A",
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
/**
 * Canonical brand faces: Euclid Circular A (Latin) + GE SS (Arabic).
 * We fall back through Inter + Cairo + system stack so the app renders even
 * when the brand face is unavailable.
 *
 * The wordmark (`egnite` lowercase) calls for Aharoni MF Bold — but that face
 * is proprietary/identity-only per the guideline, so we approximate with a
 * heavy-weight Inter for the rendered wordmark.
 */
export const FONTS = {
  sans: "'Euclid Circular A', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
  heavy: "'Euclid Circular A', 'Inter', system-ui, -apple-system, sans-serif",
  wordmark: "'Aharoni MF', 'Euclid Circular A', 'Inter', system-ui, sans-serif",
  arabic: "'GE SS', 'Cairo', 'Sakkal Majalla', 'Segoe UI', Arial, sans-serif",
  display: "'Playfair Display', Georgia, 'Times New Roman', serif",  // opt-in editorial
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

/**
 * Type-scale pinned to A4 @ 96 DPI.
 *
 * The brand guideline specifies sentence-case headings at 52/34/22/15. The
 * handcrafted recipe-card PNGs override this with an UPPERCASE heavy sans
 * display treatment at a larger size. Both styles are captured here — the
 * theme chooses which one to apply.
 */
export const TYPE = {
  // Display treatment (used by the recipe-card samples)
  displayHero:  { size: 56, weight: 900, tracking: 0.5, leading: 1.02, case: "uppercase" as const },
  displayTitle: { size: 46, weight: 900, tracking: 0.5, leading: 1.04, case: "uppercase" as const },

  // Canonical web scale (brand guideline)
  h1:           { size: 52, weight: 700, tracking: -0.5, leading: 1.08, case: "none" as const },
  h2:           { size: 34, weight: 700, tracking: -0.3, leading: 1.15, case: "none" as const },
  h3:           { size: 22, weight: 600, tracking: -0.2, leading: 1.25, case: "none" as const },

  // Labels
  sectionTitle: { size: 14, weight: 800, tracking: 2.4, leading: 1.2,  case: "uppercase" as const },
  eyebrow:      { size: 10, weight: 800, tracking: 1.6, leading: 1.3,  case: "uppercase" as const },

  // Body
  body:         { size: 13, weight: 400, tracking: 0,   leading: 1.55, case: "none" as const },
  bodyLg:       { size: 15, weight: 400, tracking: 0,   leading: 1.65, case: "none" as const },
  bodyStrong:   { size: 13, weight: 700, tracking: 0,   leading: 1.45, case: "none" as const },
  caption:      { size: 11, weight: 300, tracking: 0.2, leading: 1.4,  case: "none" as const },

  // Meta row / inline meta ("Prep time : 15 Mins")
  meta:         { size: 11, weight: 600, tracking: 0.4, leading: 1.3,  case: "none" as const },

  // Dosage / amount highlight
  amount:       { size: 12, weight: 700, tracking: 0.3, leading: 1.3,  case: "none" as const },

  // Wordmark lockup
  wordmark:     { size: 26, weight: 900, tracking: -0.5, leading: 1,   case: "lowercase" as const },
  subtag:       { size: 8,  weight: 800, tracking: 3,   leading: 1,    case: "uppercase" as const },
  cta:          { size: 13, weight: 700, tracking: 0.26, leading: 1,   case: "none" as const },
  badge:        { size: 11, weight: 800, tracking: 1.5, leading: 1,    case: "uppercase" as const },
} as const;

export type TypeToken = keyof typeof TYPE;

// ─── Spacing (4px grid) ───────────────────────────────────────────────────────
export const SPACING = {
  px0: 0, px2: 2, px4: 4, px6: 6, px8: 8, px10: 10, px12: 12, px14: 14,
  px16: 16, px20: 20, px24: 24, px28: 28, px32: 32, px36: 36, px40: 40, px48: 48,
  px56: 56, px64: 64, px72: 72, px80: 80, px96: 96,
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────
export const RADII = {
  none: 0, sm: 6, md: 10, lg: 12, card: 16, xl: 20, "2xl": 24, pill: 999, full: 99999,
} as const;

export type RadiusToken = keyof typeof RADII;

// ─── Strokes ──────────────────────────────────────────────────────────────────
export const STROKES = { hairline: 1, thin: 1.5, regular: 2, bold: 3, heavy: 4 } as const;

// ─── Shadows (soft, warm, low-opacity per guideline photography rules) ────────
export const SHADOWS = {
  none: "none",
  sm:   "0 1px 2px 0 rgba(44,58,60,0.06)",
  md:   "0 6px 16px rgba(44,58,60,0.08)",
  lg:   "0 16px 32px rgba(44,58,60,0.10)",
  xl:   "0 24px 48px -12px rgba(44,58,60,0.14)",
  card: "0 6px 20px -6px rgba(44,58,60,0.10)",
  ringOrange: "0 0 0 1.5px #EE7623",
  ringGold:   "0 0 0 1.5px #B88A3E",
} as const;

// ─── Decorative motifs ────────────────────────────────────────────────────────
/**
 * Egnite's distinctive graphic vocabulary (as seen across sources/*):
 *   - Flame icon (primary logo mark) — rendered as 🔥 emoji by default; can be
 *     replaced with an uploaded SVG per-document.
 *   - Orange bracket-frame on recipe-card hero images (L-shape hairline that
 *     wraps the top-right and bottom-left corners of the hero).
 *   - Gold hairline rules flanking a centered infographic title.
 *   - "ENJOY EVERY BITE !" orange flame-stamp near the bottom-right of a recipe.
 *   - Small round filled social icons in the charcoal footer bar.
 *   - Descriptor accent lines flanking "FLAVORS" in the wordmark lockup.
 */
export const DECORATIONS = {
  flame: "🔥",
  sparkle: "✦",
  star: "★",
  dot: "·",
  tripleDot: "• • •",
  diamond: "◆",
  bracketLR: "⌐",
  bracketLL: "⌐",
} as const;

// ─── Social icons ─────────────────────────────────────────────────────────────
/**
 * The brand guideline does not prescribe a social icon set — the app picks a
 * consistent inline set (Facebook, Instagram, TikTok, YouTube) which matches
 * the recipe-card footers.
 */
export const SOCIAL_ICONS = [
  { key: "facebook",  glyph: "f", label: "Facebook" },
  { key: "instagram", glyph: "◉", label: "Instagram" },
  { key: "tiktok",    glyph: "♪", label: "TikTok" },
  { key: "youtube",   glyph: "▶", label: "YouTube" },
] as const;

// ─── Brand constants ──────────────────────────────────────────────────────────
export const BRAND = {
  name: "egnite",
  wordmarkCase: "lowercase" as const,
  subtag: "FLAVORS",
  tagline: { en: "Creativity with Confidence", ar: "ابدع بثقة" },
  heroSample: { en: "One Drop. Your Signature.", ar: "قطرة واحدة. بصمتك." },
  website: "egniteflavors.com",
  badgeText: { en: "ENJOY EVERY BITE !", ar: "استمتع بكل قضمة" },
} as const;

// ─── Page sizing ──────────────────────────────────────────────────────────────
export const PAGE = {
  a4Portrait:  { width: 794,  height: 1123, orientation: "portrait"  as const },
  a4Landscape: { width: 1123, height: 794,  orientation: "landscape" as const },
} as const;

// ─── UI picker swatches ───────────────────────────────────────────────────────
export const BRAND_SWATCHES: readonly string[] = [
  COLORS.orange,
  COLORS.gold,
  COLORS.charcoal,
  COLORS.orangeDeep,
  COLORS.plum,
  COLORS.teal,
  COLORS.warmGold,
  COLORS.cream,
];

// ─── Subtle page textures ─────────────────────────────────────────────────────
/**
 * SVG data-URIs for the "paper" textures seen on Egnite infographics.
 */
export const TEXTURES = {
  none: "",
  speckle:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><g fill='%23B88A3E' fill-opacity='0.08'><circle cx='14' cy='22' r='1'/><circle cx='53' cy='11' r='0.8'/><circle cx='88' cy='40' r='1.1'/><circle cx='120' cy='17' r='0.9'/><circle cx='146' cy='53' r='1'/><circle cx='33' cy='67' r='0.7'/><circle cx='74' cy='78' r='1'/><circle cx='107' cy='96' r='0.8'/><circle cx='139' cy='110' r='1'/><circle cx='22' cy='120' r='0.9'/><circle cx='60' cy='137' r='1.1'/><circle cx='100' cy='146' r='0.7'/></g></svg>\")",
  bubbles:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g fill='none' stroke='%23B7C2CA' stroke-opacity='0.35' stroke-width='0.8'><circle cx='30' cy='40' r='6'/><circle cx='90' cy='24' r='4'/><circle cx='140' cy='70' r='7'/><circle cx='180' cy='30' r='3'/><circle cx='60' cy='110' r='5'/><circle cx='130' cy='150' r='8'/><circle cx='40' cy='170' r='4'/><circle cx='170' cy='180' r='6'/></g><g fill='%23EE7623' fill-opacity='0.06'><circle cx='18' cy='80' r='1'/><circle cx='110' cy='60' r='1.2'/><circle cx='72' cy='150' r='1'/></g></svg>\")",
} as const;
