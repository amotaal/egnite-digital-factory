/**
 * Shared template primitives.
 *
 * Every brand visual that appears on more than one card lives here so the
 * four template components stay thin and consistent. Source of truth for
 * style / colour / shape is `lib/design-tokens.ts` + `lib/template-theme.ts`,
 * matched against the handcrafted PNG/JPG references in `sources/`.
 */
import React from "react";
import { BRAND, SOCIAL_ICONS, TYPE } from "@/lib/design-tokens";
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
  val: LocaleString | undefined,
  lang: ActiveLanguage,
  joiner = " · ",
): string {
  if (!val) return "";
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
  // Legacy colour knobs are only applied when non-empty; seed + migrate clear
  // them to "" so the preset paints the canonical palette.
  return applyLegacyColorOverride(
    merged,
    fields.primaryColor || null,
    fields.backgroundColor || null,
  );
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────
/**
 * The flame + "egnite" lockup. Rendered as an inline SVG flame (scales
 * cleanly at any zoom, no emoji font quirks) plus the lowercase wordmark
 * and optional "FLAVORS" subtag.
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
  // The flame mark always paints in the brand accent, regardless of tone.
  const flameColor = theme.colors.accent;
  const wordSize = Math.round(TYPE.wordmark.size * size);
  const subSize = Math.round(TYPE.subtag.size * size);
  const glyphSize = Math.round(wordSize * 1.05);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: Math.round(8 * size) }}>
      <FlameGlyph size={glyphSize} color={flameColor} />
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
              opacity: tone === "onDark" ? 0.95 : 0.75,
              marginTop: Math.max(2, Math.round(2 * size)),
              letterSpacing: 3,
            }}
          >
            {BRAND.subtag}
          </span>
        )}
      </div>
    </div>
  );
}

/** Inline flame SVG — scales cleanly, no emoji font dependency. */
export function FlameGlyph({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      <path
        d="M16.5 2.5c-.9 2.4-2.6 4.3-4.5 6-2.7 2.4-5 4.9-5 8.9 0 5.5 4.3 9.6 9.8 9.6 5.6 0 9.7-4.1 9.7-9.6 0-3-1.4-5.1-3.3-6.6-1 1.6-2.5 2.3-2.5 2.3s.8-3.8-1-6c-1.6-2-3.2-2.5-3.2-4.6z"
        fill={color}
      />
      <path
        d="M16 14c-.5 1.3-1.5 2.3-2.5 3.2-1.5 1.3-2.5 2.6-2.5 4.7 0 2.9 2.3 5 5.2 5 2.9 0 5.1-2.1 5.1-5 0-1.6-.7-2.7-1.7-3.5-.5.8-1.2 1.2-1.2 1.2s.4-2-.5-3.2c-.9-1.1-1.8-1.4-1.8-2.4z"
        fill="#FFF"
        opacity=".35"
      />
    </svg>
  );
}

// ─── Uppercase pill label (infographic / beverage centered banner) ───────────

export function PillLabel({
  text,
  theme,
  tone = "accent",
}: {
  text: string;
  theme: TemplateTheme;
  tone?: "accent" | "onDark" | "charcoal";
}) {
  const bg =
    tone === "onDark"
      ? "rgba(255,255,255,0.08)"
      : tone === "charcoal"
        ? theme.colors.ink
        : theme.colors.accent;
  const color = tone === "onDark" ? theme.colors.onDark : theme.colors.onAccent;
  const border = tone === "onDark" ? "1px solid rgba(255,255,255,0.28)" : "none";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 20px",
        borderRadius: 999,
        background: bg,
        color,
        border,
        ...typeStyle("badge", theme),
        fontSize: 14,
        letterSpacing: 3,
      }}
    >
      {text}
    </span>
  );
}

// ─── Bracket frame (corner brackets around the recipe-card hero) ──────────────

