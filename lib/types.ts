// ─── Locale & Direction ──────────────────────────────────────────────────────

export type LanguageCode = "en" | "ar";
export type ActiveLanguage = "en" | "ar" | "bilingual";
export type Direction = "ltr" | "rtl";

/** A field that holds both English and Arabic text */
export interface LocaleString {
  en: string;
  ar: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "editor";

export interface User {
  id: string;
  username: string;
  name: LocaleString;
  role: UserRole;
}

// ─── Template Types ──────────────────────────────────────────────────────────

export type TemplateType =
  | "recipe-card"
  | "infographic-card"
  | "beverage-card"
  | "extended-recipe";

export type ExportFormat = "png" | "pdf" | "html" | "json";

// ─── Theme override (re-exported here for convenience) ───────────────────────
export type DocumentThemeOverride = {
  colors?: Record<string, string>;
  typography?: Record<string, string | number>;
  spacing?: Record<string, number>;
  radii?: Record<string, number>;
  strokes?: Record<string, number>;
  shadows?: Record<string, string>;
  decorations?: Record<string, string | boolean>;
};

// ─── Content Primitives ──────────────────────────────────────────────────────

export interface IngredientItem {
  id: string;
  /** Emoji or asset-URL, rendered flat (no pill background). */
  icon: string;
  label: LocaleString;
  /** Free-form amount — e.g. "100g", "1 stick (100g)". */
  amount: string;
  /** Optional separated numeric + unit, used by the 4-col beverage table. */
  quantity?: string;
  weight?: string;
}

export interface InstructionStep {
  id: string;
  icon: string;
  text: LocaleString;
}

/**
 * An extra section shown after the main recipe. Used by Recipe Card (compact
 * inline chips) and by Extended Recipe (full sub-recipe block with header
 * strip + ingredients + numbered steps).
 */
export interface DocumentSection {
  id: string;
  title: LocaleString;
  type: "ingredients" | "instructions" | "sub-recipe";
  items: IngredientItem[] | InstructionStep[];
  /** For type === "sub-recipe": optional numbered steps rendered below items. */
  steps?: InstructionStep[];
}

export interface DosageRow {
  icon: string;
  amount: string;     // "1.25g (¼ tsp)"
  range: string;      // "0.25% – 0.30%"
}

/**
 * Tri-cell dosage block (Carbonated beverage sample). Each cell has a short
 * label and a value. The labels are bilingual so RTL users still see
 * "Starting Dose" / "جرعة الانطلاق".
 */
export interface DosageCell {
  label: LocaleString;
  value: string;
  icon?: string;
}

// ─── Template Field Shapes ───────────────────────────────────────────────────

export interface RecipeCardFields {
  language: ActiveLanguage;

  // Header
  logoText: string;

  // Hero
  heroImage: string;

  // Title block
  title: LocaleString;
  subtitle: LocaleString;

  // Meta row — stacked in header-right on recipe card
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;

  // Body
  ingredients: IngredientItem[];
  instructions: InstructionStep[];

  // Optional side-callout (handwritten-style tip quote near the hero)
  sideNote?: LocaleString;

  // Optional extra sections (chocolate coating, frosting, etc.)
  sections: DocumentSection[];

  // Footer
  badgeText: LocaleString;
  tagline: LocaleString;

  // Products / essences used
  products: string[];

  // Legacy colour overrides (deprecated — use themeOverride)
  primaryColor: string;
  backgroundColor: string;

  themeId?: string;
  themeOverride?: DocumentThemeOverride;
}

export interface InfographicCardFields {
  language: ActiveLanguage;

  title: LocaleString;
  prepTime: string;
  heroImage: string;

  ingredients: IngredientItem[];
  dosageEssence: DosageRow;
  dosageEmulsion: DosageRow;

  instructions: InstructionStep[];

  footerTagline: LocaleString;
  primaryColor: string;
  backgroundColor: string;

  themeId?: string;
  themeOverride?: DocumentThemeOverride;
}

export interface BeverageCardFields {
  language: ActiveLanguage;

  /** The uppercase pill label sitting centered in the dark top banner. */
  headerPill: LocaleString;
  title: LocaleString;
  subtitle: LocaleString;
  heroImage: string;

  /** 4-column table (Icon · Item · Quantity · Weight). */
  ingredients: IngredientItem[];

  /** Single-value fallback (kept for simple beverages). */
  dosage: DosageRow;
  /** Extended tri-cell dosage block (Carbonated sample). */
  dosageStarting?: DosageCell;
  dosageQuick?: DosageCell;
  dosageRange?: DosageCell;

  steps: InstructionStep[];
  storageNote: LocaleString;

  footerTagline: LocaleString;
  primaryColor: string;
  backgroundColor: string;

  themeId?: string;
  themeOverride?: DocumentThemeOverride;
}

export type DocumentFields =
  | RecipeCardFields
  | InfographicCardFields
  | BeverageCardFields;

// ─── Document ────────────────────────────────────────────────────────────────

export interface FactoryDocument {
  id: string;
  name: string;
  templateType: TemplateType;
  fields: DocumentFields;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ─── Template Definition ─────────────────────────────────────────────────────

export interface TemplateDimensions {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  format: "A4" | "custom";
}

export interface TemplateDefinition {
  id: TemplateType;
  name: LocaleString;
  description: LocaleString;
  thumbnail: string;
  dimensions: TemplateDimensions;
  defaultFields: DocumentFields;
}

// ─── Essences ─────────────────────────────────────────────────────────────────

export interface Essence {
  id: number;
  flavor: string;
  description: string;
  category: EssenceCategory;
}

export type EssenceCategory =
  | "Fruits"
  | "Chocolates"
  | "Creams"
  | "Desserts"
  | "Beverages"
  | "Sweets"
  | "Herbs & Nuts"
  | "Tobacco"
  | "Enhancers";

// ─── Assets (Digital Asset Management) ────────────────────────────────────────

export type AssetCategory = "image" | "icon" | "pattern" | "logo" | "other";

export interface Asset {
  id: string;
  name: LocaleString;
  category: AssetCategory;
  tags: string[];
  url: string;
  icon?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ─── Recipes (source data) ────────────────────────────────────────────────────

export interface RecipeSource {
  id: number;
  name: string;
  nameAr: string;
  products: string[];
  description: string;
  descriptionAr: string;
  difficulty: "Easy" | "Medium" | "Hard";
  lesson: string;
  attributes: string[];
  heroImage: string;
  ingredients: IngredientItem[];
  instructions: InstructionStep[];
  sections: DocumentSection[];
}
