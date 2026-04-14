/**
 * Built-in TemplateSpec definitions for the four document types that ship
 * with the Egnite Digital Factory. Each spec mirrors its reference artefact
 * in `sources/` (sample_infographic.html and the sample PNG recipe cards).
 *
 * These are plain data — importing a user-authored JSON spec uses the exact
 * same shape and goes through the same renderer. To add a new template type,
 * drop a new TemplateSpec object here and register it in `TEMPLATE_SPECS`.
 */

import type { TemplateSpec } from "../template-spec";
import { PAGE } from "../design-tokens";

// ─── Recipe Card — A4 Portrait, two-column body ───────────────────────────────
// Matches the recipe-card sample PNGs in sources/ (creamy_pinwheel_cookies.png,
// coconut_madeleines.png, lemon_cake.png, etc.).

export const RECIPE_CARD_SPEC: TemplateSpec = {
  id: "recipe-card",
  name: { en: "Recipe Card", ar: "بطاقة وصفة" },
  description: {
    en: "A4 portrait card with hero image, prep meta, ingredients, step-by-step instructions, and optional sub-sections. Perfect for baked goods, desserts, and confections.",
    ar: "بطاقة A4 عمودية بصورة رئيسية ومكونات وتعليمات خطوة بخطوة وأقسام اختيارية. مثالية للمخبوزات والحلويات.",
  },
  page: { ...PAGE.a4Portrait, format: "A4", outerBorder: true },
  defaultThemeId: "egnite-recipe-card",
  regions: [
    {
      type: "header",
      variant: "wordmark-split",
      showSparkle: true,
      showWebsite: true,
      rule: "bold",
      fill: "surface",
    },
    {
      type: "hero",
      aspectRatio: null,
      height: 320,
      frame: "none",
      corner: "none",
      stripeBelow: true,
      placement: "full-bleed",
    },
    {
      type: "title",
      variant: "stacked",
      eyebrow: null,
      showSubtitle: true,
      align: "start",
      size: "h1",
      showMetaRow: true,
      metaItems: ["prepTime", "cookTime", "servings"],
    },
    {
      type: "body",
      direction: "row",
      columns: [
        { kind: "ingredients", weight: 1, source: "ingredients", bulletStyle: "icon-only", trailingDivider: true },
        { kind: "instructions", weight: 1, source: "instructions", bulletStyle: "numbered-circle" },
      ],
    },
    { type: "extra-sections", source: "sections", layout: "chips" },
    {
      type: "footer",
      variant: "tagline-badge",
      fill: "accent-soft",
      showSocial: false,
      showWebsite: false,
      showBadge: true,
    },
  ],
};

// ─── Infographic Card — A4 Landscape, three-column ───────────────────────────
// Pixel-matches sources/sample_infographic.html.

export const INFOGRAPHIC_CARD_SPEC: TemplateSpec = {
  id: "infographic-card",
  name: { en: "Infographic Card", ar: "بطاقة إنفوغرافيك" },
  description: {
    en: "A4 landscape card with three-column layout: ingredients with icons, hero image with dosage table, and step-by-step instructions. Great for biscuit fillings, frostings, and confectionery.",
    ar: "بطاقة A4 أفقية بتخطيط ثلاثة أعمدة: مكونات بأيقونات، صورة رئيسية مع جدول الجرعة، وتعليمات. مثالية لحشوات البسكويت والفروستنج.",
  },
  page: { ...PAGE.a4Landscape, format: "A4", outerBorder: true },
  defaultThemeId: "egnite-infographic",
  regions: [
    {
      type: "title",
      variant: "eyebrow-title",
      eyebrow: null,
      showSubtitle: false,
      align: "center",
      size: "hero",
      showMetaRow: true,
      metaItems: ["prepTime"],
    },
    {
      type: "body",
      direction: "row",
      gap: 30,
      columns: [
        {
          kind: "ingredients",
          weight: 1,
          source: "ingredients",
          bulletStyle: "emoji-ring",
          sectionTitle: { en: "Ingredients", ar: "المكونات" },
        },
        {
          kind: "hero-and-dosage",
          weight: 1.5,
        },
        {
          kind: "instructions",
          weight: 1,
          source: "instructions",
          bulletStyle: "numbered-circle",
          sectionTitle: { en: "Step-By-Step Instructions", ar: "طريقة التحضير" },
        },
      ],
    },
    {
      type: "footer",
      variant: "tagline-logo-social",
      fill: "accent-soft",
      showSocial: true,
      showWebsite: true,
      showBadge: false,
    },
  ],
};