export function BracketFrame({
  color,
  thickness = 2,
  length = 28,
  inset = 10,
}: {
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
        gap: 8,
        background: theme.colors.accent,
        color: theme.colors.onAccent,
        padding: "8px 16px",
        borderRadius: theme.radii.badge,
        boxShadow: theme.shadows.stamp,
        ...typeStyle("badge", theme),
        fontSize: 11,
      }}
    >
      <FlameGlyph size={13} color={theme.colors.onAccent} />
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

// ─── Section title with optional accent underline ────────────────────────────

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
          color: theme.colors.accent,
          margin: 0,
          paddingBottom: underline ? 6 : 0,
          borderBottom: underline
            ? `${theme.strokes.sectionRule}px solid ${theme.colors.accent}`
            : "none",
          display: align === "center" ? "inline-block" : "block",
        }}
      >
        {text}
      </h2>
    </div>
  );
}

// ─── Centered title (no flanks) and flanked variant ──────────────────────────

export function CenteredTitle({
  text,
  theme,
  isRtl,
}: {
  text: string;
  theme: TemplateTheme;
  isRtl: boolean;
}) {
  return (
    <h1
      style={{
        ...typeStyle(theme.typography.headingVariant, theme),
        color: theme.colors.accent,
        margin: 0,
        fontFamily: fontFor("display", theme, isRtl),
        textAlign: "center",
        letterSpacing: 1.2,
      }}
    >
      {text}
    </h1>
  );
}

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
      <div style={{ flex: 1, height: 1, background: theme.colors.accent, opacity: 0.55 }} />
      <CenteredTitle text={text} theme={theme} isRtl={isRtl} />
      <div style={{ flex: 1, height: 1, background: theme.colors.accent, opacity: 0.55 }} />
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
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginTop: "auto",
      }}
    >
      <span
        style={{
          ...typeStyle("cta", theme),
          color: theme.colors.footerInk,
          fontSize: 12,
          letterSpacing: 0.2,
          fontWeight: 600,
          fontStyle: "italic",
          opacity: 0.92,
        }}
      >
        {taglineText}
      </span>
      {showWordmark && <Wordmark theme={theme} tone="onDark" size={0.9} />}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {showWebsite && (
          <span
            style={{
              ...typeStyle("caption", theme),
              color: theme.colors.footerInk,
              opacity: 0.85,
              fontSize: 11,
            }}
          >
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
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: theme.colors.footerAccent,
                  color: theme.colors.onAccent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
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

// ─── Meta row (Prep · Cook · Yield · Level) used in recipe headers ──────────

export function MetaStack({
  items,
  theme,
  align = "end",
}: {
  items: { label: string; value: string }[];
  theme: TemplateTheme;
  align?: "start" | "center" | "end";
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        justifyContent: align === "end" ? "flex-end" : align === "center" ? "center" : "flex-start",
      }}
    >
      {items.map((m) => (
        <div key={m.label} style={{ textAlign: "center" }}>
          <div
            style={{
              ...typeStyle("eyebrow", theme),
              color: theme.colors.accent,
              fontSize: 9,
              letterSpacing: 1.4,
            }}
          >
            {m.label}
          </div>
          <div
            style={{
              ...typeStyle("bodyStrong", theme),
              color: theme.colors.ink,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Side callout (handwritten-tip box next to the hero) ─────────────────────

export function SideNote({
  text,
  theme,
}: {
  text: string;
  theme: TemplateTheme;
}) {
  return (
    <div
      style={{
        border: `1px dashed ${theme.colors.accent}`,
        borderRadius: theme.radii.card,
        background: theme.colors.accentSoft,
        padding: "10px 14px",
        ...typeStyle("caption", theme),
        color: theme.colors.ink,
        fontStyle: "italic",
        fontSize: 11,
        lineHeight: 1.45,
      }}
    >
      {text}
    </div>
  );
}

// ─── Typed re-exports for templates ──────────────────────────────────────────
export { typeStyle, fontFor, scaledSize };
export type { TemplateTheme };
