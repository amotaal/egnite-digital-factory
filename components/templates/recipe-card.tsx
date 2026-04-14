/**
 * Recipe Card Template — A4 Portrait (794 × 1123px)
 *
 * Visual target: sources/{creamy_pinwheel_cookies, lemon_cake, bubblegum_
 * fudgebites, coconut_madeleines, mixedberries_cake, wildberry_cupcakes,
 * coffeebean_cookies, hazelnut_chocolate_cookies}.png.
 *
 * Layout (top→bottom):
 *   1. Header row: egnite wordmark (left)  ·  Prep/Cook/Yield stacked (right).
 *   2. Title block: uppercase display title, italic subtitle.
 *   3. INGREDIENTS — plain bulleted list on the left + hero photo inline on
 *      the right (ingredients wrap around the hero).
 *   4. Optional side-note callout under the hero.
 *   5. INSTRUCTIONS — numbered two-column list spanning full page width.
 *   6. Optional extra sections (chip strip per section).
 *   7. Footer row: tagline left · ENJOY EVERY BITE stamp right, transparent.
 */
import React from "react";
import type { ActiveLanguage, RecipeCardFields } from "@/lib/types";
import {
  EnjoyStamp,
  MetaStack,
  PageRoot,
  SectionTitle,
  SideNote,
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
    heroImage,
    title,
    subtitle,
    prepTime,
    cookTime,
    servings,
    difficulty,
    ingredients,
    instructions,
    sections,
    tagline,
    sideNote,
  } = fields;

  // Split instructions into two equal columns.
  const mid = Math.ceil(instructions.length / 2);
  const colA = instructions.slice(0, mid);
  const colB = instructions.slice(mid);

  const metaItems = [
    { label: isRtl ? "التحضير" : "Prep Time", value: prepTime },
    { label: isRtl ? "الطهي" : "Cook Time", value: cookTime },
    { label: isRtl ? "الكمية" : "Yield", value: servings },
  ];
  if (difficulty) metaItems.push({ label: isRtl ? "المستوى" : "Level", value: difficulty });

  return (
    <PageRoot theme={theme} width={794} height={1123} isRtl={isRtl}>
      {/* 1 · Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: `24px ${theme.spacing.pageMarginX}px 14px`,
        }}
      >
        <Wordmark theme={theme} tone="ink" size={0.95} />
        <MetaStack items={metaItems} theme={theme} align="end" />
      </div>

      {/* 2 · Title ──────────────────────────────────────────────────────── */}
      <div style={{ padding: `0 ${theme.spacing.pageMarginX}px 8px` }}>
        <h1
          style={{
            ...typeStyle("displayTitle", theme),
            color: theme.colors.ink,
            margin: 0,
            fontFamily: fontFor("display", theme, isRtl),
            fontSize: 38,
            lineHeight: 1.02,
          }}
        >
          {pickLocale(title, lang)}
        </h1>
        {subtitle && (
          <p
            style={{
              ...typeStyle("body", theme),
              color: theme.colors.inkMuted,
              margin: "4px 0 0",
              fontStyle: "italic",
              fontSize: 12,
            }}
          >
            {pickLocale(subtitle, lang)}
          </p>
        )}
      </div>

      {/* 3 · Ingredients (left) + Hero inline (right) ───────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
          padding: `14px ${theme.spacing.pageMarginX}px 8px`,
          alignItems: "start",
        }}
      >
        <div>
          <SectionTitle text={isRtl ? "المكونات" : "Ingredients"} theme={theme} />
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              ...typeStyle("body", theme),
              fontSize: 12.5,
              lineHeight: 1.6,
            }}
          >
            {ingredients.map((ing) => (
              <li
                key={ing.id}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: theme.colors.accent,
                    fontWeight: 900,
                    fontSize: 16,
                    lineHeight: 1,
                    transform: "translateY(1px)",
                  }}
                >
                  •
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{pickLocale(ing.label, lang)}</span>
                  {ing.amount && (
                    <span style={{ color: theme.colors.inkMuted }}>: {ing.amount}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: 300,
              aspectRatio: "4 / 3",
              borderRadius: theme.radii.image,
              background: theme.colors.surfaceAlt,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadows.image,
            }}
          >
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={pickLocale(title, lang)}
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 6,
                  background: `repeating-linear-gradient(45deg, ${theme.colors.accentSoft} 0 10px, transparent 10px 22px)`,
                }}
              >
                <span style={{ fontSize: 32, opacity: 0.35 }}>📷</span>
                <span style={{ ...typeStyle("eyebrow", theme), color: theme.colors.accent, opacity: 0.7 }}>
                  {isRtl ? "أضف صورة" : "Add Hero Image"}
                </span>
              </div>
            )}
          </div>
          {sideNote && <SideNote text={pickLocale(sideNote, lang)} theme={theme} />}
        </div>
      </div>

      {/* 4 · Instructions — two columns, full width ─────────────────────── */}
      <div style={{ padding: `18px ${theme.spacing.pageMarginX}px 14px` }}>
        <SectionTitle text={isRtl ? "طريقة التحضير" : "Instructions"} theme={theme} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 24, rowGap: 10 }}>
          {[colA, colB].map((col, ci) => (
            <ol
              key={ci}
              start={ci === 0 ? 1 : mid + 1}
              style={{
                margin: 0,
                paddingInlineStart: 22,
                ...typeStyle("body", theme),
                fontSize: 12.5,
                lineHeight: 1.55,
              }}
            >
              {col.map((step) => (
                <li key={step.id} style={{ marginBottom: 8, paddingInlineStart: 4 }}>
                  <span>{pickLocale(step.text, lang)}</span>
                </li>
              ))}
            </ol>
          ))}
        </div>
      </div>

      {/* 5 · Extra sections — compact chips ─────────────────────────────── */}
      {sections.length > 0 && (
        <div
          style={{
            borderTop: `1px solid ${theme.colors.divider}`,
            margin: `0 ${theme.spacing.pageMarginX}px`,
            paddingTop: 10,
          }}
        >
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: 10 }}>
              <h3
                style={{
                  ...typeStyle("eyebrow", theme),
                  color: theme.colors.accent,
                  margin: "0 0 6px",
                  fontSize: 10,
                }}
              >
                {pickLocale(section.title, lang)}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(section.items as Array<{
                  id: string;
                  icon: string;
                  label?: { en: string; ar: string };
                  text?: { en: string; ar: string };
                  amount?: string;
                }>).map((item) => (
                  <span
                    key={item.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: theme.colors.accentSoft,
                      borderRadius: theme.radii.pill,
                      padding: "3px 10px",
                      ...typeStyle("caption", theme),
                      fontSize: 11,
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
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6 · Transparent footer: tagline + stamp ───────────────────────── */}
      <div
        style={{
          marginTop: "auto",
          padding: `14px ${theme.spacing.pageMarginX}px 20px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            ...typeStyle("caption", theme),
            color: theme.colors.inkMuted,
            fontSize: 10,
          }}
        >
          {pickLocale(tagline, lang)}
        </span>
        {theme.decorations.badgeStamp && <EnjoyStamp theme={theme} lang={lang} />}
      </div>
    </PageRoot>
  );
}

export const resolveLocale = pickLocale;
