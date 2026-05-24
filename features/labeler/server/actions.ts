"use server";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { createJob, deleteJob, getJob } from "@/lib/jobs";
import {
  DEFAULT_LABELER_CONFIG,
  type LabelerConfig,
  type LabelerJobMeta,
  type LabelerOutputFormat,
} from "../types";
import { parseFlavors, MAX_FLAVORS } from "./parse-flavors";
import { runGeneration } from "./generate";

const MAX_BOTTLE_BYTES = 10 * 1024 * 1024;
const MAX_FONT_BYTES = 5 * 1024 * 1024;
const ALLOWED_BOTTLE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_FONT_EXT = [".ttf", ".otf", ".woff", ".woff2"];
const ALLOWED_FORMATS: LabelerOutputFormat[] = ["png", "jpeg", "webp", "pdf"];

export type CreateLabelerJobResult =
  | { ok: true; jobId: string }
  | { ok: false; error: string };

async function requireUser(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const user = await resolveSession(token);
  return Boolean(user);
}

export async function createLabelerJob(
  formData: FormData,
): Promise<CreateLabelerJobResult> {
  if (!(await requireUser())) {
    return { ok: false, error: "Unauthorized" };
  }

  const bottle = formData.get("bottle");
  const font = formData.get("font");
  const flavorsRaw = String(formData.get("flavors") ?? "");
  const configRaw = String(formData.get("config") ?? "");
  const formatsRaw = String(formData.get("formats") ?? "png");

  if (!(bottle instanceof File)) return { ok: false, error: "Missing bottle image" };
  if (!(font instanceof File)) return { ok: false, error: "Missing font file" };
  if (bottle.size === 0) return { ok: false, error: "Bottle image is empty" };
  if (font.size === 0) return { ok: false, error: "Font file is empty" };
  if (bottle.size > MAX_BOTTLE_BYTES) return { ok: false, error: "Bottle image must be under 10MB" };
  if (font.size > MAX_FONT_BYTES) return { ok: false, error: "Font file must be under 5MB" };
  if (!ALLOWED_BOTTLE_MIME.includes(bottle.type)) {
    return { ok: false, error: "Bottle must be JPEG, PNG, WebP, or GIF" };
  }
  const fontExt = path.extname(font.name).toLowerCase();
  if (!ALLOWED_FONT_EXT.includes(fontExt)) {
    return { ok: false, error: "Font must be .ttf, .otf, .woff, or .woff2" };
  }

  const formats = formatsRaw
    .split(",")
    .map((f) => f.trim().toLowerCase())
    .filter((f): f is LabelerOutputFormat =>
      (ALLOWED_FORMATS as string[]).includes(f),
    );
  if (formats.length === 0) {
    return { ok: false, error: "Pick at least one output format" };
  }

  let config: LabelerConfig;
  try {
    config = mergeConfig(configRaw ? JSON.parse(configRaw) : {});
  } catch {
    return { ok: false, error: "Invalid config payload" };
  }

  const parsed = parseFlavors(flavorsRaw);
  if (parsed.flavors.length === 0) {
    return { ok: false, error: "No flavors provided" };
  }

  const meta: LabelerJobMeta = {
    bottleName: bottle.name,
    fontName: font.name,
    formats,
    config,
    flavorCount: parsed.flavors.length,
  };

  const job = await createJob<LabelerJobMeta>("labeler", meta, parsed.flavors.length);

  // Persist inputs in the job dir
  await fs.writeFile(
    path.join(job.dir, "input.bin"),
    Buffer.from(await bottle.arrayBuffer()),
  );
  await fs.writeFile(
    path.join(job.dir, "font.bin"),
    Buffer.from(await font.arrayBuffer()),
  );
  await fs.writeFile(
    path.join(job.dir, "flavors.json"),
    JSON.stringify(parsed.flavors, null, 2),
  );

  // Kick off generation in the background. The Node runtime keeps the
  // promise alive for the lifetime of the server process, which is what
  // we want — the client follows progress via SSE.
  void runGeneration({ jobId: job.id, flavors: parsed.flavors }).catch(() => {
    // Errors are already reflected on the job by runGeneration.
  });

  return { ok: true, jobId: job.id };
}

export async function confirmLabelerDownload(jobId: string): Promise<{ ok: boolean }> {
  if (!(await requireUser())) return { ok: false };
  const job = getJob(jobId);
  if (!job || job.kind !== "labeler") return { ok: false };
  await deleteJob(jobId);
  return { ok: true };
}

function mergeConfig(partial: Partial<LabelerConfig>): LabelerConfig {
  const merged: LabelerConfig = { ...DEFAULT_LABELER_CONFIG, ...partial };
  merged.xPercent = clamp(Number(merged.xPercent), 0, 100);
  merged.yPercent = clamp(Number(merged.yPercent), 0, 100);
  merged.maxWidthPercent = clamp(Number(merged.maxWidthPercent), 5, 100);
  merged.fontSize = clamp(Number(merged.fontSize), 6, 1024);
  merged.letterSpacing = clamp(Number(merged.letterSpacing), -50, 200);
  if (merged.fontWeight !== "bold" && merged.fontWeight !== "normal") {
    merged.fontWeight = "normal";
  }
  if (!["left", "center", "right"].includes(merged.align)) {
    merged.align = "center";
  }
  if (typeof merged.color !== "string" || !/^#[0-9a-fA-F]{3,8}$/.test(merged.color)) {
    merged.color = "#1a1a1a";
  }
  merged.uppercase = Boolean(merged.uppercase);
  return merged;
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export { MAX_FLAVORS };