// ─── Beverage Card — A4 Landscape, dark header + 2-col body ──────────────────

export const BEVERAGE_CARD_SPEC: TemplateSpec = {
  id: "beverage-card",
  name: { en: "Beverage Guide", ar: "دليل المشروبات" },
  description: {
    en: "A4 landscape card with dark header, ingredients table, dosage box, and horizontal preparation steps. Ideal for carbonated drinks, syrups, and specialty beverages.",
    ar: "بطاقة A4 أفقية بترويسة داكنة وجدول مكونات وجرعات وخطوات تحضير أفقية. مثالية للمشروبات الغازية والشراب.",
  },
  page: { ...PAGE.a4Landscape, format: "A4", outerBorder: true },
  defaultThemeId: "egnite-beverage-card",
  regions: [
    {
      type: "header",
      variant: "banner",
      showSparkle: true,
      showWebsite: false,
      rule: "bold",
      fill: "ink",
    },
    {
      type: "title",
      variant: "stacked",
      eyebrow: null,
      showSubtitle: true,
      align: "start",
      size: "h1",
      showMetaRow: false,
      metaItems: [],
    },
    {
      type: "body",
      direction: "row",
      columns: [
        { kind: "ingredients", weight: 1, source: "ingredients", bulletStyle: "icon-only", trailingDivider: true },
        { kind: "steps-horizontal", weight: 1, source: "steps", bulletStyle: "numbered-circle" },
      ],
    },
    { type: "dosage", variant: "single", showHeader: true, headerLabel: { en: "Dosage", ar: "الجرعة" } },
    { type: "callout", tone: "dark", source: "storageNote", label: { en: "Storage", ar: "التخزين" } },
    {
      type: "footer",
      variant: "tagline-logo-social",
      fill: "accent-soft",
      showSocial: false,
      showWebsite: true,
      showBadge: false,
    },
  ],
};

// ─── Extended Recipe — A4 Portrait, hero + body + full-width extras ──────────

export const EXTENDED_RECIPE_SPEC: TemplateSpec = {
  id: "extended-recipe",
  name: { en: "Extended Recipe", ar: "وصفة موسّعة" },
  description: {
    en: "A4 portrait with a larger hero, full-width section blocks for sub-recipes (coating, frosting, filling), and a bold colour-bar header. Great for multi-component confections.",
    ar: "بطاقة A4 عمودية بصورة رئيسية أكبر وأقسام كاملة العرض للوصفات الفرعية (طبقات، حشوات). مثالية للحلويات متعددة المكونات.",
  },
  page: { ...PAGE.a4Portrait, format: "A4", outerBorder: true },
  defaultThemeId: "egnite-extended-recipe",
  regions: [
    {
      type: "header",
      variant: "banner",
      showSparkle: true,
      showWebsite: true,
      rule: "none",
      fill: "accent",
    },
    {
      type: "hero",
      aspectRatio: null,
      height: 260,
      frame: "none",
      corner: "none",
      stripeAbove: true,
      stripeBelow: true,
      placement: "full-bleed",
    },
    {
      type: "title",
      variant: "stacked",
      eyebrow: null,
      showSubtitle: true,
      align: "start",
      size: "h1",
      showMetaRow: true,
      metaItems: ["prepTime", "cookTime", "servings", "difficulty"],
    },
    {
      type: "body",
      direction: "row",
      columns: [
        { kind: "ingredients", weight: 1, source: "ingredients", bulletStyle: "icon-only", trailingDivider: true },
        { kind: "instructions", weight: 1, source: "instructions", bulletStyle: "numbered-circle" },
      ],
    },
    { type: "extra-sections", source: "sections", layout: "two-col" },
    {
      type: "footer",
      variant: "tagline-badge",
      fill: "accent",
      showSocial: false,
      showWebsite: false,
      showBadge: true,
    },
  ],
};

// ─── Registry ────────────────────────────────────────────────────────────────

export const TEMPLATE_SPECS: readonly TemplateSpec[] = [
  RECIPE_CARD_SPEC,
  INFOGRAPHIC_CARD_SPEC,
  BEVERAGE_CARD_SPEC,
  EXTENDED_RECIPE_SPEC,
];

export function getTemplateSpec(id: string): TemplateSpec | undefined {
  return TEMPLATE_SPECS.find((s) => s.id === id);
}
