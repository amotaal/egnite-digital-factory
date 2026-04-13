/**
 * Seed script — creates initial documents from the 9 pre-defined recipes.
 * Run with: npx tsx scripts/seed.ts
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { RECIPES } from "../lib/data/recipes";
import { TEMPLATES } from "../lib/data/templates";
import type { FactoryDocument, RecipeCardFields } from "../lib/types";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DOCS_DIR = path.join(DATA_DIR, "documents");

async function main() {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  await fs.mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });

  const recipeTemplate = TEMPLATES.find((t) => t.id === "recipe-card");
  if (!recipeTemplate) throw new Error("recipe-card template not found");

  const defaultFields = recipeTemplate.defaultFields as RecipeCardFields;

  let created = 0;
  let skipped = 0;

  for (const recipe of RECIPES) {
    const docId = randomUUID();
    const now = new Date().toISOString();

    const fields: RecipeCardFields = {
      ...defaultFields,
      heroImage: recipe.heroImage,
      title: { en: recipe.name, ar: recipe.nameAr },
      subtitle: { en: recipe.description.slice(0, 80), ar: recipe.descriptionAr.slice(0, 80) },
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
    console.log(`✓ Created: ${recipe.name} → ${docId}.json`);
    created++;
  }

  console.log(`\nSeed complete: ${created} documents created, ${skipped} skipped.`);
  console.log(`Data directory: ${DOCS_DIR}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
