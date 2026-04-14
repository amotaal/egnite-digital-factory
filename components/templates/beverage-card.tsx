/**
 * Beverage Guide Template — A4 Landscape (1123 × 794px)
 *
 * Visual reference: sources/other_infographic.jpeg — charcoal banner header,
 * ingredients table on the left, dosage box, horizontal step flow on the
 * right, and a charcoal callout for the storage note. Carbonated speckle/
 * bubble background texture from the `egnite-beverage-card` preset.
 */
import React from "react";
import type { ActiveLanguage, BeverageCardFields } from "@/lib/types";
import {
  FooterBar,
  PageRoot,
  SectionTitle,
  StepNumberCircle,
  Wordmark,
  fontFor,
  pickLocale,
  resolveDocumentTheme,
  typeStyle,
} from "./_shared";

interface BeverageCardProps {
  fields: BeverageCardFields;
  previewLang?: ActiveLanguage;
}

export function BeverageCard({ fields, previewLang }: BeverageCardProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const theme = resolveDocumentTheme("egnite-beverage-card", fields);

  return (
    <PageRoot theme={theme} width={1123} height={794} isRtl={isRtl} fixedHeight>
      {/* ── Charcoal header banner ─────────────────────────────────────── */}
      <div
        style={{
          background: theme.colors.footerBg,
          padding: `${theme.spacing.blockGap}px ${theme.spacing.pageMarginX}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              ...typeStyle("h1", theme),
              color: theme.colors.footerAccent,
              margin: 0,
              fontFamily: fontFor("display", theme, isRtl),
            }}
          >
            {pickLocale(fields.title, lang)}
          </h1>
          <p style={{ ...typeStyle("bodyLg", theme), color: theme.colors.onDark, opacity: 0.85, margin: "4px 0 0", fontStyle: "italic" }}>
            {pickLocale(fields.subtitle, lang)}
          </p>
        </div>
        <Wordmark theme={theme} tone="onDark" size={1.05} />
      </div>

      {/* ── Two-column body ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left: Ingredients + Dosage */}
        <div
          style={{
            padding: `${theme.spacing.blockGap}px ${theme.spacing.blockGap}px ${theme.spacing.blockGap}px ${theme.spacing.pageMarginX}px`,
            borderInlineEnd: `${theme.strokes.divider}px solid ${theme.colors.divider}`,
            display: "flex", flexDirection: "column", gap: theme.spacing.blockGap,
          }}
        >
          <div>
            <SectionTitle text={isRtl ? "المكونات" : "Ingredients"} theme={theme} />
            <div
              style={{
                border: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
                borderRadius: theme.radii.card,
                overflow: "hidden",
              }}
            >
              {fields.ingredients.map((ing, i) => (
                <div
                  key={ing.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px",
                    background: i % 2 === 0 ? theme.colors.surfaceAlt : theme.colors.surface,
                    borderBottom: i < fields.ingredients.length - 1 ? `1px solid ${theme.colors.divider}` : "none",
                    ...typeStyle("body", theme),
                  }}
                >
                  <span style={{ fontSize: 18 }}>{ing.icon}</span>
                  <span style={{ fontWeight: 600, flex: 1 }}>{pickLocale(ing.label, lang)}</span>
                  <span style={{ color: theme.colors.inkMuted }}>{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: theme.colors.accentHeaderFill,
              border: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
              borderRadius: theme.radii.card,
              padding: `${theme.spacing.innerGap}px ${theme.spacing.blockGap}px`,
            }}
          >
            <h3 style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent, margin: "0 0 6px" }}>
              {isRtl ? "جرعة الاستخدام" : "Recommended Dosage"}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{fields.dosage.icon}</span>
              <div>
                <div style={{ ...typeStyle("amount", theme), fontSize: 16 }}>{fields.dosage.amount}</div>
                <div style={{ ...typeStyle("caption", theme), color: theme.colors.inkMuted }}>
                  {isRtl ? "النطاق" : "Range"}: {fields.dosage.range}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: horizontal preparation steps + storage callout */}
        <div
          style={{
            padding: `${theme.spacing.blockGap}px ${theme.spacing.pageMarginX}px ${theme.spacing.blockGap}px ${theme.spacing.blockGap}px`,
            display: "flex", flexDirection: "column", gap: theme.spacing.innerGap,
          }}
        >
          <div>
            <SectionTitle text={isRtl ? "خطوات التحضير" : "Preparation Steps"} theme={theme} />

            <div style={{ display: "flex", gap: 0, position: "relative" }}>
              {/* connecting line */}
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  left: 22,
                  right: 22,
                  height: theme.strokes.divider,
                  background: theme.colors.divider,
                  zIndex: 0,
                }}
              />
              {fields.steps.map((step, i) => (
                <div
                  key={step.id}
                  style={{
                    flex: 1,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 8,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44,
                      borderRadius: "50%",
                      background: theme.colors.accent,
                      border: `${theme.strokes.imageFrame}px solid ${theme.colors.background}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                      color: theme.colors.onAccent,
                    }}
                  >
                    {step.icon}
                  </div>
                  <StepNumberCircle n={i + 1} theme={theme} size={18} variant="ink" />
                  <p
                    style={{
                      ...typeStyle("caption", theme),
                      textAlign: "center",
                      margin: 0,
                      maxWidth: 100,
                      color: theme.colors.ink,
                    }}
                  >
                    {pickLocale(step.text, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "auto",
              background: theme.colors.footerBg,
              borderRadius: theme.radii.card,
              padding: `${theme.spacing.innerGap}px ${theme.spacing.blockGap}px`,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              color: theme.colors.onDark,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ ...typeStyle("eyebrow", theme), color: theme.colors.footerAccent, marginBottom: 4 }}>
                {isRtl ? "ملاحظة التخزين" : "Storage Note"}
              </div>
              <p style={{ ...typeStyle("body", theme), color: theme.colors.onDark, opacity: 0.9, margin: 0 }}>
                {pickLocale(fields.storageNote, lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterBar
        theme={theme}
        taglineText={pickLocale(fields.footerTagline, lang)}
        showSocial={false}
        showWebsite
      />
    </PageRoot>
  );
}
