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

export type ExportFormat = "png" | "pdf" | "html";

// ─── Content Primitives ──────────────────────────────────────────────────────

export interface IngredientItem {
  id: string;
  icon: string;       // emoji or image URL
  label: LocaleString; // e.g. "Butter" / "زبدة"
  amount: string;     // e.g. "100g (1 stick)"
}

export interface InstructionStep {
  id: string;
  icon: string;
  text: LocaleString;
}

export interface DocumentSection {
  id: string;
  title: LocaleString;
  type: "ingredients" | "instructions";
  items: IngredientItem[] | InstructionStep[];
}

export interface DosageRow {
  icon: string;
  amount: string;     // e.g. "1.25g (¼ tsp)"
  range: string;      // e.g. "0.25% – 0.30%"
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

  // Meta row
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;

  // Body
  ingredients: IngredientItem[];
  instructions: InstructionStep[];

  // Optional extra sections (chocolate coating, frosting, etc.)
  sections: DocumentSection[];

  // Footer
  badgeText: LocaleString;
  tagline: LocaleString;

  // Products / essences used (for display purposes)
  products: string[];

  // Theme overrides
  primaryColor: string;
  backgroundColor: string;
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
}

export interface BeverageCardFields {
  language: ActiveLanguage;

  title: LocaleString;
  subtitle: LocaleString;
  heroImage: string;

  ingredients: IngredientItem[];
  dosage: DosageRow;

  steps: InstructionStep[];
  storageNote: LocaleString;

  footerTagline: LocaleString;
  primaryColor: string;
  backgroundColor: string;
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
  thumbnail?: string;   // path to a PNG preview snapshot
  createdAt: string;    // ISO date string
  updatedAt: string;
  createdBy: string;    // user id
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
  /** URL to the full asset (image file or remote URL) */
  url: string;
  /** Optional shorthand icon/emoji used inline in templates */
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
  heroImage: string;   // path under /samples/
  ingredients: IngredientItem[];
  instructions: InstructionStep[];
  sections: DocumentSection[];
}
