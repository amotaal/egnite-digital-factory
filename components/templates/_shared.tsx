/**
 * Shared template primitives.
 *
 * Every brand visual that appears on more than one card lives here so the
 * four template components stay thin and consistent. Source of truth for
 * style/colour/shape is `lib/design-tokens.ts` + `lib/template-theme.ts`,
 * matched against the handcrafted PNG/JPG references in `sources/`.
 */
import React from "react";
import {
  BRAND,
  SOCIAL_ICONS,
  TYPE,
} from "@/lib/design-tokens";
import {
  type TemplateTheme,
  type ThemeOverride,
  applyLegacyColorOverride,
  fontFor,
  getThemePreset,
  resolveTheme,
  scaledSize,
  typeStyle,
} from "@/lib/template-theme";
import type {
  ActiveLanguage,
  DocumentThemeOverride,
  LocaleString,
} from "@/lib/types";

// ─── Locale helper ────────────────────────────────────────────────────────────

export function pickLocale(
  val: LocaleString,
  lang: ActiveLanguage,
  joiner = " · ",
): string {
  if (lang === "ar") return val.ar;
  if (lang === "bilingual") return `${val.en}${joiner}${val.ar}`;
  return val.en;
}

// ─── Theme resolver shared by all templates ───────────────────────────────────

export interface ThemedFields {
  themeId?: string;
  themeOverride?: DocumentThemeOverride;
  primaryColor?: string;
  backgroundColor?: string;
}

export function resolveDocumentTheme(
  defaultThemeId: string,
  fields: ThemedFields,
): TemplateTheme {
  const base = getThemePreset(fields.themeId ?? defaultThemeId);
  const merged = resolveTheme(base, fields.themeOverride as ThemeOverride | undefined);
  return applyLegacyColorOverride(
    merged,
    fields.primaryColor,
    fields.backgroundColor,
  );
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────
/**
 * The flame + "egnite" lockup. The brand uses lowercase for the wordmark and
 * a small "FLAVORS" subtag flanked by hairlines. Sample sources show two main
 * variants: dark-on-cream (recipe headers / footers) and light-on-charcoal
 * (beverage banner / footer bar).
 */
export function Wordmark({
  theme,
  tone = "ink",
  size = 1,
  showSubtag = true,
}: {
  theme: TemplateTheme;
  tone?: "ink" | "accent" | "onDark";
  size?: number;
  showSubtag?: boolean;
}) {
  const color =
    tone === "accent"
      ? theme.colors.accent
      : tone === "onDark"
        ? theme.colors.onDark
        : theme.colors.ink;
  const wordSize = Math.round(TYPE.wordmark.size * size);
  const subSize = Math.round(TYPE.subtag.size * size);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: Math.round(8 * size) }}>
      <span style={{ fontSize: wordSize, lineHeight: 1, color }}>
        {theme.decorations.wordmarkGlyph}
      </span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
        <span
          style={{
            ...typeStyle("wordmark", theme),
            fontSize: wordSize,
            color,
            fontFamily: theme.typography.wordmark,
          }}
        >
          {BRAND.name}
        </span>
        {showSubtag && (
          <span
            style={{
              ...typeStyle("subtag", theme),
              fontSize: subSize,
              color,
              opacity: 0.85,
              marginTop: Math.max(2, Math.round(2 * size)),
            }}
          >
            {BRAND.subtag}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Bracket frame (corner brackets around the recipe-card hero) ──────────────

export function BracketFrame({ color, thickness = 2, length = 28, inset = 10 }: {
  color: string;
  thickness?: number;
  length?: number;
  inset?: number;
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: length,
    height: length,
    borderColor: color,
    borderStyle: "solid",
    pointerEvents: "none",
  };
  return (
    <>
      <div style={{ ...base, top: inset, left: inset, borderTopWidth: thickness, borderLeftWidth: thickness }} />
      <div style={{ ...base, top: inset, right: inset, borderTopWidth: thickness, borderRightWidth: thickness }} />
      <div style={{ ...base, bottom: inset, left: inset, borderBottomWidth: thickness, borderLeftWidth: thickness }} />
      <div style={{ ...base, bottom: inset, right: inset, borderBottomWidth: thickness, borderRightWidth: thickness }} />
    </>
  );
}

// ─── "ENJOY EVERY BITE !" stamp ───────────────────────────────────────────────

export function EnjoyStamp({ theme, lang }: { theme: TemplateTheme; lang: ActiveLanguage }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: theme.colors.accent,
        color: theme.colors.onAccent,
        padding: "6px 14px",
        borderRadius: theme.radii.badge,
        boxShadow: theme.shadows.stamp,
        ...typeStyle("badge", theme),
      }}
    >
      <span style={{ fontSize: 12 }}>{theme.decorations.wordmarkGlyph}</span>
      <span>{pickLocale(BRAND.badgeText, lang)}</span>
    </div>
  );
}

