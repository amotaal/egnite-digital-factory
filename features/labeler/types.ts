export type LabelerOutputFormat = "png" | "jpeg" | "webp" | "pdf";

export type TextAlign = "left" | "center" | "right";
export type FontWeight = "normal" | "bold";

/** Rectangular label region, expressed as percentages of the bottle image. */
export interface LabelBox {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export interface LabelerConfig {
  labelBox: LabelBox;
  /** Used only when autoFit is false. */
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  align: TextAlign;
  /** Letter spacing in pixels at the input image's native resolution. */
  letterSpacing: number;
  uppercase: boolean;
  /** When true, font size is derived from the longest flavor so every label
   *  in the batch ends up the same size. */
  autoFit: boolean;
  /** When true, each whitespace-separated word in a flavor becomes its own line. */
  oneWordPerLine: boolean;
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

export const DEFAULT_LABEL_BOX: LabelBox = {
  xPercent: 20,
  yPercent: 45,
  widthPercent: 60,
  heightPercent: 18,
};

export const DEFAULT_LABELER_CONFIG: LabelerConfig = {
  labelBox: DEFAULT_LABEL_BOX,
  fontSize: 96,
  fontWeight: "bold",
  color: "#1a1a1a",
  align: "center",
  letterSpacing: 2,
  uppercase: true,
  autoFit: true,
  oneWordPerLine: true,
};
