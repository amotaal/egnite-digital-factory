/**
 * Extended Recipe Template — A4 Portrait (794 × 1123px)
 *
 * Visual target: sources/strawberry_shortcake_2_pages.png (editorial spread).
 *
 * Layout (top → bottom):
 *   · Accent header bar with wordmark + website.
 *   · Optional accent-stripe framed hero.
 *   · Title block with hairline meta row (Prep · Cook · Yield · Level).
 *   · Ingredients (left) + Instructions (right) two-column split.
 *   · Sub-recipe blocks — each with an accent header strip, icon-prefixed
 *     ingredient rows, and numbered step rows (NO chip strips).
 *   · Accent footer band with tagline + "ENJOY EVERY BITE" stamp.
 */
import React from "react";
import type {
  ActiveLanguage,
  DocumentSection,
  IngredientItem,
  InstructionStep,
  RecipeCardFields,
} from "@/lib/types";
import {
  EnjoyStamp,
  PageRoot,
  SectionTitle,
  StepNumberCircle,
  Wordmark,
  fontFor,
  pickLocale,
  resolveDocumentTheme,
  typeStyle,
} from "./_shared";

interface ExtendedRecipeProps {
  fields: RecipeCardFields;
  previewLang?: ActiveLanguage;
}

function isInstructionStep(x: unknown): x is InstructionStep {
  return !!x && typeof x === "object" && "text" in (x as Record<string, unknown>);
}

function isIngredient(x: unknown): x is IngredientItem {
  return !!x && typeof x === "object" && "label" in (x as Record<string, unknown>);
}

