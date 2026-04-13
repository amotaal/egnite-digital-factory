/**
 * Beverage Guide Template — A4 Landscape (1123 × 794px)
 * Dark header, ingredients + dosage, horizontal steps
 */
import React from "react";
import type { BeverageCardFields } from "@/lib/types";

const GOLD = "#B78D4B";
const GOLD_LIGHT = "#EBD4A4";
const CREAM = "#FCFAF4";
const INK = "#1A1A1A";
const DARK_HEADER = "#1A1A1A";

function t(val: { en: string; ar: string }, lang: string): string {
  if (lang === "ar") return val.ar;
  return val.en;
}

export function BeverageCard({ fields }: { fields: BeverageCardFields }) {
  const lang = fields.language;
  const isRtl = lang === "ar";
  const isBilingual = lang === "bilingual";
  const dir = isRtl ? "rtl" : "ltr";
  const accent = fields.primaryColor ?? GOLD;
  const bg = fields.backgroundColor ?? CREAM;

  return (
    <div
      className="template-root"
      dir={dir}
      style={{
        width: 1123,
        height: 794,
        backgroundColor: bg,
        fontFamily: isRtl
          ? "'Cairo', 'Segoe UI', Arial, sans-serif"
          : "'Inter', 'Segoe UI', Arial, sans-serif",
        color: INK,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Dark Header ──────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: DARK_HEADER,
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              color: accent,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {isBilingual
              ? `${fields.title.en} / ${fields.title.ar}`
              : t(fields.title, lang)}
          </h1>
          <p style={{ color: "#999", fontSize: 12, margin: "2px 0 0" }}>
            {isBilingual
              ? `${fields.subtitle.en} / ${fields.subtitle.ar}`
              : t(fields.subtitle, lang)}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: accent, fontSize: 22 }}>✦</span>
          <span
            style={{
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: "0.15em",
              color: accent,
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            }}
          >
            EGNITE
          </span>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left: Ingredients + Dosage */}
        <div
          style={{
            padding: "20px 24px 20px 40px",
            borderRight: `2px solid ${GOLD_LIGHT}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Ingredients table */}
          <div>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: accent,
                marginBottom: 10,
              }}
            >
              {isRtl ? "المكونات" : "Ingredients"}
            </h2>
            <div
              style={{
                border: `1.5px solid ${accent}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {fields.ingredients.map((ing, i) => (
                <div
                  key={ing.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 12px",
                    backgroundColor: i % 2 === 0 ? "#FAF5EC" : CREAM,
                    borderBottom:
                      i < fields.ingredients.length - 1
                        ? `1px solid ${GOLD_LIGHT}`
                        : "none",
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{ing.icon}</span>
                  <span style={{ fontWeight: 600, flex: 1 }}>
                    {isBilingual
                      ? `${ing.label.en} / ${ing.label.ar}`
                      : t(ing.label, lang)}
                  </span>
                  <span style={{ color: "#666" }}>{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dosage box */}
          <div
            style={{
              backgroundColor: "#F0E2C8",
              border: `2px solid ${accent}`,
              borderRadius: 10,
              padding: "12px 16px",
            }}
          >
            <h3
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: accent,
                marginBottom: 6,
              }}
            >
              {isRtl ? "جرعة الاستخدام" : "Recommended Dosage"}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{fields.dosage.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{fields.dosage.amount}</div>
                <div style={{ fontSize: 11, color: "#666" }}>
                  {isRtl ? "النطاق" : "Range"}: {fields.dosage.range}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preparation steps + Storage */}
        <div style={{ padding: "20px 40px 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: accent,
                marginBottom: 12,
              }}
            >
              {isRtl ? "خطوات التحضير" : "Preparation Steps"}
            </h2>

            {/* Horizontal steps */}
            <div style={{ display: "flex", gap: 0, position: "relative" }}>
              {/* Connecting line */}
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  left: 22,
                  right: 22,
                  height: 2,
                  backgroundColor: GOLD_LIGHT,
                  zIndex: 0,
                }}
              />
              {fields.steps.map((step, i) => (
                <div
                  key={step.id}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Circle */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: accent,
                      border: `3px solid ${bg}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  {/* Step number */}
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: INK,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 8,
                      fontWeight: 800,
                      marginTop: -4,
                    }}
                  >
                    {i + 1}
                  </div>
                  {/* Text */}
                  <p
                    style={{
                      fontSize: 10,
                      textAlign: "center",
                      lineHeight: 1.3,
                      margin: 0,
                      maxWidth: 90,
                    }}
                  >
                    {isBilingual
                      ? step.text.en
                      : t(step.text, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Note */}
          <div
            style={{
              marginTop: "auto",
              backgroundColor: DARK_HEADER,
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: accent,
                  marginBottom: 4,
                }}
              >
                {isRtl ? "ملاحظة التخزين" : "Storage Note"}
              </div>
              <p style={{ fontSize: 11, color: "#ddd", lineHeight: 1.4, margin: 0 }}>
                {isBilingual
                  ? fields.storageNote.en
                  : t(fields.storageNote, lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: GOLD_LIGHT,
          padding: "10px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `2px solid ${accent}`,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 11 }}>
          {isBilingual
            ? `${fields.footerTagline.en} · ${fields.footerTagline.ar}`
            : t(fields.footerTagline, lang)}
        </span>
        <span style={{ fontSize: 10, color: "#888" }}>egniteflavors.com</span>
      </div>
    </div>
  );
}
