/**
 * Infographic Card Template — A4 Landscape (1123 × 794px)
 *
 * Visual target: sources/sample_infographic.jpg (BISCUIT FILLING).
 *
 * Layout:
 *   · Header: centered uppercase gold title + "Preparation Time: N minutes".
 *   · Three columns (left → right):
 *       INGREDIENTS        — flat illustrated icons + label text (no pill).
 *       HERO + DOSAGE      — plain hero photo (no frame), 2-col dosage table
 *                            (ESSENCE / EMULSION) with no cell icons.
 *       STEP-BY-STEP       — gold filled circle with ONLY the number, plus a
 *                            separate flat icon next to the step text.
 *   · Footer: charcoal band with "Creativity with Confidence" (left),
 *             "egnite" wordmark (centre), website + social (right).
 */
import React from "react";
import type { ActiveLanguage, InfographicCardFields } from "@/lib/types";
import {
  CenteredTitle,
  FooterBar,
  PageRoot,
  SectionTitle,
  StepNumberCircle,
  pickLocale,
  resolveDocumentTheme,
  typeStyle,
} from "./_shared";

interface InfographicCardProps {
  fields: InfographicCardFields;
  previewLang?: ActiveLanguage;
}

export function InfographicCard({ fields, previewLang }: InfographicCardProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const theme = resolveDocumentTheme("egnite-infographic", fields);

  const dosageCells = [
    { header: isRtl ? "جوهر" : "ESSENCE", row: fields.dosageEssence },
    { header: isRtl ? "إيمولشن" : "EMULSION", row: fields.dosageEmulsion },
  ];

  return (
    <PageRoot theme={theme} width={1123} height={794} isRtl={isRtl} fixedHeight>
      {/* Header ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: `24px ${theme.spacing.pageMarginX}px 8px` }}>
        <CenteredTitle text={pickLocale(fields.title, lang)} theme={theme} isRtl={isRtl} />
        <p
          style={{
            ...typeStyle("body", theme),
            color: theme.colors.ink,
            textAlign: "center",
            margin: "4px 0 0",
            fontSize: 12,
          }}
        >
          {isRtl ? "وقت التحضير" : "Preparation Time"}: {fields.prepTime}
        </p>
      </div>

      {/* 3-column body ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr 1fr",
          gap: theme.spacing.sectionGap,
          padding: `14px ${theme.spacing.pageMarginX}px 18px`,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Ingredients — flat icons */}
        <div>
          <SectionTitle text={isRtl ? "المكونات" : "INGREDIENTS"} theme={theme} align="center" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
            {fields.ingredients.map((ing) => (
              <div
                key={ing.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  ...typeStyle("body", theme),
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    width: 34,
                    textAlign: "center",
                    flexShrink: 0,
                    filter: "saturate(0.85)",
                  }}
                >
                  {ing.icon}
                </span>
                <span style={{ flex: 1 }}>
                  <span>{pickLocale(ing.label, lang)}</span>
                  {ing.amount && (
                    <span style={{ color: theme.colors.inkMuted }}>: {ing.amount}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero (plain) + Dosage table */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "4 / 3",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: theme.colors.surfaceAlt,
            }}
          >
            {fields.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fields.heroImage}
                alt={pickLocale(fields.title, lang)}
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `repeating-linear-gradient(45deg, ${theme.colors.accentSoft} 0 10px, transparent 10px 22px)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 32, opacity: 0.4 }}>📷</span>
                <span style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent, opacity: 0.7 }}>
                  {isRtl ? "أضف صورة" : "Add Hero Image"}
                </span>
              </div>
            )}
          </div>

          {/* Dosage table — no cell icons */}
          <div style={{ width: "100%" }}>
            <h3
              style={{
                ...typeStyle("sectionTitle", theme),
                color: theme.colors.ink,
                margin: "0 0 6px",
                textAlign: "center",
                fontSize: 11,
              }}
            >
              {isRtl ? "معلومات الجرعة" : "DOSAGE INFORMATION"}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: `1px solid ${theme.colors.accent}`,
                borderRadius: theme.radii.card,
                overflow: "hidden",
              }}
            >
              {dosageCells.map((cell, idx) => (
                <div
                  key={cell.header}
                  style={{
                    borderInlineEnd:
                      idx === 0 ? `1px solid ${theme.colors.accent}` : "none",
                    background: theme.colors.accentFill,
                  }}
                >
                  <div
                    style={{
                      background: theme.colors.accentHeaderFill,
                      padding: "6px 10px",
                      ...typeStyle("eyebrow", theme),
                      color: theme.colors.ink,
                      textAlign: "center",
                      fontSize: 10,
                      letterSpacing: 1.5,
                      borderBottom: `1px solid ${theme.colors.accent}`,
                    }}
                  >
                    {cell.header}
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "start" }}>
                    <div
                      style={{
                        ...typeStyle("amount", theme),
                        color: theme.colors.ink,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {cell.row.amount}
                    </div>
                    <div
                      style={{
                        ...typeStyle("caption", theme),
                        color: theme.colors.inkMuted,
                        fontSize: 10,
                        marginTop: 2,
                      }}
                    >
                      {isRtl ? "نطاق الجرعة" : "Dosage range"} {cell.row.range}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions — filled circle (number only) + separate flat icon */}
        <div>
          <SectionTitle
            text={isRtl ? "طريقة التحضير" : "STEP-BY-STEP INSTRUCTIONS"}
            theme={theme}
            align="center"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
            {fields.instructions.map((step, i) => (
              <div
                key={step.id}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <StepNumberCircle n={i + 1} theme={theme} size={28} variant="fill" />
                <span
                  style={{
                    fontSize: 20,
                    width: 26,
                    textAlign: "center",
                    flexShrink: 0,
                    filter: "saturate(0.85)",
                  }}
                >
                  {step.icon}
                </span>
                <p style={{ ...typeStyle("body", theme), margin: 0, flex: 1, fontSize: 12 }}>
                  {`${i + 1}. ${pickLocale(step.text, lang)}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterBar
        theme={theme}
        taglineText={pickLocale(fields.footerTagline, lang)}
        showSocial
        showWebsite
      />
    </PageRoot>
  );
}