// ─── Numbered step circle (with optional accent ring) ────────────────────────

export function StepNumberCircle({
  n,
  theme,
  size = 22,
  variant = "fill",
}: {
  n: number;
  theme: TemplateTheme;
  size?: number;
  variant?: "fill" | "ring" | "ink";
}) {
  const ringW = theme.strokes.stepRing;
  const isFill = variant === "fill";
  const isRing = variant === "ring";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: isFill ? theme.colors.accent : isRing ? theme.colors.surface : theme.colors.ink,
        color: isRing ? theme.colors.accent : theme.colors.onAccent,
        border: isRing ? `${ringW}px solid ${theme.colors.accent}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: Math.max(10, Math.round(size * 0.46)),
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {n}
    </div>
  );
}

// ─── Section title with orange underline rule ────────────────────────────────

export function SectionTitle({
  text,
  theme,
  align = "start",
}: {
  text: string;
  theme: TemplateTheme;
  align?: "start" | "center" | "end";
}) {
  const underline = theme.decorations.sectionHeaderUnderline;
  return (
    <div style={{ marginBottom: 10, textAlign: align }}>
      <h2
        style={{
          ...typeStyle("sectionTitle", theme),
          color: theme.colors.ink,
          margin: 0,
          paddingBottom: underline ? 6 : 0,
          borderBottom: underline ? `${theme.strokes.sectionRule}px solid ${theme.colors.accent}` : "none",
          display: align === "center" ? "inline-block" : "block",
        }}
      >
        {text}
      </h2>
    </div>
  );
}

// ─── Title with flanking hairline rules (infographic style) ──────────────────

export function FlankedTitle({
  text,
  theme,
  isRtl,
}: {
  text: string;
  theme: TemplateTheme;
  isRtl: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ flex: 1, height: theme.strokes.divider, background: theme.colors.accent, opacity: 0.55 }} />
      <h1
        style={{
          ...typeStyle(theme.typography.headingVariant, theme),
          color: theme.colors.accent,
          margin: 0,
          fontFamily: fontFor("display", theme, isRtl),
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </h1>
      <div style={{ flex: 1, height: theme.strokes.divider, background: theme.colors.accent, opacity: 0.55 }} />
    </div>
  );
}

// ─── Charcoal footer bar with social circles ─────────────────────────────────

export function FooterBar({
  theme,
  taglineText,
  showSocial = true,
  showWebsite = true,
  showWordmark = true,
}: {
  theme: TemplateTheme;
  taglineText: string;
  showSocial?: boolean;
  showWebsite?: boolean;
  showWordmark?: boolean;
}) {
  return (
    <div
      style={{
        background: theme.colors.footerBg,
        color: theme.colors.footerInk,
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginTop: "auto",
      }}
    >
      <span style={{ ...typeStyle("cta", theme), color: theme.colors.footerInk }}>{taglineText}</span>
      {showWordmark && <Wordmark theme={theme} tone="onDark" size={0.85} />}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {showWebsite && (
          <span style={{ ...typeStyle("caption", theme), color: theme.colors.footerInk, opacity: 0.8 }}>
            {BRAND.website}
          </span>
        )}
        {showSocial && (
          <div style={{ display: "flex", gap: 6 }}>
            {SOCIAL_ICONS.map((s) => (
              <div
                key={s.key}
                aria-label={s.label}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: theme.colors.footerAccent,
                  color: theme.colors.onAccent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {s.glyph}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page wrapper (applies background colour + texture) ──────────────────────

export function PageRoot({
  theme,
  width,
  height,
  isRtl,
  children,
  fixedHeight = false,
}: {
  theme: TemplateTheme;
  width: number;
  height: number;
  isRtl: boolean;
  fixedHeight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="template-root"
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        width,
        ...(fixedHeight ? { height } : { minHeight: height }),
        backgroundColor: theme.colors.background,
        backgroundImage: theme.colors.backgroundTexture || "none",
        backgroundRepeat: "repeat",
        color: theme.colors.ink,
        fontFamily: fontFor("sans", theme, isRtl),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// ─── Typed re-exports for templates ──────────────────────────────────────────
export { typeStyle, fontFor, scaledSize };
export type { TemplateTheme };
