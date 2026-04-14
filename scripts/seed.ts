/**
 * Seed script — creates one showcase document per template (recipe-card,
 * infographic-card, beverage-card, extended-recipe), plus a Recipe Card for
 * every recipe in `lib/data/recipes.ts`. Every document is stamped with the
 * correct `themeId` so the renderer resolves the right preset.
 *
 * Run with: `pnpm seed`
 *
 * Flags:
 *   --force    Overwrite existing documents (default: skip by name).
 *   --reset    Delete every existing document under /data/documents before
 *              seeding (green-field test mode).
 *
 * Also populates `/data/assets.json` with shared ingredient icons.
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { RECIPES } from "../lib/data/recipes";
import { TEMPLATES, TEMPLATE_THEME_ID } from "../lib/data/templates";
import type {
  Asset,
  BeverageCardFields,
  FactoryDocument,
  InfographicCardFields,
  RecipeCardFields,
} from "../lib/types";

const args = new Set(process.argv.slice(2));
const FORCE = args.has("--force");
const RESET = args.has("--reset");

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DOCS_DIR = path.join(DATA_DIR, "documents");
const ASSETS_INDEX = path.join(DATA_DIR, "assets.json");

// ─── Default asset library ───────────────────────────────────────────────────
const DEFAULT_ASSETS: Omit<Asset, "id" | "createdAt" | "updatedAt" | "createdBy">[] = [
  { name: { en: "Butter", ar: "زبدة" }, category: "icon", icon: "🧈", url: "", tags: ["dairy", "baking", "fat"] },
  { name: { en: "Sugar", ar: "سكر" }, category: "icon", icon: "🍚", url: "", tags: ["sweet", "baking", "powder"] },
  { name: { en: "Flour", ar: "دقيق" }, category: "icon", icon: "🌾", url: "", tags: ["baking", "grain"] },
  { name: { en: "Eggs", ar: "بيض" }, category: "icon", icon: "🥚", url: "", tags: ["protein", "baking"] },
  { name: { en: "Milk", ar: "حليب" }, category: "icon", icon: "🥛", url: "", tags: ["dairy", "liquid"] },
  { name: { en: "Heavy Cream", ar: "كريم" }, category: "icon", icon: "🥛", url: "", tags: ["dairy", "liquid"] },
  { name: { en: "Ghee (Samneh)", ar: "سمنة" }, category: "icon", icon: "🍯", url: "", tags: ["dairy", "fat"] },
  { name: { en: "Vanilla Essence", ar: "جوهر الفانيليا" }, category: "icon", icon: "🧪", url: "", tags: ["essence", "egnite", "flavor"] },
  { name: { en: "Strawberry Essence", ar: "جوهر الفراولة" }, category: "icon", icon: "🍓", url: "", tags: ["essence", "egnite", "fruit"] },
  { name: { en: "Chocolate Essence", ar: "جوهر الشوكولاتة" }, category: "icon", icon: "🍫", url: "", tags: ["essence", "egnite", "chocolate"] },
  { name: { en: "Coconut Essence", ar: "جوهر جوز الهند" }, category: "icon", icon: "🥥", url: "", tags: ["essence", "egnite", "tropical"] },
  { name: { en: "Coffee Essence", ar: "جوهر القهوة" }, category: "icon", icon: "☕", url: "", tags: ["essence", "egnite", "beverage"] },
  { name: { en: "Lemon Essence", ar: "جوهر الليمون" }, category: "icon", icon: "🍋", url: "", tags: ["essence", "egnite", "citrus"] },
  { name: { en: "Hazelnut Essence", ar: "جوهر البندق" }, category: "icon", icon: "🌰", url: "", tags: ["essence", "egnite", "nut"] },
  { name: { en: "Blueberry Essence", ar: "جوهر التوت" }, category: "icon", icon: "🫐", url: "", tags: ["essence", "egnite", "berry"] },
  { name: { en: "Emulsion", ar: "إيمولشن" }, category: "icon", icon: "🧴", url: "", tags: ["egnite", "emulsion"] },
  { name: { en: "Water", ar: "ماء" }, category: "icon", icon: "💧", url: "", tags: ["liquid"] },
  { name: { en: "Salt", ar: "ملح" }, category: "icon", icon: "🧂", url: "", tags: ["seasoning"] },
  { name: { en: "Baking Powder", ar: "بيكينج باودر" }, category: "icon", icon: "🥄", url: "", tags: ["baking", "leavening"] },
  { name: { en: "Yeast", ar: "خميرة" }, category: "icon", icon: "🫧", url: "", tags: ["baking", "leavening"] },
  { name: { en: "Cocoa Powder", ar: "كاكاو" }, category: "icon", icon: "🍫", url: "", tags: ["baking", "chocolate"] },
  { name: { en: "Powdered Sugar", ar: "سكر بودرة" }, category: "icon", icon: "❄️", url: "", tags: ["sweet", "baking"] },
  { name: { en: "Measuring Scale", ar: "ميزان" }, category: "icon", icon: "⚖️", url: "", tags: ["tool", "measurement"] },
  { name: { en: "Citric Acid", ar: "حمض الستريك" }, category: "icon", icon: "🍋", url: "", tags: ["beverage", "acid"] },
  { name: { en: "Ice", ar: "جليد" }, category: "icon", icon: "🧊", url: "", tags: ["beverage", "cold"] },
];

function getDefaultFields<T>(templateId: string): T {
  const t = TEMPLATES.find((x) => x.id === templateId);
  if (!t) throw new Error(`Template not found: ${templateId}`);
  return structuredClone(t.defaultFields) as unknown as T;
}

function stamp(doc: Omit<FactoryDocument, "createdAt" | "updatedAt">): FactoryDocument {
  const now = new Date().toISOString();
  return { ...doc, createdAt: now, updatedAt: now };
}

async function main() {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  await fs.mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });

  // ── Reset pass ────────────────────────────────────────────────────────
  if (RESET) {
    const existing = await fs.readdir(DOCS_DIR).catch(() => []);
    for (const f of existing) if (f.endsWith(".json")) await fs.unlink(path.join(DOCS_DIR, f));
    console.log(`✓ Reset — removed ${existing.length} existing documents`);
  }

  // ── Load existing docs (for idempotent skip) ──────────────────────────
  const existingDocs: FactoryDocument[] = [];
  try {
    const files = await fs.readdir(DOCS_DIR);
    for (const f of files.filter((x) => x.endsWith(".json"))) {
      try {
        const raw = await fs.readFile(path.join(DOCS_DIR, f), "utf-8");
        existingDocs.push(JSON.parse(raw) as FactoryDocument);
      } catch {
        /* skip unreadable */
      }
    }
  } catch {
    /* dir empty */
  }
  const existingByName = new Map(existingDocs.map((d) => [d.name, d] as const));

  let created = 0;
  let overwritten = 0;
  let skipped = 0;

  async function writeDoc(doc: FactoryDocument) {
    const existing = existingByName.get(doc.name);
    if (existing && !FORCE) {
      skipped++;
      return;
    }
    // Overwrite means we keep the existing id so routes don't 404.
    const id = existing ? existing.id : doc.id;
    const finalDoc: FactoryDocument = { ...doc, id, updatedAt: new Date().toISOString() };
    await fs.writeFile(path.join(DOCS_DIR, `${id}.json`), JSON.stringify(finalDoc, null, 2));
    if (existing) {
      overwritten++;
      console.log(`↻ Overwrote: ${doc.name}`);
    } else {
      created++;
      console.log(`✓ Created:   ${doc.name}`);
    }
  }

  // ── One showcase document per template ────────────────────────────────
  const showcases: FactoryDocument[] = [
    stamp({
      id: randomUUID(),
      name: "Sample — Recipe Card",
      templateType: "recipe-card",
      fields: {
        ...getDefaultFields<RecipeCardFields>("recipe-card"),
        themeId: TEMPLATE_THEME_ID["recipe-card"],
      },
      createdBy: "1",
    }),
    stamp({
      id: randomUUID(),
      name: "Sample — Biscuit Filling (Infographic)",
      templateType: "infographic-card",
      fields: {
        ...getDefaultFields<InfographicCardFields>("infographic-card"),
        themeId: TEMPLATE_THEME_ID["infographic-card"],
      },
      createdBy: "1",
    }),
    stamp({
      id: randomUUID(),
      name: "Sample — Carbonated Beverage",
      templateType: "beverage-card",
      fields: {
        ...getDefaultFields<BeverageCardFields>("beverage-card"),
        themeId: TEMPLATE_THEME_ID["beverage-card"],
      },
      createdBy: "1",
    }),
    stamp({
      id: randomUUID(),
      name: "Sample — Extended Recipe (Strawberry Shortcake)",
      templateType: "extended-recipe",
      fields: {
        ...getDefaultFields<RecipeCardFields>("extended-recipe"),
        themeId: TEMPLATE_THEME_ID["extended-recipe"],
      },
      createdBy: "1",
    }),
  ];

  for (const doc of showcases) await writeDoc(doc);

  // ── One Recipe Card per authored recipe ───────────────────────────────
  const recipeDefaults = getDefaultFields<RecipeCardFields>("recipe-card");
  for (const recipe of RECIPES) {
    const fields: RecipeCardFields = {
      ...recipeDefaults,
      themeId: TEMPLATE_THEME_ID["recipe-card"],
      heroImage: recipe.heroImage,
      title: { en: recipe.name, ar: recipe.nameAr },
      subtitle: {
        en: recipe.description.slice(0, 140),
        ar: recipe.descriptionAr.slice(0, 140),
      },
      prepTime: "15 mins",
      cookTime: "30 mins",
      servings: "12–16 pieces",
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      sections: recipe.sections,
      products: recipe.products,
      language: "en",
    };
    await writeDoc(
      stamp({
        id: randomUUID(),
        name: recipe.name,
        templateType: "recipe-card",
        fields,
        createdBy: "1",
      }),
    );
  }

  // ── Seed assets ───────────────────────────────────────────────────────
  let existingAssets: Asset[] = [];
  try {
    existingAssets = JSON.parse(await fs.readFile(ASSETS_INDEX, "utf-8")) as Asset[];
  } catch {
    /* no assets file yet */
  }
  const existingAssetNames = new Set(existingAssets.map((a) => a.name.en));
  const toAdd: Asset[] = [];
  for (const asset of DEFAULT_ASSETS) {
    if (existingAssetNames.has(asset.name.en)) continue;
    const now = new Date().toISOString();
    toAdd.push({ ...asset, id: randomUUID(), createdAt: now, updatedAt: now, createdBy: "1" });
  }
  if (toAdd.length > 0) {
    await fs.writeFile(ASSETS_INDEX, JSON.stringify([...toAdd, ...existingAssets], null, 2));
    console.log(`✓ Seeded ${toAdd.length} assets`);
  }

  console.log(`\nSeed complete: ${created} created · ${overwritten} overwritten · ${skipped} skipped`);
  console.log(`Data directory: ${DATA_DIR}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
