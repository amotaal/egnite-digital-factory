/**
 * Infographic Card Template — A4 Landscape (1123 × 794px)
 * Three-column: ingredients | hero + dosage | instructions
 *
 * Spec source: sources/sample_infographic.html
 *   - Header h1: 3rem, weight 800, letter-spacing 1px
 *   - Grid: 1fr 1.5fr 1fr
 *   - Ingredient icon: 45×45px @ 1.8rem
 *   - Step circle: 55×55px, border 2px, icon 1.5rem
 *   - Step number badge: 22×22px at position -5/-5
 *   - Image: aspect-ratio 4/3, border 3px, radius 15px
 *   - Footer: padding 15px 40px, logo 1.8rem wt800 letter-spacing -1px
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
        border: "1px solid #EAE1D0",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: "center",
          padding: "30px 20px 20px 20px",
        }}
      >
        <h1
          style={{
            color: accent,
            fontSize: 48, // 3rem
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 5,
            fontFamily: isRtl
              ? "'Cairo', 'Segoe UI', Arial, sans-serif"
              : "'Playfair Display', Georgia, serif",
            lineHeight: 1.1,
          }}
        >
          {isBilingual
            ? `${fields.title.en} / ${fields.title.ar}`
            : t(fields.title, lang)}
        </h1>
        <p style={{ fontSize: 17, fontWeight: 500, margin: 0 }}>
          {isRtl ? "وقت التحضير" : "Preparation Time"}: {fields.prepTime}
        </p>
      </div>

      {/* ── Three-column grid ───────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 1fr",
          gap: 30,
          padding: "10px 40px 20px 40px",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left: Ingredients */}
        <div style={{ paddingTop: 10 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 18,
              color: INK,
            }}
          >
            {isRtl ? "المكونات" : "Ingredients"}
          </h2>
          {fields.ingredients.map((ing) => (
            <div
              key={ing.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                marginBottom: 18,
                fontSize: 15,
                lineHeight: 1.3,
              }}
            >
              <div
                style={{
                  width: 45,
                  height: 45,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 29, // 1.8rem
                  flexShrink: 0,
                }}
              >
                {ing.icon}
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>
                  {isBilingual ? `${ing.label.en} / ${ing.label.ar}` : t(ing.label, lang)}
                </span>
                {ing.amount && (
                  <>
                    : {ing.amount}
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
            gap: 18,
          }}
        >
          {/* Hero image — aspect-ratio 4/3 per source */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: 15,
              border: `3px solid ${accent}`,
              overflow: "hidden",
              backgroundColor: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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
                background: `repeating-linear-gradient(45deg, ${accent}30 0, ${accent}30 8px, transparent 0, transparent 40%)`,
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
          <div style={{ width: "100%", textAlign: "center" }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              {isRtl ? "معلومات الجرعة" : "Dosage Information"}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: `2px solid ${accent}`,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: "#F8F1E3",
              }}
            >
              {/* Headers */}
              <div
                style={{
                  backgroundColor: "#F0E2C8",
                  padding: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottom: `2px solid ${accent}`,
                  borderInlineEnd: `2px solid ${accent}`,
                }}
              >
                {isRtl ? "جوهر" : "Essence"}
              </div>
              <div
                style={{
                  backgroundColor: "#F0E2C8",
                  padding: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottom: `2px solid ${accent}`,
                }}
              >
                {isRtl ? "إيمولشن" : "Emulsion"}
              </div>
              {/* Essence cell */}
              <div
                style={{
                  padding: "15px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "start",
                  fontSize: 12,
                  borderInlineEnd: `2px solid ${accent}`,
                }}
              >
                <span style={{ fontSize: 22, width: 30, flexShrink: 0, textAlign: "center" }}>{fields.dosageEssence.icon}</span>
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 5 }}>{fields.dosageEssence.amount}</div>
                  <div style={{ fontSize: 11 }}>
                    {isRtl ? "نطاق الجرعة" : "Dosage range"}
                    <br />
                    {fields.dosageEssence.range}
                  </div>
                </div>
              </div>
              {/* Emulsion cell */}
              <div
                style={{
                  padding: "15px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "start",
                  fontSize: 12,
                }}
              >
                <span style={{ fontSize: 22, width: 30, flexShrink: 0, textAlign: "center" }}>{fields.dosageEmulsion.icon}</span>
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 5 }}>{fields.dosageEmulsion.amount}</div>
                  <div style={{ fontSize: 11 }}>
                    {isRtl ? "نطاق الجرعة" : "Dosage range"}
                    <br />
                    {fields.dosageEmulsion.range}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Instructions */}
        <div style={{ paddingTop: 10 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 18,
              color: INK,
            }}
          >
            {isRtl ? "طريقة التحضير" : "Step-By-Step Instructions"}
          </h2>
          {fields.instructions.map((step, i) => (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                marginBottom: 22,
              }}
            >
              {/* Step circle with icon */}
              <div
                style={{
                  position: "relative",
                  width: 55,
                  height: 55,
                  border: `2px solid ${accent}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FDFBF4",
                  fontSize: 24, // 1.5rem
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -5,
                    ...(isRtl ? { right: -5 } : { left: -5 }),
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: accent,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  {i + 1}
                </div>
                {step.icon}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.3, margin: 0, flex: 1 }}>
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
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 17 }}>
          {isBilingual
            ? `${fields.footerTagline.en} · ${fields.footerTagline.ar}`
            : t(fields.footerTagline, lang)}
        </span>
        <span
          style={{
            fontSize: 29, // 1.8rem
            fontWeight: 800,
            letterSpacing: "-1px",
            color: INK,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Egnite
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500 }}>
          <span>egniteflavors.com</span>
          <div style={{ display: "flex", gap: 5 }}>
            {["🌐", "f", "X", "♪"].map((icon, i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: INK,
                  color: GOLD_LIGHT,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: "bold",
                }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
