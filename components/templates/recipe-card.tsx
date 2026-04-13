/**
 * Recipe Card Template — A4 Portrait (794 × 1123px)
 * Egnite Digital Factory
 */
import React from "react";
import type { RecipeCardFields, ActiveLanguage } from "@/lib/types";

interface RecipeCardProps {
  fields: RecipeCardFields;
  /** Override language for preview purposes */
  previewLang?: ActiveLanguage;
}

function t(val: { en: string; ar: string }, lang: ActiveLanguage): string {
  if (lang === "ar") return val.ar;
  if (lang === "bilingual") return val.en;
  return val.en;
}

function tAr(val: { en: string; ar: string }): string {
  return val.ar;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const GOLD = "#B78D4B";
const GOLD_LIGHT = "#EBD4A4";
const CREAM = "#FCFAF4";
const INK = "#1A1A1A";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: GOLD, fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RecipeCard({ fields, previewLang }: RecipeCardProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const isBilingual = lang === "bilingual";
  const dir = isRtl ? "rtl" : "ltr";

  const {
    heroImage, title, subtitle, prepTime, cookTime, servings,
    ingredients, instructions, sections, badgeText, tagline,
    primaryColor = GOLD, backgroundColor = CREAM,
  } = fields;

  const accentColor = primaryColor;
  const accentLight = GOLD_LIGHT;

  return (
    <div
      className="template-root"
      dir={dir}
      style={{
        width: 794,
        minHeight: 1123,
        backgroundColor,
        fontFamily: isRtl
          ? "'Cairo', 'Segoe UI', Arial, sans-serif"
          : "'Inter', 'Segoe UI', Arial, sans-serif",
        color: INK,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          borderBottom: `2px solid ${accentColor}`,
          backgroundColor: CREAM,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: accentColor, fontSize: 18 }}>✦</span>
          <span
            style={{
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: "0.15em",
              color: accentColor,
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            }}
          >
            EGNITE
          </span>
        </div>
        <div style={{ fontSize: 10, color: "#888", textAlign: "end" }}>
          <span>egniteflavors.com</span>
        </div>
      </div>

      {/* ── Hero Image ─────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          height: 320,
          position: "relative",
          backgroundColor: "#e8e0d0",
          overflow: "hidden",
        }}
      >
        {heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt={t(title, lang)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          /* Branded placeholder — gold diagonal stripe pattern */
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `repeating-linear-gradient(45deg, ${accentLight}40 0, ${accentLight}40 10px, transparent 0, transparent 50%)`,
              backgroundSize: "20px 20px",
              backgroundColor: "#f0e8d8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 40, opacity: 0.35 }}>🍽️</span>
            <span style={{ fontSize: 11, color: accentColor, fontWeight: 700, opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Add Hero Image
            </span>
          </div>
        )}
        {/* Gold overlay bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(to right, ${accentColor}, ${accentLight}, ${accentColor})`,
          }}
        />
      </div>

      {/* ── Title Block ────────────────────────────────────────────────── */}
      <div style={{ padding: "18px 28px 10px", borderBottom: `1px solid ${accentLight}` }}>
        {/* Bilingual: show both */}
        {isBilingual ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: accentColor, margin: 0, letterSpacing: "-0.01em" }}>
                {title.en}
              </h1>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: accentColor,
                  margin: 0,
                  fontFamily: "'Cairo', sans-serif",
                  direction: "rtl",
                }}
              >
                {title.ar}
              </h1>
            </div>
            <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{subtitle.en}</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: accentColor, margin: 0, letterSpacing: "-0.01em" }}>
              {t(title, lang)}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>
                {t(subtitle, lang)}
              </p>
            )}
          </>
        )}

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 12,
            borderTop: `1px solid ${accentLight}`,
            borderBottom: `1px solid ${accentLight}`,
            padding: "8px 0",
          }}
        >
          <MetaItem label={isRtl ? "وقت التحضير" : "Prep Time"} value={prepTime} />
          <div style={{ width: 1, background: accentLight, margin: "0 4px" }} />
          <MetaItem label={isRtl ? "وقت الطهي" : "Cook Time"} value={cookTime} />
          <div style={{ width: 1, background: accentLight, margin: "0 4px" }} />
          <MetaItem label={isRtl ? "الكمية" : "Yield"} value={servings} />
        </div>
      </div>

      {/* ── Two-column body ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          flex: 1,
          padding: "16px 0",
          minHeight: 380,
        }}
      >
        {/* Left: Ingredients */}
        <div style={{ padding: "0 20px 0 28px" }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accentColor,
              marginBottom: 14,
              paddingBottom: 6,
              borderBottom: `1.5px solid ${accentLight}`,
            }}
          >
            {isRtl ? "المكونات" : "Ingredients"}
          </h2>
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}
            >
              <span style={{ fontSize: 20, lineHeight: 1, minWidth: 24, textAlign: "center" }}>
                {ing.icon}
              </span>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600 }}>
                  {isBilingual
                    ? `${ing.label.en} / ${ing.label.ar}`
                    : t(ing.label, lang)}
                </span>
                {ing.amount && (
                  <span style={{ color: "#666" }}>: {ing.amount}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ background: accentLight }} />

        {/* Right: Instructions */}
        <div style={{ padding: "0 28px 0 20px" }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accentColor,
              marginBottom: 14,
              paddingBottom: 6,
              borderBottom: `1.5px solid ${accentLight}`,
            }}
          >
            {isRtl ? "طريقة التحضير" : "Instructions"}
          </h2>
          {instructions.map((step, i) => (
            <div
              key={step.id}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}
            >
              {/* Step number circle */}
              <div
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.5,
                  margin: 0,
                  flex: 1,
                }}
              >
                {isBilingual
                  ? `${step.text.en} / ${step.text.ar}`
                  : t(step.text, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extra Sections ───────────────────────────────────────────────── */}
      {sections.length > 0 && (
        <div style={{ borderTop: `1px solid ${accentLight}`, margin: "0 28px", paddingTop: 12 }}>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: 14 }}>
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: accentColor,
                  marginBottom: 8,
                }}
              >
                {isBilingual
                  ? `${section.title.en} / ${section.title.ar}`
                  : t(section.title, lang)}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(section.items as Array<{ id: string; icon: string; label?: { en: string; ar: string }; text?: { en: string; ar: string }; amount?: string }>).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: accentLight + "60",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 11,
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>
                      {item.label
                        ? `${isBilingual ? `${item.label.en} / ${item.label.ar}` : t(item.label, lang)}${item.amount ? `: ${item.amount}` : ""}`
                        : item.text
                        ? isBilingual ? `${item.text.en} / ${item.text.ar}` : t(item.text, lang)
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
          backgroundColor: accentLight,
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${accentColor}`,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: accentColor === GOLD ? INK : accentColor }}>
          {isBilingual
            ? `${tagline.en} · ${tagline.ar}`
            : t(tagline, lang)}
        </span>

        {/* ENJOY EVERY BITE badge */}
        <div
          style={{
            background: accentColor,
            color: "white",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {isBilingual
            ? badgeText.en
            : t(badgeText, lang)}
        </div>
      </div>

      {/* Bilingual Arabic title overlay (if bilingual mode) is already handled above */}
    </div>
  );
}

// ─── Bilingual label helper for external use ─────────────────────────────────
export { t as resolveLocale, tAr as resolveAr };
