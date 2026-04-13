import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { FactoryDocument, Asset } from "./types";

const DATA_DIR =
  process.env.DATA_DIR || path.join(process.cwd(), "data");
const DOCS_DIR = path.join(DATA_DIR, "documents");
const ASSETS_DIR = path.join(DATA_DIR, "assets");
const ASSETS_INDEX = path.join(DATA_DIR, "assets.json");

async function ensureDirs() {
  await fs.mkdir(DOCS_DIR, { recursive: true });
}

export async function getAllDocuments(): Promise<FactoryDocument[]> {
  await ensureDirs();
  let files: string[];
  try {
    files = await fs.readdir(DOCS_DIR);
  } catch {
    return [];
  }
  const docs = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map((f) =>
        fs
          .readFile(path.join(DOCS_DIR, f), "utf-8")
          .then((raw) => JSON.parse(raw) as FactoryDocument)
          .catch(() => null)
      )
  );
  return (docs.filter(Boolean) as FactoryDocument[]).sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getDocument(id: string): Promise<FactoryDocument | null> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(path.join(DOCS_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as FactoryDocument;
  } catch {
    return null;
  }
}

export async function createDocument(
  partial: Omit<FactoryDocument, "id" | "createdAt" | "updatedAt">
): Promise<FactoryDocument> {
  await ensureDirs();
  const now = new Date().toISOString();
  const doc: FactoryDocument = {
    ...partial,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await fs.writeFile(
    path.join(DOCS_DIR, `${doc.id}.json`),
    JSON.stringify(doc, null, 2)
  );
  return doc;
}

export async function updateDocument(
  id: string,
  partial: Partial<Omit<FactoryDocument, "id" | "createdAt">>
): Promise<FactoryDocument | null> {
  const existing = await getDocument(id);
  if (!existing) return null;
  const updated: FactoryDocument = {
    ...existing,
    ...partial,
    id,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    path.join(DOCS_DIR, `${id}.json`),
    JSON.stringify(updated, null, 2)
  );
  return updated;
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    await fs.unlink(path.join(DOCS_DIR, `${id}.json`));
    return true;
  } catch {
    return false;
  }
}

// ─── Uploads ─────────────────────────────────────────────────────────────────

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function saveUpload(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  await ensureUploadsDir();
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

// ─── Asset library ───────────────────────────────────────────────────────────

async function ensureAssetDirs() {
  await fs.mkdir(ASSETS_DIR, { recursive: true });
}

export async function getAllAssets(): Promise<Asset[]> {
  await ensureAssetDirs();
  try {
    const raw = await fs.readFile(ASSETS_INDEX, "utf-8");
    const list = JSON.parse(raw) as Asset[];
    return list.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

async function writeAssets(list: Asset[]): Promise<void> {
  await ensureAssetDirs();
  await fs.writeFile(ASSETS_INDEX, JSON.stringify(list, null, 2));
}

export async function getAsset(id: string): Promise<Asset | null> {
  const all = await getAllAssets();
  return all.find((a) => a.id === id) ?? null;
}

export async function createAsset(
  partial: Omit<Asset, "id" | "createdAt" | "updatedAt">
): Promise<Asset> {
  const all = await getAllAssets();
  const now = new Date().toISOString();
  const asset: Asset = {
    ...partial,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await writeAssets([asset, ...all]);
  return asset;
}

export async function updateAsset(
  id: string,
  partial: Partial<Omit<Asset, "id" | "createdAt">>
): Promise<Asset | null> {
  const all = await getAllAssets();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Asset = {
    ...all[idx],
    ...partial,
    id,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  await writeAssets(all);
  return updated;
}

export async function deleteAsset(id: string): Promise<boolean> {
  const all = await getAllAssets();
  const next = all.filter((a) => a.id !== id);
  if (next.length === all.length) return false;
  await writeAssets(next);
  return true;
}
