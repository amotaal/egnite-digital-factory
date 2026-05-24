import { promises as fs, createWriteStream } from "fs";
import path from "path";
import archiver from "archiver";
import sharp from "sharp";
import { jsPDF } from "jspdf";
import { updateJob, getJob } from "@/lib/jobs";
import type { LabelerFlavor, LabelerJobMeta, LabelerOutputFormat } from "../types";
import { composite, computeFitSize, loadFont, readBottle, renderLabelSvg } from "./render";

export interface GenerateArgs {
  jobId: string;
  flavors: LabelerFlavor[];
}

export async function runGeneration({ jobId, flavors }: GenerateArgs): Promise<void> {
  const job = getJob<LabelerJobMeta>(jobId);
  if (!job) return;
  updateJob(jobId, { status: "running" });

  try {
    const bottleBuf = await fs.readFile(path.join(job.dir, "input.bin"));
    const fontBuf = await fs.readFile(path.join(job.dir, "font.bin"));
    const { buffer: bottle, meta: bottleMeta } = await readBottle(bottleBuf);
    const { font } = await loadFont(fontBuf);

    const outDir = path.join(job.dir, "out");
    await fs.mkdir(outDir, { recursive: true });
    const manifest: Array<{ flavor: string; slug: string; files: string[] }> = [];

    // Compute one shared font size so every bottle in the batch looks
    // visually consistent — the longest flavor sets the ceiling.
    const fitSize = job.meta.config.autoFit
      ? computeFitSize(
          flavors.map((f) => f.text),
          font,
          bottleMeta,
          job.meta.config,
        )
      : job.meta.config.fontSize;

    for (const flavor of flavors) {
      const files: string[] = [];
      try {
        const svg = renderLabelSvg(flavor.text, bottleMeta, font, job.meta.config, fitSize);
        const pipeline = await composite(bottle, svg);
        const baseBuf = await pipeline.png().toBuffer();

        for (const format of job.meta.formats) {
          const written = await writeFormat(outDir, flavor.slug, baseBuf, format);
          files.push(written);
        }
        manifest.push({ flavor: flavor.text, slug: flavor.slug, files });
        updateJob(jobId, {
          progress: { done: job.progress.done + 1, current: flavor.text },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const next = getJob(jobId);
        const errors = next?.progress.errors ?? [];
        updateJob(jobId, {
          progress: {
            done: (next?.progress.done ?? 0) + 1,
            current: flavor.text,
            errors: [...errors, `${flavor.text}: ${message}`],
          },
        });
      }
    }

    await writeManifest(outDir, manifest);
    await writeZip(job.dir, outDir);
    updateJob(jobId, { status: "done" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    updateJob(jobId, { status: "failed", error: message });
  }
}

async function writeFormat(
  outDir: string,
  slug: string,
  baseBuf: Buffer,
  format: LabelerOutputFormat,
): Promise<string> {
  const sub = path.join(outDir, format);
  await fs.mkdir(sub, { recursive: true });

  if (format === "pdf") {
    const meta = await sharp(baseBuf).metadata();
    const w = meta.width ?? 1;
    const h = meta.height ?? 1;
    const orientation: "p" | "l" = h >= w ? "p" : "l";
    const doc = new jsPDF({ orientation, unit: "px", format: [w, h] });
    const dataUrl = `data:image/png;base64,${baseBuf.toString("base64")}`;
    doc.addImage(dataUrl, "PNG", 0, 0, w, h);
    const buf = Buffer.from(doc.output("arraybuffer"));
    const file = path.join(sub, `${slug}.pdf`);
    await fs.writeFile(file, buf);
    return path.relative(outDir, file);
  }

  let buf: Buffer;
  let ext: string;
  if (format === "jpeg") {
    buf = await sharp(baseBuf).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toBuffer();
    ext = "jpg";
  } else if (format === "webp") {
    buf = await sharp(baseBuf).webp({ quality: 92 }).toBuffer();
    ext = "webp";
  } else {
    buf = baseBuf;
    ext = "png";
  }
  const file = path.join(sub, `${slug}.${ext}`);
  await fs.writeFile(file, buf);
  return path.relative(outDir, file);
}

async function writeManifest(
  outDir: string,
  rows: Array<{ flavor: string; slug: string; files: string[] }>,
): Promise<void> {
  const header = "flavor,slug,files\n";
  const body = rows
    .map(
      (r) =>
        `${csvEscape(r.flavor)},${csvEscape(r.slug)},${csvEscape(r.files.join("; "))}`,
    )
    .join("\n");
  await fs.writeFile(path.join(outDir, "manifest.csv"), header + body + "\n");
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function writeZip(jobDir: string, outDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const target = path.join(jobDir, "output.zip");
    const stream = createWriteStream(target);
    const zip = archiver("zip", { zlib: { level: 6 } });
    stream.on("close", () => resolve());
    stream.on("error", reject);
    zip.on("error", reject);
    zip.pipe(stream);
    zip.directory(outDir, false);
    void zip.finalize();
  });
}
