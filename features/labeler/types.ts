export type LabelerOutputFormat = "png" | "jpeg" | "webp" | "pdf";

export type TextAlign = "left" | "center" | "right";
export type FontWeight = "normal" | "bold";

export interface LabelerConfig {
  /** Center of the text block as a percentage of the bottle image (0–100). */
  xPercent: number;
  yPercent: number;
  /** Max width of the text block as a percentage of the bottle image (0–100). */
  maxWidthPercent: number;
  /** Font size in pixels at the input image's native resolution. */
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  align: TextAlign;
  /** Letter spacing in pixels. */
  letterSpacing: number;
  /** Uppercase the rendered text. */
  uppercase: boolean;
}

export interface LabelerJobMeta {
  /** Original filename of the uploaded bottle image — for the manifest only. */
  bottleName: string;
  /** Original filename of the uploaded font. */
  fontName: string;
  formats: LabelerOutputFormat[];
  config: LabelerConfig;
  flavorCount: number;
}

export interface LabelerFlavor {
  /** Raw user-provided text. */
  text: string;
  /** Filename-safe slug, unique within the job. */
  slug: string;
}

export const DEFAULT_LABELER_CONFIG: LabelerConfig = {
  xPercent: 50,
  yPercent: 55,
  maxWidthPercent: 60,
  fontSize: 96,
  fontWeight: "bold",
  color: "#1a1a1a",
  align: "center",
  letterSpacing: 0,
  uppercase: true,
};
