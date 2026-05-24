"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Force this page to render only on the client — uses File, FontFace, EventSource.
import { Download, Loader2, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  DEFAULT_LABELER_CONFIG,
  type LabelerConfig,
  type LabelerOutputFormat,
} from "../types";
import {
  createLabelerJob,
  confirmLabelerDownload,
} from "../server/actions";
import { ConfigPanel } from "./config-panel";
import { PreviewCanvas } from "./preview-canvas";
import { FlavorsInput } from "./flavors-input";
import { Dropzone } from "./dropzone";

interface LabelerStudioProps {
  essenceFlavors: string[];
}

type Phase = "idle" | "submitting" | "running" | "done" | "failed";

interface JobState {
  id: string;
  status: "queued" | "running" | "done" | "failed";
  done: number;
  total: number;
  current?: string;
  errors: string[];
  error?: string;
}

const ALL_FORMATS: LabelerOutputFormat[] = ["png", "jpeg", "webp", "pdf"];

export function LabelerStudio({ essenceFlavors }: LabelerStudioProps) {
  const toast = useToast();
  const [bottle, setBottle] = useState<File | null>(null);
  const [font, setFont] = useState<File | null>(null);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [flavorsText, setFlavorsText] = useState("");
  const [config, setConfig] = useState<LabelerConfig>(DEFAULT_LABELER_CONFIG);
  const [formats, setFormats] = useState<LabelerOutputFormat[]>(["png"]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [job, setJob] = useState<JobState | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Derive the bottle preview URL during render so we don't synchronously
  // setState inside an effect. The effect only owns the cleanup.
  const bottlePreviewUrl = useMemo(
    () => (bottle ? URL.createObjectURL(bottle) : null),
    [bottle],
  );
  useEffect(() => {
    if (!bottlePreviewUrl) return;
    return () => URL.revokeObjectURL(bottlePreviewUrl);
  }, [bottlePreviewUrl]);

  // Reset font family in the same callback that clears the font file, so the
  // load-effect below never needs to setState synchronously in its body.
  const handleFontChange = useCallback((file: File | null) => {
    setFont(file);
    if (!file) setFontFamily(null);
  }, []);

  // Load uploaded font into the document so the preview matches output
  useEffect(() => {
    if (!font) return;
    let cancelled = false;
    let face: FontFace | null = null;
    (async () => {
      try {
        const buffer = await font.arrayBuffer();
        const family = `labeler-font-${Date.now()}`;
        face = new FontFace(family, buffer);
        await face.load();
        if (cancelled) return;
        document.fonts.add(face);
        setFontFamily(family);
      } catch {
        toast.error("Could not load font file");
        handleFontChange(null);
      }
    })();
    return () => {
      cancelled = true;
      if (face) {
        try {
          document.fonts.delete(face);
        } catch {
          // ignore
        }
      }
    };
  }, [font, toast, handleFontChange]);

  // Tear down any open EventSource when we leave
  useEffect(() => () => eventSourceRef.current?.close(), []);

  const flavorLines = useMemo(
    () =>
      flavorsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    [flavorsText],
  );

  const previewFlavor = flavorLines[0] ?? "Sample Flavor";

  const canSubmit =
    bottle !== null && font !== null && flavorLines.length > 0 && formats.length > 0 && phase === "idle";

  const reset = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setPhase("idle");
    setJob(null);
  }, []);

  const startJob = useCallback(async () => {
    if (!bottle || !font) return;
    setPhase("submitting");
    const formData = new FormData();
    formData.append("bottle", bottle);
    formData.append("font", font);
    formData.append("flavors", flavorsText);
    formData.append("config", JSON.stringify(config));
    formData.append("formats", formats.join(","));

    const result = await createLabelerJob(formData);
    if (!result.ok) {
      toast.error(result.error);
      setPhase("idle");
      return;
    }

    setJob({
      id: result.jobId,
      status: "queued",
      done: 0,
      total: flavorLines.length,
      errors: [],
    });
    setPhase("running");

    const es = new EventSource(`/api/labeler/jobs/${result.jobId}/events`);
    eventSourceRef.current = es;
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as {
          status: JobState["status"];
          progress: { done: number; total: number; current?: string; errors: string[] };
          error?: string;
        };
        setJob((prev) =>
          prev
            ? {
                ...prev,
                status: data.status,
                done: data.progress.done,
                total: data.progress.total,
                current: data.progress.current,
                errors: data.progress.errors,
                error: data.error,
              }
            : prev,
        );
        if (data.status === "done") {
          setPhase("done");
          es.close();
        } else if (data.status === "failed") {
          setPhase("failed");
          toast.error(data.error ?? "Generation failed");
          es.close();
        }
      } catch {
        // ignore malformed frame
      }
    };
    es.onerror = () => {
      // Browser will auto-retry; nothing to do unless the server has closed.
    };
  }, [bottle, font, flavorsText, config, formats, flavorLines.length, toast]);

  const downloadAndConfirm = useCallback(async () => {
    if (!job) return;
    const url = `/api/labeler/jobs/${job.id}/download`;
    // Anchor click triggers the browser's download manager
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener";
    a.click();

    // Give the browser a beat to start the transfer before we delete the job
    await new Promise((r) => setTimeout(r, 1500));
    const result = await confirmLabelerDownload(job.id);
    if (result.ok) {
      toast.success("Download started — job cleaned up");
    } else {
      toast.info("Download started");
    }
    reset();
  }, [job, reset, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* Left: inputs + preview */}
      <div className="flex flex-col gap-6">
        <section className="bg-white border border-gold-light/60 rounded-2xl p-5">
          <h2 className="font-bold text-ink text-base mb-4 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold" />
            Inputs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropzone
              label="Bottle image"
              hint="PNG, JPEG, WebP, GIF · up to 10MB"
              accept="image/png,image/jpeg,image/webp,image/gif"
              file={bottle}
              onFile={setBottle}
            />
            <Dropzone
              label="Font file"
              hint=".ttf, .otf, .woff, .woff2 · up to 5MB"
              accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
              file={font}
              onFile={handleFontChange}
            />
          </div>
        </section>

        <section className="bg-white border border-gold-light/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-ink text-base flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold" />
              Flavors
              <span className="text-xs text-ink-muted font-normal">
                {flavorLines.length} entries
              </span>
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFlavorsText(essenceFlavors.join("\n"))}
              className="gap-1.5"
            >
              <Sparkles size={14} />
              Load Egnite essences
            </Button>
          </div>
          <FlavorsInput value={flavorsText} onChange={setFlavorsText} />
        </section>

        <section className="bg-white border border-gold-light/60 rounded-2xl p-5">
          <h2 className="font-bold text-ink text-base mb-4 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold" />
            Preview
            <span className="text-xs text-ink-muted font-normal">
              first flavor — “{previewFlavor}”
            </span>
          </h2>
          <PreviewCanvas
            imageUrl={bottlePreviewUrl}
            text={previewFlavor}
            fontFamily={fontFamily}
            config={config}
          />
        </section>
      </div>

      {/* Right: config + generate */}
      <aside className="flex flex-col gap-4">
        <section className="bg-white border border-gold-light/60 rounded-2xl p-5 sticky top-20">
          <h2 className="font-bold text-ink text-base mb-4 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold" />
            Label settings
          </h2>
          <ConfigPanel config={config} onChange={setConfig} />

          <div className="mt-5 border-t border-gold-light/60 pt-4">
            <p className="text-sm font-medium text-ink mb-2">Output formats</p>
            <div className="flex flex-wrap gap-2">
              {ALL_FORMATS.map((fmt) => {
                const active = formats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() =>
                      setFormats((prev) =>
                        prev.includes(fmt)
                          ? prev.filter((f) => f !== fmt)
                          : [...prev, fmt],
                      )
                    }
                    className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-colors ${
                      active
                        ? "bg-gold text-white border-gold"
                        : "bg-cream border-gold-light text-ink-muted hover:bg-cream-dark"
                    }`}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {phase === "idle" && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full mt-5 gap-2"
              onClick={startJob}
              disabled={!canSubmit}
            >
              <Upload size={16} />
              Generate labels
            </Button>
          )}

          {(phase === "submitting" || phase === "running") && job && (
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-ink">
                <Loader2 size={16} className="animate-spin text-gold" />
                <span>
                  {job.done} / {job.total}
                  {job.current ? ` · ${job.current}` : ""}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-cream-dark overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-200"
                  style={{
                    width: `${job.total > 0 ? (job.done / job.total) * 100 : 0}%`,
                  }}
                />
              </div>
              {job.errors.length > 0 && (
                <p className="text-xs text-red-600">
                  {job.errors.length} flavor{job.errors.length === 1 ? "" : "s"} failed
                </p>
              )}
            </div>
          )}

          {phase === "done" && job && (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-ink">
                Done. Generated {job.done} of {job.total} labels.
                {job.errors.length > 0 && (
                  <span className="block text-xs text-red-600 mt-1">
                    {job.errors.length} failed — see manifest.csv inside the zip.
                  </span>
                )}
              </p>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={downloadAndConfirm}
              >
                <Download size={16} />
                Download zip
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={reset}
              >
                Start over
              </Button>
            </div>
          )}

          {phase === "failed" && (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-red-600">
                {job?.error ?? "Generation failed"}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full gap-2"
                onClick={reset}
              >
                <X size={14} />
                Reset
              </Button>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
