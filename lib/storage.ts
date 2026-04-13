import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { FactoryDocument } from "./types";

const DATA_DIR =
  process.env.DATA_DIR || path.join(process.cwd(), "data");
const DOCS_DIR = path.join(DATA_DIR, "documents");

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