export function ExtendedRecipe({ fields, previewLang }: ExtendedRecipeProps) {
  const lang = previewLang ?? fields.language;
  const isRtl = lang === "ar";
  const theme = resolveDocumentTheme("egnite-extended-recipe", fields);

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
  } = fields;

  const stepVariant = theme.decorations.stepFill === "ring" ? "ring" : "fill";

  return (
    <PageRoot theme={theme} width={794} height={1123} isRtl={isRtl}>
      {/* ── Accent header bar ───────────────────────────────────────────── */}
      <div
        style={{
          background: theme.colors.accent,
          color: theme.colors.onAccent,
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Wordmark theme={theme} tone="onDark" size={1} />
        <span
          style={{
            ...typeStyle("caption", theme),
            color: theme.colors.onAccent,
            opacity: 0.9,
            fontSize: 11,
          }}
        >
          egniteflavors.com
        </span>
      </div>

      {/* ── Hero with optional accent stripes ───────────────────────────── */}
      {theme.decorations.heroTopStripe && (
        <div style={{ height: 4, background: theme.colors.accent }} />
      )}
      <div
        style={{
          width: "100%",
          height: 280,
          position: "relative",
          background: theme.colors.surfaceAlt,
          overflow: "hidden",
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
              background: `repeating-linear-gradient(45deg, ${theme.colors.accentSoft} 0 10px, transparent 10px 22px)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 36, opacity: 0.4 }}>🍽️</span>
            <span
              style={{
                ...typeStyle("eyebrow", theme),
                color: theme.colors.accent,
                opacity: 0.7,
              }}
            >
              {isRtl ? "أضف صورة" : "Add Hero Image"}
            </span>
          </div>
        )}
      </div>
      {theme.decorations.heroBottomStripe && (
        <div style={{ height: 4, background: theme.colors.accent }} />
      )}

      {/* ── Title + meta row ────────────────────────────────────────────── */}
      <div
        style={{
          padding: `${theme.spacing.blockGap}px ${theme.spacing.pageMarginX}px ${theme.spacing.innerGap}px`,
        }}
      >
        <h1
          style={{
            ...typeStyle("displayTitle", theme),
            color: theme.colors.ink,
            margin: 0,
            fontFamily: fontFor("display", theme, isRtl),
            fontSize: 36,
            lineHeight: 1.04,
          }}
        >
          {pickLocale(title, lang)}
        </h1>
        {subtitle && (
          <p
            style={{
              ...typeStyle("body", theme),
              color: theme.colors.inkMuted,
              margin: "6px 0 0",
              fontStyle: "italic",
              fontSize: 12.5,
            }}
          >
            {pickLocale(subtitle, lang)}
          </p>
        )}
        <div
          style={{
            display: "flex",
            marginTop: theme.spacing.innerGap,
            borderTop: `1px solid ${theme.colors.divider}`,
            borderBottom: `1px solid ${theme.colors.divider}`,
            padding: "8px 0",
          }}
        >
          {[
            { label: isRtl ? "التحضير" : "Prep", value: prepTime },
            { label: isRtl ? "الطهي" : "Cook", value: cookTime },
            { label: isRtl ? "الكمية" : "Yield", value: servings },
            { label: isRtl ? "الصعوبة" : "Level", value: difficulty },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    ...typeStyle("eyebrow", theme),
                    color: theme.colors.accent,
                    fontSize: 9.5,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    ...typeStyle("bodyStrong", theme),
                    color: theme.colors.ink,
                    marginTop: 2,
                    fontSize: 12,
                  }}
                >
                  {value}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    width: 1,
                    background: theme.colors.divider,
                    margin: "0 6px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Two-column core ingredients + instructions ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          padding: `${theme.spacing.innerGap}px 0`,
        }}
      >
        <div
          style={{
            padding: `0 ${theme.spacing.blockGap}px 0 ${theme.spacing.pageMarginX}px`,
          }}
        >
          <SectionTitle
            text={isRtl ? "المكونات" : "Ingredients"}
            theme={theme}
          />
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  lineHeight: 1.2,
                  minWidth: 22,
                  textAlign: "center",
                }}
              >
                {ing.icon}
              </span>
              <div
                style={{
                  flex: 1,
                  ...typeStyle("body", theme),
                  fontSize: 12,
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {pickLocale(ing.label, lang)}
                </span>
                {ing.amount && (
                  <span style={{ color: theme.colors.inkMuted }}>
                    : {ing.amount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: theme.colors.divider }} />

        <div
          style={{
            padding: `0 ${theme.spacing.pageMarginX}px 0 ${theme.spacing.blockGap}px`,
          }}
        >
          <SectionTitle
            text={isRtl ? "طريقة التحضير" : "Instructions"}
            theme={theme}
          />
          {instructions.map((step, i) => (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
                marginBottom: 10,
              }}
            >
              <StepNumberCircle
                n={i + 1}
                theme={theme}
                size={22}
                variant={stepVariant}
              />
              <p
                style={{
                  ...typeStyle("body", theme),
                  margin: 0,
                  flex: 1,
                  fontSize: 12,
                }}
              >
                {pickLocale(step.text, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sub-recipe full blocks ──────────────────────────────────────── */}
      {sections.length > 0 && (
        <div
          style={{
            padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px 0`,
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.blockGap,
          }}
        >
          {sections.map((section) => (
            <SubRecipeBlock
              key={section.id}
              section={section}
              theme={theme}
              lang={lang}
              stepVariant={stepVariant}
              isRtl={isRtl}
            />
          ))}
        </div>
      )}

      {/* ── Accent footer ───────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "auto",
          background: theme.colors.accent,
          color: theme.colors.onAccent,
          padding: `${theme.spacing.innerGap}px ${theme.spacing.pageMarginX}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            ...typeStyle("cta", theme),
            color: theme.colors.onAccent,
            opacity: 0.95,
            fontStyle: "italic",
          }}
        >
          {pickLocale(tagline, lang)}
        </span>
        {theme.decorations.badgeStamp && <EnjoyStamp theme={theme} lang={lang} />}
      </div>
    </PageRoot>
  );
}

// ─── Sub-recipe block ────────────────────────────────────────────────────────

function SubRecipeBlock({
  section,
  theme,
  lang,
  stepVariant,
  isRtl,
}: {
  section: DocumentSection;
  theme: ReturnType<typeof resolveDocumentTheme>;
  lang: ActiveLanguage;
  stepVariant: "fill" | "ring";
  isRtl: boolean;
}) {
  // Split the section's items into ingredients vs steps. If the section
  // carries explicit `.steps`, we use them directly.
  const rawItems = section.items as Array<IngredientItem | InstructionStep>;
  const itemIngredients = rawItems.filter(isIngredient);
  const inlineSteps = rawItems.filter(isInstructionStep);
  const steps = section.steps && section.steps.length > 0 ? section.steps : inlineSteps;

  return (
    <div
      style={{
        border: `1px solid ${theme.colors.divider}`,
        borderRadius: theme.radii.card,
        overflow: "hidden",
        background: theme.colors.surface,
      }}
    >
      {/* Accent header strip */}
      <div
        style={{
          background: theme.colors.accent,
          color: theme.colors.onAccent,
          padding: "8px 14px",
          ...typeStyle("eyebrow", theme),
          fontSize: 11,
          letterSpacing: 2,
        }}
      >
        {pickLocale(section.title, lang)}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            itemIngredients.length > 0 && steps.length > 0 ? "1fr 1px 1fr" : "1fr",
          padding: "12px 14px",
          gap: 0,
        }}
      >
        {itemIngredients.length > 0 && (
          <div style={{ paddingInlineEnd: steps.length > 0 ? 14 : 0 }}>
            <div
              style={{
                ...typeStyle("eyebrow", theme),
                color: theme.colors.accent,
                fontSize: 9.5,
                marginBottom: 6,
              }}
            >
              {isRtl ? "المكونات" : "Ingredients"}
            </div>
            {itemIngredients.map((ing) => (
              <div
                key={ing.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 6,
                  ...typeStyle("body", theme),
                  fontSize: 11.5,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: 1.2,
                    minWidth: 20,
                    textAlign: "center",
                  }}
                >
                  {ing.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>
                    {pickLocale(ing.label, lang)}
                  </span>
                  {ing.amount && (
                    <span style={{ color: theme.colors.inkMuted }}>
                      : {ing.amount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {itemIngredients.length > 0 && steps.length > 0 && (
          <div style={{ background: theme.colors.divider }} />
        )}

        {steps.length > 0 && (
          <div style={{ paddingInlineStart: itemIngredients.length > 0 ? 14 : 0 }}>
            <div
              style={{
                ...typeStyle("eyebrow", theme),
                color: theme.colors.accent,
                fontSize: 9.5,
                marginBottom: 6,
              }}
            >
              {isRtl ? "طريقة التحضير" : "Instructions"}
            </div>
            {steps.map((step, i) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <StepNumberCircle
                  n={i + 1}
                  theme={theme}
                  size={20}
                  variant={stepVariant}
                />
                <p
                  style={{
                    ...typeStyle("body", theme),
                    margin: 0,
                    flex: 1,
                    fontSize: 11.5,
                  }}
                >
                  {pickLocale(step.text, lang)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
