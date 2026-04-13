/**
 * Infographic Card Template — A4 Landscape (1123 × 794px)
 * Three-column: ingredients | hero + dosage | instructions
 */
import React from "react";
import type { InfographicCardFields } from "@/lib/types";

const GOLD = "#B78D4B";
const GOLD_LIGHT = "#EBD4A4";
const CREAM = "#FCFAF4";
const INK = "#1A1A1A";

function t(val: { en: string; ar: string }, lang: string): string {
  if (lang === "ar") return val.ar;
  return val.en;
}

export function InfographicCard({ fields }: { fields: InfographicCardFields }) {
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
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: "center",
          padding: "22px 40px 16px",
          borderBottom: `2px solid ${accent}`,
        }}
      >
        <h1
          style={{
            color: accent,
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: 1,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {isBilingual
            ? `${fields.title.en} / ${fields.title.ar}`
            : t(fields.title, lang)}
        </h1>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "4px 0 0", color: "#666" }}>
          {isRtl ? "وقت التحضير" : "Preparation Time"}: {fields.prepTime}
        </p>
      </div>

      {/* ── Three-column grid ───────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr 1fr",
          gap: 24,
          padding: "16px 40px 16px",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left: Ingredients */}
        <div style={{ paddingTop: 8 }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accent,
              marginBottom: 16,
            }}
          >
            {isRtl ? "المكونات" : "Ingredients"}
          </h2>
          {fields.ingredients.map((ing) => (
            <div
              key={ing.id}
              style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {ing.icon}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600 }}>
                  {isBilingual ? `${ing.label.en} / ${ing.label.ar}` : t(ing.label, lang)}
                </span>
                {ing.amount && (
                  <>
                    <br />
                    <span style={{ color: "#666" }}>{ing.amount}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Center: Hero + Dosage */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Hero image */}
          <div
            style={{
              width: "100%",
              flex: 1,
              borderRadius: 12,
              border: `2px solid ${accent}`,
              overflow: "hidden",
              backgroundColor: "#e8e0d0",
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {fields.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fields.heroImage}
                alt={t(fields.title, lang)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: `repeating-linear-gradient(45deg, ${accent}20 0, ${accent}20 8px, transparent 0, transparent 40%)`,
                backgroundSize: "16px 16px",
                backgroundColor: "#f0e8d8",
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6,
              }}>
                <span style={{ fontSize: 36, opacity: 0.35 }}>🍽️</span>
                <span style={{ fontSize: 10, color: accent, fontWeight: 700, opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Add Image</span>
              </div>
            )}
          </div>

          {/* Dosage table */}
          <div style={{ width: "100%" }}>
            <h3
              style={{
                fontSize: 10,
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {isRtl ? "معلومات الجرعة" : "Dosage Information"}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: `2px solid ${accent}`,
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "#F8F1E3",
              }}
            >
              {/* Headers */}
              <div
                style={{
                  backgroundColor: "#F0E2C8",
                  padding: "7px 10px",
                  fontWeight: 700,
                  fontSize: 10,
                  textTransform: "uppercase",
                  borderBottom: `2px solid ${accent}`,
                  borderRight: `2px solid ${accent}`,
                  textAlign: "center",
                }}
              >
                {isRtl ? "جوهر" : "Essence"}
              </div>
              <div
                style={{
                  backgroundColor: "#F0E2C8",
                  padding: "7px 10px",
                  fontWeight: 700,
                  fontSize: 10,
                  textTransform: "uppercase",
                  borderBottom: `2px solid ${accent}`,
                  textAlign: "center",
                }}
              >
                {isRtl ? "إيمولشن" : "Emulsion"}
              </div>
              {/* Essence cell */}
              <div
                style={{
                  padding: "10px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderRight: `2px solid ${accent}`,
                  fontSize: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{fields.dosageEssence.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{fields.dosageEssence.amount}</div>
                  <div style={{ color: "#666", fontSize: 9 }}>
                    {isRtl ? "نطاق الجرعة" : "Dosage range"}: {fields.dosageEssence.range}
                  </div>
                </div>
              </div>
              {/* Emulsion cell */}
              <div
                style={{
                  padding: "10px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{fields.dosageEmulsion.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{fields.dosageEmulsion.amount}</div>
                  <div style={{ color: "#666", fontSize: 9 }}>
                    {isRtl ? "نطاق الجرعة" : "Dosage range"}: {fields.dosageEmulsion.range}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Instructions */}
        <div style={{ paddingTop: 8 }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accent,
              marginBottom: 16,
            }}
          >
            {isRtl ? "طريقة التحضير" : "Step-By-Step Instructions"}
          </h2>
          {fields.instructions.map((step, i) => (
            <div
              key={step.id}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
            >
              {/* Step circle with icon */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    border: `2px solid ${accent}`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FDFBF4",
                    fontSize: 22,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    ...(isRtl ? { right: -4 } : { left: -4 }),
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: accent,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.4, margin: 0, flex: 1 }}>
                {isBilingual
                  ? `${step.text.en} / ${step.text.ar}`
                  : t(step.text, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: GOLD_LIGHT,
          padding: "12px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `2px solid ${accent}`,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 12 }}>
          {isBilingual
            ? `${fields.footerTagline.en} · ${fields.footerTagline.ar}`
            : t(fields.footerTagline, lang)}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            color: accent,
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          }}
        >
          ✦ EGNITE
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
          <span>egniteflavors.com</span>
          {["🌐", "f", "X", "♪"].map((icon, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: INK,
                color: GOLD_LIGHT,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 700,
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
