/**
 * Extended Recipe Template — A4 Portrait (794 × 1123px)
 * Richer layout: taller hero, full-width sections, multi-column section items.
 * Uses the same RecipeCardFields as the standard recipe card.
 */
import React from "react";
import type { RecipeCardFields, ActiveLanguage } from "@/lib/types";

interface ExtendedRecipeProps {
  fields: RecipeCardFields;
  previewLang?: ActiveLanguage;
}

const GOLD = "#B78D4B";
const GOLD_LIGHT = "#EBD4A4";
const CREAM = "#FCFAF4";
const INK = "#1A1A1A";

function t(val: { en: string; ar: string }, lang: ActiveLanguage): string {
  if (lang === "ar") return val.ar;
  return val.en;
}

export function ExtendedRecipe({ fields, previewLang }: ExtendedRecipeProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const isBilingual = lang === "bilingual";
  const dir = isRtl ? "rtl" : "ltr";

  const {
    heroImage, title, subtitle, prepTime, cookTime, servings, difficulty,
    ingredients, instructions, sections, badgeText, tagline,
    primaryColor = GOLD, backgroundColor = CREAM,
  } = fields;

  const accent = primaryColor;
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
          backgroundColor: accent,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "white", fontSize: 18 }}>✦</span>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "0.15em", color: "white", fontFamily: "'Inter', sans-serif" }}>
            EGNITE
          </span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>egniteflavors.com</span>
      </div>

      {/* ── Hero Image ─────────────────────────────────────────────────── */}
      <div style={{ width: "100%", height: 260, position: "relative", overflow: "hidden", backgroundColor: "#e8e0d0" }}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt={t(title, lang)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `repeating-linear-gradient(45deg, ${accentLight}40 0, ${accentLight}40 10px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
            backgroundColor: "#f0e8d8",
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8,
          }}>
            <span style={{ fontSize: 40, opacity: 0.35 }}>🍽️</span>
            <span style={{ fontSize: 11, color: accent, fontWeight: 700, opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Add Hero Image</span>
          </div>
        )}
        {/* Gold bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${accent}, ${accentLight}, ${accent})` }} />
      </div>

      {/* ── Title Block ────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 28px 12px", borderBottom: `1px solid ${accentLight}` }}>
        {isBilingual ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: accent, margin: 0 }}>{title.en}</h1>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: accent, margin: 0, fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>{title.ar}</h1>
          </div>
        ) : (
          <h1 style={{ fontSize: 28, fontWeight: 900, color: accent, margin: 0 }}>{t(title, lang)}</h1>
        )}
        {subtitle && (
          <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>
            {isBilingual ? `${subtitle.en}  ·  ${subtitle.ar}` : t(subtitle, lang)}
          </p>
        )}
        {/* Meta row */}
        <div style={{ display: "flex", gap: 0, marginTop: 10, borderTop: `1px solid ${accentLight}`, borderBottom: `1px solid ${accentLight}`, padding: "7px 0" }}>
          {[
            { label: isRtl ? "التحضير" : "Prep", value: prepTime },
            { label: isRtl ? "الطهي" : "Cook", value: cookTime },
            { label: isRtl ? "الكمية" : "Yield", value: servings },
            { label: isRtl ? "الصعوبة" : "Level", value: difficulty },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: INK, marginTop: 2 }}>{value}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, background: accentLight, margin: "0 4px" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Main Body: Ingredients + Instructions ──────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", padding: "14px 0", minHeight: 240 }}>
        {/* Left: Ingredients */}
        <div style={{ padding: "0 18px 0 28px" }}>
          <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: accent, marginBottom: 12, paddingBottom: 5, borderBottom: `1.5px solid ${accentLight}` }}>
            {isRtl ? "المكونات" : "Ingredients"}
          </h2>
          {ingredients.map((ing) => (
            <div key={ing.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 17, lineHeight: 1, minWidth: 22, textAlign: "center" }}>{ing.icon}</span>
              <div style={{ flex: 1, fontSize: 11, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600 }}>
                  {isBilingual ? `${ing.label.en} / ${ing.label.ar}` : t(ing.label, lang)}
                </span>
                {ing.amount && <span style={{ color: "#666" }}>: {ing.amount}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ background: accentLight }} />

        {/* Right: Instructions */}
        <div style={{ padding: "0 28px 0 18px" }}>
          <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: accent, marginBottom: 12, paddingBottom: 5, borderBottom: `1.5px solid ${accentLight}` }}>
            {isRtl ? "طريقة التحضير" : "Instructions"}
          </h2>
          {instructions.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ minWidth: 20, height: 20, borderRadius: "50%", backgroundColor: accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, marginTop: 1, flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.5, margin: 0, flex: 1 }}>
                {isBilingual ? `${step.text.en} / ${step.text.ar}` : t(step.text, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extra Sections — full-width with dividers ───────────────────── */}
      {sections.length > 0 && (
        <div style={{ borderTop: `2px solid ${accentLight}`, padding: "12px 28px 0" }}>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, marginBottom: 10, paddingBottom: 5, borderBottom: `1px solid ${accentLight}` }}>
                {isBilingual ? `${section.title.en}  ·  ${section.title.ar}` : t(section.title, lang)}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(section.items as Array<{ id: string; icon: string; label?: { en: string; ar: string }; text?: { en: string; ar: string }; amount?: string }>).map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, background: accentLight + "55", borderRadius: 6, padding: "4px 10px", fontSize: 11 }}>
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
          backgroundColor: accent,
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
          {isBilingual ? `${tagline.en}  ·  ${tagline.ar}` : t(tagline, lang)}
        </span>
        <div style={{ background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 20, padding: "5px 16px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {isBilingual ? badgeText.en : t(badgeText, lang)}
        </div>
      </div>
    </div>
  );
}
