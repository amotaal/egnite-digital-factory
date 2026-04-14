/**
 * Infographic Card Template — A4 Landscape (1123 × 794px)
 *
 * Visual reference: sources/sample_infographic.{html,jpg} — gold + charcoal,
 * centered title flanked by hairline rules, gold-ringed numbered step circles,
 * subtle speckle background texture, three-column body (ingredients · hero +
 * dosage table · instructions), full-width charcoal footer with social.
 *
 * All colours, fonts, radii from `lib/design-tokens.ts` via the
 * `egnite-infographic` theme preset.
 */
import React from "react";
import type { ActiveLanguage, InfographicCardFields } from "@/lib/types";
import {
  FlankedTitle,
  FooterBar,
  PageRoot,
  SectionTitle,
  StepNumberCircle,
  fontFor,
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
  const stepVariant = theme.decorations.stepFill === "ring" ? "ring" : "fill";

  return (
    <PageRoot theme={theme} width={1123} height={794} isRtl={isRtl} fixedHeight>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ padding: `${theme.spacing.pageMarginY}px ${theme.spacing.pageMarginX}px ${theme.spacing.innerGap}px` }}>
        {theme.decorations.titleFlankingRule ? (
          <FlankedTitle text={pickLocale(fields.title, lang)} theme={theme} isRtl={isRtl} />
        ) : (
          <h1
            style={{
              ...typeStyle("displayHero", theme),
              color: theme.colors.accent,
              margin: 0,
              fontFamily: fontFor("display", theme, isRtl),
              textAlign: "center",
            }}
          >
            {pickLocale(fields.title, lang)}
          </h1>
        )}
        <p style={{ ...typeStyle("bodyLg", theme), color: theme.colors.ink, textAlign: "center", margin: "8px 0 0" }}>
          {isRtl ? "وقت التحضير" : "Preparation Time"}: {fields.prepTime}
        </p>
      </div>

      {/* ── Three-column body ───────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 1fr",
          gap: theme.spacing.sectionGap,
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px ${theme.spacing.blockGap}px`,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Ingredients */}
        <div>
          <SectionTitle text={isRtl ? "المكونات" : "Ingredients"} theme={theme} />
          {fields.ingredients.map((ing) => (
            <div
              key={ing.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 14,
                ...typeStyle("body", theme),
              }}
            >
              <div
                style={{
                  width: 44, height: 44,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                  background: theme.colors.accentSoft,
                  borderRadius: theme.radii.pill,
                }}
              >
                {ing.icon}
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>{pickLocale(ing.label, lang)}</span>
                {ing.amount && <span>: {ing.amount}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Center: Hero + Dosage */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: theme.spacing.blockGap }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: theme.radii.image,
              border: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
              overflow: "hidden",
              background: theme.colors.surfaceAlt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {fields.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fields.heroImage} alt={pickLocale(fields.title, lang)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div
                style={{
                  width: "100%", height: "100%",
                  background: `repeating-linear-gradient(45deg, ${theme.colors.accentSoft} 0 8px, transparent 8px 18px)`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6,
                }}
              >
                <span style={{ fontSize: 32, opacity: 0.45 }}>🍽️</span>
                <span style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent, opacity: 0.7 }}>Add Image</span>
              </div>
            )}
          </div>

          {/* Dosage table */}
          <div style={{ width: "100%", textAlign: "center" }}>
            <h3
              style={{
                ...typeStyle("sectionTitle", theme),
                color: theme.colors.ink,
                margin: "0 0 8px",
              }}
            >
              {isRtl ? "معلومات الجرعة" : "Dosage Information"}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
                borderRadius: theme.radii.card,
                overflow: "hidden",
                background: theme.colors.accentFill,
              }}
            >
              {[
                { header: isRtl ? "جوهر" : "Essence", row: fields.dosageEssence, isLast: false },
                { header: isRtl ? "إيمولشن" : "Emulsion", row: fields.dosageEmulsion, isLast: true },
              ].map((cell) => (
                <React.Fragment key={cell.header}>
                  <div
                    style={{
                      background: theme.colors.accentHeaderFill,
                      padding: 8,
                      ...typeStyle("eyebrow", theme),
                      color: theme.colors.ink,
                      borderBottom: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
                      ...(cell.isLast ? {} : { borderInlineEnd: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}` }),
                    }}
                  >
                    {cell.header}
                  </div>
                </React.Fragment>
              ))}
              {[fields.dosageEssence, fields.dosageEmulsion].map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "start",
                    ...typeStyle("body", theme),
                    ...(idx === 0 ? { borderInlineEnd: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}` } : {}),
                  }}
                >
                  <span style={{ fontSize: 22, width: 28, flexShrink: 0, textAlign: "center" }}>{row.icon}</span>
                  <div>
                    <div style={{ ...typeStyle("amount", theme) }}>{row.amount}</div>
                    <div style={{ ...typeStyle("caption", theme), color: theme.colors.inkMuted }}>
                      {isRtl ? "نطاق الجرعة" : "Dosage range"}<br />{row.range}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <SectionTitle text={isRtl ? "طريقة التحضير" : "Step-By-Step Instructions"} theme={theme} />
          {fields.instructions.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 52, height: 52,
                    border: `${theme.strokes.imageFrame}px solid ${theme.colors.accent}`,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: theme.colors.surface,
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
                  }}
                >
                  <StepNumberCircle n={i + 1} theme={theme} size={20} variant={stepVariant === "ring" ? "fill" : stepVariant} />
                </div>
              </div>
              <p style={{ ...typeStyle("body", theme), margin: 0, flex: 1 }}>{pickLocale(step.text, lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <FooterBar theme={theme} taglineText={pickLocale(fields.footerTagline, lang)} showSocial showWebsite />
    </PageRoot>
  );
}
