/**
 * Beverage Guide Template — A4 Landscape (1123 × 794px)
 *
 * Visual target: sources/other_infographic.jpeg.
 *
 * Layout (top → bottom):
 *   · Charcoal top banner with a centered uppercase PillLabel ("CARBONATED")
 *     plus product title + subtitle beneath the pill.
 *   · Band 1 — Ingredients 4-column table (Icon · Item · Quantity · Weight)
 *              on the left, tri-dose block (Starting / Quick / Range) on the
 *              right.
 *   · Band 2 — Full-width horizontal step flow with a gold connector line
 *              behind gold numbered step circles + flat icon + caption.
 *   · Band 3 — Full-width charcoal storage callout.
 *   · FooterBar (charcoal) with tagline + wordmark + social.
 */
import React from "react";
import type {
  ActiveLanguage,
  BeverageCardFields,
  DosageCell,
} from "@/lib/types";
import {
  FooterBar,
  PageRoot,
  PillLabel,
  SectionTitle,
  StepNumberCircle,
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

  // Tri-dose cells, with a graceful fallback to the legacy single `dosage`
  // field when the new tri-cell shape hasn't been populated yet.
  const triDose: DosageCell[] = [
    fields.dosageStarting ?? {
      label: { en: "Starting Dose", ar: "جرعة الانطلاق" },
      value: fields.dosage.amount,
      icon: fields.dosage.icon,
    },
    fields.dosageQuick ?? {
      label: { en: "Quick Dose", ar: "جرعة سريعة" },
      value: fields.dosage.amount,
      icon: fields.dosage.icon,
    },
    fields.dosageRange ?? {
      label: { en: "Dosage Range", ar: "نطاق الجرعة" },
      value: fields.dosage.range,
      icon: fields.dosage.icon,
    },
  ];

  const ingHeaders = [
    "",
    isRtl ? "المكوّن" : "Item",
    isRtl ? "الكمية" : "Quantity",
    isRtl ? "الوزن" : "Weight",
  ];

  return (
    <PageRoot theme={theme} width={1123} height={794} isRtl={isRtl} fixedHeight>
      {/* ── Charcoal header banner ─────────────────────────────────────── */}
      <div
        style={{
          background: theme.colors.footerBg,
          color: theme.colors.onDark,
          padding: `18px ${theme.spacing.pageMarginX}px 16px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <PillLabel
          text={pickLocale(fields.headerPill, lang)}
          theme={theme}
          tone="onDark"
        />
        <h1
          style={{
            ...typeStyle("displayTitle", theme),
            color: theme.colors.footerAccent,
            margin: 0,
            fontSize: 30,
            fontFamily: fontFor("display", theme, isRtl),
            textAlign: "center",
          }}
        >
          {pickLocale(fields.title, lang)}
        </h1>
        {fields.subtitle && (
          <p
            style={{
              ...typeStyle("body", theme),
              color: theme.colors.onDark,
              opacity: 0.82,
              margin: 0,
              fontStyle: "italic",
              textAlign: "center",
              fontSize: 12,
            }}
          >
            {pickLocale(fields.subtitle, lang)}
          </p>
        )}
      </div>

      {/* ── Band 1 — Ingredients table + Tri-dose ──────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: theme.spacing.sectionGap,
          padding: `16px ${theme.spacing.pageMarginX}px 8px`,
        }}
      >
        {/* 4-col ingredients table */}
        <div>
          <SectionTitle
            text={isRtl ? "المكونات" : "INGREDIENTS"}
            theme={theme}
          />
          <div
            style={{
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: theme.radii.card,
              overflow: "hidden",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "42px 1.6fr 1fr 1fr",
                background: theme.colors.accentHeaderFill,
                borderBottom: `1px solid ${theme.colors.accent}`,
              }}
            >
              {ingHeaders.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "7px 10px",
                    ...typeStyle("eyebrow", theme),
                    color: theme.colors.ink,
                    fontSize: 9.5,
                    letterSpacing: 1.4,
                    textAlign: i === 0 ? "center" : "start",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Body rows */}
            {fields.ingredients.map((ing, i) => (
              <div
                key={ing.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "42px 1.6fr 1fr 1fr",
                  alignItems: "center",
                  background:
                    i % 2 === 0
                      ? theme.colors.surface
                      : theme.colors.surfaceAlt,
                  borderBottom:
                    i < fields.ingredients.length - 1
                      ? `1px solid ${theme.colors.divider}`
                      : "none",
                  ...typeStyle("body", theme),
                  fontSize: 11.5,
                }}
              >
                <div style={{ textAlign: "center", fontSize: 18 }}>
                  {ing.icon}
                </div>
                <div style={{ padding: "6px 10px", fontWeight: 600 }}>
                  {pickLocale(ing.label, lang)}
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    color: theme.colors.inkMuted,
                  }}
                >
                  {ing.quantity ?? ing.amount}
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    color: theme.colors.inkMuted,
                  }}
                >
                  {ing.weight ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tri-dose */}
        <div>
          <SectionTitle
            text={isRtl ? "معلومات الجرعة" : "DOSAGE INFORMATION"}
            theme={theme}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: theme.radii.card,
              overflow: "hidden",
            }}
          >
            {triDose.map((cell, i) => (
              <div
                key={i}
                style={{
                  borderInlineEnd:
                    i < 2
                      ? `1px solid ${theme.colors.accent}`
                      : "none",
                  background: theme.colors.accentFill,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    background: theme.colors.accentHeaderFill,
                    padding: "7px 8px",
                    ...typeStyle("eyebrow", theme),
                    color: theme.colors.ink,
                    fontSize: 9.5,
                    letterSpacing: 1.2,
                    textAlign: "center",
                    borderBottom: `1px solid ${theme.colors.accent}`,
                  }}
                >
                  {pickLocale(cell.label, lang)}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  {cell.icon && (
                    <span style={{ fontSize: 20 }}>{cell.icon}</span>
                  )}
                  <div
                    style={{
                      ...typeStyle("amount", theme),
                      color: theme.colors.ink,
                      fontSize: 13,
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    {cell.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Band 2 — Horizontal step flow ──────────────────────────────── */}
      <div
        style={{
          padding: `10px ${theme.spacing.pageMarginX}px 6px`,
        }}
      >
        <SectionTitle
          text={isRtl ? "خطوات التحضير" : "PREPARATION STEPS"}
          theme={theme}
          align="center"
        />
        <div style={{ position: "relative", marginTop: 6 }}>
          {/* Connector line behind circles */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: "7%",
              right: "7%",
              height: 2,
              background: theme.colors.accent,
              opacity: 0.45,
              zIndex: 0,
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${fields.steps.length}, 1fr)`,
              gap: 8,
              position: "relative",
              zIndex: 1,
            }}
          >
            {fields.steps.map((step, i) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  textAlign: "center",
                }}
              >
                <StepNumberCircle
                  n={i + 1}
                  theme={theme}
                  size={40}
                  variant="fill"
                />
                <span style={{ fontSize: 18 }}>{step.icon}</span>
                <p
                  style={{
                    ...typeStyle("caption", theme),
                    color: theme.colors.ink,
                    margin: 0,
                    fontSize: 10.5,
                    maxWidth: 150,
                    lineHeight: 1.35,
                  }}
                >
                  {pickLocale(step.text, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Band 3 — Charcoal storage callout ──────────────────────────── */}
      <div
        style={{
          margin: `8px ${theme.spacing.pageMarginX}px 12px`,
          background: theme.colors.footerBg,
          color: theme.colors.onDark,
          borderRadius: theme.radii.card,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              ...typeStyle("eyebrow", theme),
              color: theme.colors.footerAccent,
              fontSize: 9.5,
              letterSpacing: 1.5,
            }}
          >
            {isRtl ? "ملاحظة التخزين" : "STORAGE NOTE"}
          </span>
          <p
            style={{
              ...typeStyle("body", theme),
              color: theme.colors.onDark,
              opacity: 0.92,
              margin: 0,
              fontSize: 11.5,
            }}
          >
            {pickLocale(fields.storageNote, lang)}
          </p>
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
