/**
 * Recipe Card Template — A4 Portrait (794 × 1123px)
 *
 * Visual reference: sources/{creamy_pinwheel_cookies,coconut_madeleines,
 * lemon_cake,bubblegum_fudgebites,mixedberries_cake,wildberry_cupcakes,
 * coffeebean_cookies,hazelnut_chocolate_cookies}.png.
 *
 * All colours, fonts, radii, and spacing values come from `lib/design-tokens.ts`
 * (resolved through the recipe-card theme preset). No literal hex codes.
 */
import React from "react";
import type { ActiveLanguage, RecipeCardFields } from "@/lib/types";
import { TYPE } from "@/lib/design-tokens";
import {
  BracketFrame,
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

interface RecipeCardProps {
  fields: RecipeCardFields;
  previewLang?: ActiveLanguage;
}

export function RecipeCard({ fields, previewLang }: RecipeCardProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const theme = resolveDocumentTheme("egnite-recipe-card", fields);

  const {
    heroImage, title, subtitle, prepTime, cookTime, servings,
    ingredients, instructions, sections, tagline,
  } = fields;

  const stepVariant = theme.decorations.stepFill === "ring" ? "ring" : "fill";

  return (
    <PageRoot theme={theme} width={794} height={1123} isRtl={isRtl}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px`,
          background: theme.colors.surface,
          borderBottom: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
        }}
      >
        <Wordmark theme={theme} tone="ink" size={1} />
        <span style={{ ...typeStyle("caption", theme), color: theme.colors.inkMuted }}>
          {/* website pulled from BRAND constant inside FooterBar; mirror here */}
          egniteflavors.com
        </span>
      </div>

      {/* ── Hero image with bracket frame ───────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", height: 320, background: theme.colors.surfaceAlt, overflow: "hidden" }}>
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
        {theme.decorations.heroFrameStyle === "bracket" && (
          <BracketFrame color={theme.colors.accent} thickness={theme.strokes.imageFrame} length={32} inset={12} />
        )}
        {theme.decorations.heroBottomStripe && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: theme.colors.accent }} />
        )}
      </div>

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

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            marginTop: theme.spacing.innerGap,
            borderTop: `1px solid ${theme.colors.divider}`,
            borderBottom: `1px solid ${theme.colors.divider}`,
            padding: "8px 0",
          }}
        >
          {[
            { label: isRtl ? "وقت التحضير" : "Prep Time", value: prepTime },
            { label: isRtl ? "وقت الطهي" : "Cook Time", value: cookTime },
            { label: isRtl ? "الكمية" : "Yield", value: servings },
          ].map((m, i, arr) => (
            <React.Fragment key={m.label}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent }}>{m.label}</div>
                <div style={{ ...typeStyle("bodyStrong", theme), color: theme.colors.ink, marginTop: 2 }}>{m.value}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, background: theme.colors.divider, margin: "0 6px" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Two-column body ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          flex: 1,
          padding: `${theme.spacing.innerGap}px 0`,
          minHeight: 360,
        }}
      >
        {/* Ingredients (optionally wrapped in white rounded card) */}
        <div style={{ padding: `0 ${theme.spacing.blockGap}px 0 ${theme.spacing.pageMarginX}px` }}>
          <SectionTitle text={isRtl ? "المكونات" : "Ingredients"} theme={theme} />
          <div
            style={{
              background: theme.decorations.ingredientCard ? theme.colors.surface : "transparent",
              borderRadius: theme.decorations.ingredientCard ? theme.radii.card : 0,
              padding: theme.decorations.ingredientCard ? `${theme.spacing.innerGap}px ${theme.spacing.innerGap}px` : 0,
              boxShadow: theme.decorations.ingredientCard ? theme.shadows.card : "none",
            }}
          >
            {ingredients.map((ing) => (
              <div key={ing.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                <span style={{ fontSize: 18, lineHeight: 1, minWidth: 22, textAlign: "center" }}>{ing.icon}</span>
                <div style={{ flex: 1, ...typeStyle("body", theme) }}>
                  <span style={{ fontWeight: 600 }}>{pickLocale(ing.label, lang)}</span>
                  {ing.amount && <span style={{ color: theme.colors.inkMuted }}>: {ing.amount}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ background: theme.colors.divider }} />

        {/* Instructions */}
        <div style={{ padding: `0 ${theme.spacing.pageMarginX}px 0 ${theme.spacing.blockGap}px` }}>
          <SectionTitle text={isRtl ? "طريقة التحضير" : "Instructions"} theme={theme} />
          {instructions.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 11 }}>
              <StepNumberCircle n={i + 1} theme={theme} variant={stepVariant} />
              <p style={{ ...typeStyle("body", theme), margin: 0, flex: 1 }}>{pickLocale(step.text, lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extra sections (chips) ──────────────────────────────────────── */}
      {sections.length > 0 && (
        <div style={{ borderTop: `1px solid ${theme.colors.divider}`, margin: `0 ${theme.spacing.pageMarginX}px`, paddingTop: theme.spacing.innerGap }}>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: 12 }}>
              <h3
                style={{
                  ...typeStyle("eyebrow", theme),
                  color: theme.colors.accent,
                  margin: "0 0 6px",
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
                      borderRadius: theme.radii.pill,
                      padding: "4px 10px",
                      fontSize: TYPE.caption.size,
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

      {/* ── Footer: tagline left, ENJOY EVERY BITE stamp right ──────────── */}
      <div
        style={{
          marginTop: "auto",
          background: theme.colors.accentSoft,
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
        }}
      >
        <span style={{ ...typeStyle("cta", theme), color: theme.colors.ink }}>
          {pickLocale(tagline, lang)}
        </span>
        {theme.decorations.badgeStamp && <EnjoyStamp theme={theme} lang={lang} />}
      </div>

    </PageRoot>
  );
}

// ─── Bilingual label helpers (kept for backwards compatibility) ──────────────
export const resolveLocale = pickLocale;
