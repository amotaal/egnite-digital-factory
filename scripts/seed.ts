/**
 * Seed script — creates initial documents from the 9 pre-defined recipes
 * and populates the asset library with shared ingredient icons.
 *
 * Run with: pnpm seed
 *
 * Idempotent: re-running the script will skip existing docs/assets rather
 * than duplicating them.
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { RECIPES } from "../lib/data/recipes";
import { TEMPLATES } from "../lib/data/templates";
import type { FactoryDocument, RecipeCardFields, Asset } from "../lib/types";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DOCS_DIR = path.join(DATA_DIR, "documents");
const ASSETS_INDEX = path.join(DATA_DIR, "assets.json");

// ─── Default asset library ────────────────────────────────────────────────────
// Common cooking ingredients + essences, available to all templates out of the box.
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
];

async function main() {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  await fs.mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });

  const recipeTemplate = TEMPLATES.find((t) => t.id === "recipe-card");
  if (!recipeTemplate) throw new Error("recipe-card template not found");

  const defaultFields = recipeTemplate.defaultFields as RecipeCardFields;

  // ── Seed documents ───────────────────────────────────────────────────
  const existingDocs = await fs
    .readdir(DOCS_DIR)
    .then((files) =>
      Promise.all(
        files
          .filter((f) => f.endsWith(".json"))
          .map((f) =>
            fs
              .readFile(path.join(DOCS_DIR, f), "utf-8")
              .then((raw) => JSON.parse(raw) as FactoryDocument)
              .catch(() => null)
          )
      )
    )
    .then((arr) => arr.filter(Boolean) as FactoryDocument[]);

  const existingNames = new Set(existingDocs.map((d) => d.name));

  let created = 0;
  let skipped = 0;

  for (const recipe of RECIPES) {
    if (existingNames.has(recipe.name)) {
      skipped++;
      continue;
    }
    const docId = randomUUID();
    const now = new Date().toISOString();

    const fields: RecipeCardFields = {
      ...defaultFields,
      heroImage: recipe.heroImage,
      title: { en: recipe.name, ar: recipe.nameAr },
      subtitle: { en: recipe.description.slice(0, 120), ar: recipe.descriptionAr.slice(0, 120) },
      prepTime: "15 mins",
      cookTime: "30 mins",
      servings: "12–16 pieces",
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      sections: recipe.sections,
      products: recipe.products,
      badgeText: { en: "ENJOY EVERY BITE", ar: "استمتع بكل قضمة" },
      tagline: { en: "Creativity with Confidence", ar: "إبداع بثقة" },
      language: "en",
      primaryColor: "#B78D4B",
      backgroundColor: "#FCFAF4",
    };

    const doc: FactoryDocument = {
      id: docId,
      name: recipe.name,
      templateType: "recipe-card",
      fields,
      createdAt: now,
      updatedAt: now,
      createdBy: "1", // admin user
    };

    const outPath = path.join(DOCS_DIR, `${docId}.json`);
    await fs.writeFile(outPath, JSON.stringify(doc, null, 2));
    console.log(`✓ Created doc: ${recipe.name}`);
    created++;
  }

  // ── Seed assets (idempotent — dedupes by EN name) ───────────────────
  let existingAssets: Asset[] = [];
  try {
    const raw = await fs.readFile(ASSETS_INDEX, "utf-8");
    existingAssets = JSON.parse(raw) as Asset[];
  } catch {
    /* file doesn't exist yet */
  }
  const existingAssetNames = new Set(existingAssets.map((a) => a.name.en));
  const toAdd: Asset[] = [];
  for (const asset of DEFAULT_ASSETS) {
    if (existingAssetNames.has(asset.name.en)) continue;
    const now = new Date().toISOString();
    toAdd.push({
      ...asset,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      createdBy: "1",
    });
  }
  if (toAdd.length > 0) {
    const merged = [...toAdd, ...existingAssets];
    await fs.writeFile(ASSETS_INDEX, JSON.stringify(merged, null, 2));
    console.log(`✓ Seeded ${toAdd.length} assets`);
  }

  console.log(
    `\nSeed complete: ${created} docs created, ${skipped} skipped; ${toAdd.length} assets added, ${existingAssets.length} existing.`
  );
  console.log(`Data directory: ${DATA_DIR}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
