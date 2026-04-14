/**
 * Extended Recipe Template — A4 Portrait (794 × 1123px)
 *
 * Variant of the recipe-card with a coloured accent-bar header, taller hero,
 * and full-width section blocks for sub-recipes (coatings, fillings, frostings).
 * Visual reference: sources/strawberry_shortcake_2_pages.png and the editorial
 * spread variants of the recipe samples.
 */
import React from "react";
import type { ActiveLanguage, RecipeCardFields } from "@/lib/types";
import {
  EnjoyStamp,
  PageRoot,
  SectionTitle,
  StepNumberCircle,
  Wordmark,
  fontFor,
  pickLocale,
  resolveDocumentTheme,
  typeStyle,
} from "./_shared";

interface ExtendedRecipeProps {
  fields: RecipeCardFields;
  previewLang?: ActiveLanguage;
}

export function ExtendedRecipe({ fields, previewLang }: ExtendedRecipeProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const theme = resolveDocumentTheme("egnite-extended-recipe", fields);

  const {
    heroImage, title, subtitle, prepTime, cookTime, servings, difficulty,
    ingredients, instructions, sections, tagline,
  } = fields;

  const stepVariant = theme.decorations.stepFill === "ring" ? "ring" : "fill";

  return (
    <PageRoot theme={theme} width={794} height={1123} isRtl={isRtl}>
      {/* ── Coloured header bar ─────────────────────────────────────────── */}
      <div
        style={{
          background: theme.colors.accent,
          color: theme.colors.onAccent,
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <Wordmark theme={theme} tone="onDark" size={1} />
        <span style={{ ...typeStyle("caption", theme), color: theme.colors.onAccent, opacity: 0.85 }}>
          egniteflavors.com
        </span>
      </div>

      {/* ── Hero with optional top + bottom stripes ─────────────────────── */}
      {theme.decorations.heroTopStripe && (
        <div style={{ height: 4, background: theme.colors.accent }} />
      )}
      <div style={{ width: "100%", height: 280, position: "relative", background: theme.colors.surfaceAlt, overflow: "hidden" }}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt={pickLocale(title, lang)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: "100%", height: "100%",
              background: `repeating-linear-gradient(45deg, ${theme.colors.accentSoft} 0 10px, transparent 10px 22px)`,
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6,
            }}
          >
            <span style={{ fontSize: 36, opacity: 0.4 }}>🍽️</span>
            <span style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent, opacity: 0.7 }}>
              Add Hero Image
            </span>
          </div>
        )}
      </div>
      {theme.decorations.heroBottomStripe && (
        <div style={{ height: 4, background: theme.colors.accent }} />
      )}

      {/* ── Title block ─────────────────────────────────────────────────── */}
      <div style={{ padding: `${theme.spacing.blockGap}px ${theme.spacing.pageMarginX}px ${theme.spacing.innerGap}px` }}>
        <h1
          style={{
            ...typeStyle("displayTitle", theme),
            color: theme.colors.ink,
            margin: 0,
            fontFamily: fontFor("display", theme, isRtl),
          }}
        >
          {pickLocale(title, lang)}
        </h1>
        {subtitle && (
          <p style={{ ...typeStyle("body", theme), color: theme.colors.inkMuted, margin: "6px 0 0", fontStyle: "italic" }}>
            {pickLocale(subtitle, lang)}
          </p>
        )}
        <div
          style={{
            display: "flex", marginTop: theme.spacing.innerGap,
            borderTop: `1px solid ${theme.colors.divider}`,
            borderBottom: `1px solid ${theme.colors.divider}`,
            padding: "8px 0",
          }}
        >
          {[
            { label: isRtl ? "التحضير" : "Prep", value: prepTime },
            { label: isRtl ? "الطهي" : "Cook", value: cookTime },
            { label: isRtl ? "الكمية" : "Yield", value: servings },
            { label: isRtl ? "الصعوبة" : "Level", value: difficulty },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent }}>{label}</div>
                <div style={{ ...typeStyle("bodyStrong", theme), color: theme.colors.ink, marginTop: 2 }}>{value}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, background: theme.colors.divider, margin: "0 6px" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Two-column body ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", padding: `${theme.spacing.innerGap}px 0`, minHeight: 280 }}>
        <div style={{ padding: `0 ${theme.spacing.blockGap}px 0 ${theme.spacing.pageMarginX}px` }}>
          <SectionTitle text={isRtl ? "المكونات" : "Ingredients"} theme={theme} />
          {ingredients.map((ing) => (
            <div key={ing.id} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 8 }}>
              <span style={{ fontSize: 17, lineHeight: 1, minWidth: 22, textAlign: "center" }}>{ing.icon}</span>
              <div style={{ flex: 1, ...typeStyle("body", theme) }}>
                <span style={{ fontWeight: 600 }}>{pickLocale(ing.label, lang)}</span>
                {ing.amount && <span style={{ color: theme.colors.inkMuted }}>: {ing.amount}</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: theme.colors.divider }} />

        <div style={{ padding: `0 ${theme.spacing.pageMarginX}px 0 ${theme.spacing.blockGap}px` }}>
          <SectionTitle text={isRtl ? "طريقة التحضير" : "Instructions"} theme={theme} />
          {instructions.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 10 }}>
              <StepNumberCircle n={i + 1} theme={theme} size={20} variant={stepVariant} />
              <p style={{ ...typeStyle("body", theme), margin: 0, flex: 1 }}>{pickLocale(step.text, lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extra sections — full-width with dividers ───────────────────── */}
      {sections.length > 0 && (
        <div style={{ borderTop: `${theme.strokes.imageFrame}px solid ${theme.colors.divider}`, padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px 0` }}>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: theme.spacing.blockGap }}>
              <h3
                style={{
                  ...typeStyle("eyebrow", theme),
                  color: theme.colors.accent,
                  margin: "0 0 8px",
                  paddingBottom: 4,
                  borderBottom: `1px solid ${theme.colors.divider}`,
                }}
              >
                {pickLocale(section.title, lang)}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(section.items as Array<{ id: string; icon: string; label?: { en: string; ar: string }; text?: { en: string; ar: string }; amount?: string }>).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: theme.colors.accentSoft,
                      borderRadius: theme.radii.badge,
                      padding: "4px 10px",
                      ...typeStyle("caption", theme),
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>
                      {item.label
                        ? `${pickLocale(item.label, lang)}${item.amount ? `: ${item.amount}` : ""}`
                        : item.text
                          ? pickLocale(item.text, lang)
                          : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "auto",
          background: theme.colors.accent,
          color: theme.colors.onAccent,
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span style={{ ...typeStyle("cta", theme), color: theme.colors.onAccent, opacity: 0.9 }}>
          {pickLocale(tagline, lang)}
        </span>
        {theme.decorations.badgeStamp && <EnjoyStamp theme={theme} lang={lang} />}
      </div>
    </PageRoot>
  );
}
