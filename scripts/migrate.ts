/**
 * Migrate script — walks every document in /data/documents and:
 *   1. Stamps the correct `themeId` onto the fields (based on templateType).
 *   2. Clears legacy `primaryColor` / `backgroundColor` so they don't shadow
 *      the preset's semantic colours.
 *   3. For beverage-card docs, fills in the tri-dose `dosageStarting /
 *      dosageQuick / dosageRange` cells if missing, plus `headerPill`.
 *   4. Bumps `updatedAt`.
 *
 * Idempotent — safe to re-run.
 *
 * Run with: `pnpm migrate`
 */
import { promises as fs } from "fs";
import path from "path";
import { TEMPLATE_THEME_ID, TEMPLATES } from "../lib/data/templates";
import type {
  BeverageCardFields,
  FactoryDocument,
  RecipeCardFields,
} from "../lib/types";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DOCS_DIR = path.join(DATA_DIR, "documents");

async function main() {
  const files = await fs.readdir(DOCS_DIR).catch(() => [] as string[]);
  let touched = 0;
  let unchanged = 0;

  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const full = path.join(DOCS_DIR, file);
    const raw = await fs.readFile(full, "utf-8").catch(() => null);
    if (!raw) continue;
    let doc: FactoryDocument;
    try {
      doc = JSON.parse(raw) as FactoryDocument;
    } catch {
      console.warn(`! Skipping malformed: ${file}`);
      continue;
    }

    let changed = false;
    const fields = doc.fields as unknown as Record<string, unknown>;

    // 1. themeId
    const expectedThemeId = TEMPLATE_THEME_ID[doc.templateType];
    if (expectedThemeId && fields.themeId !== expectedThemeId) {
      fields.themeId = expectedThemeId;
      changed = true;
    }

    // 2. Clear legacy primary/background so preset wins
    if (fields.primaryColor !== "") {
      fields.primaryColor = "";
      changed = true;
    }
    if (fields.backgroundColor !== "") {
      fields.backgroundColor = "";
      changed = true;
    }

    // 3. Beverage-card tri-dose + headerPill backfill
    if (doc.templateType === "beverage-card") {
      const defaults = TEMPLATES.find((t) => t.id === "beverage-card")?.defaultFields as
        | BeverageCardFields
        | undefined;
      if (defaults) {
        const bev = fields as unknown as BeverageCardFields;
        if (!bev.headerPill || typeof bev.headerPill !== "object") {
          bev.headerPill = defaults.headerPill;
          changed = true;
        }
        if (!bev.dosageStarting) {
          bev.dosageStarting = defaults.dosageStarting;
          changed = true;
        }
        if (!bev.dosageQuick) {
          bev.dosageQuick = defaults.dosageQuick;
          changed = true;
        }
        if (!bev.dosageRange) {
          bev.dosageRange = defaults.dosageRange;
          changed = true;
        }
      }
    }

    // 4. Recipe-card sideNote backfill (optional)
    if (doc.templateType === "recipe-card" || doc.templateType === "extended-recipe") {
      const rec = fields as unknown as RecipeCardFields;
      if (!rec.sideNote) {
        rec.sideNote = undefined;
      }
    }

    if (changed) {
      doc.updatedAt = new Date().toISOString();
      await fs.writeFile(full, JSON.stringify(doc, null, 2));
      console.log(`↻ Migrated: ${doc.name}`);
      touched++;
    } else {
      unchanged++;
    }
  }

  console.log(`\nMigrate complete: ${touched} updated · ${unchanged} already current`);
}

main().catch((err) => {
  console.error("Migrate failed:", err);
  process.exit(1);
});
