"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LabelBox, LabelerConfig } from "../types";
import { computeFitSize, drawLabel } from "./fit";

interface PreviewCanvasProps {
  imageUrl: string | null;
  text: string;
  fontFamily: string | null;
  config: LabelerConfig;
  /** All flavors in the batch — used to compute the shared auto-fit size. */
  allFlavors: string[];
  /** Called when the user drags / resizes the selection rectangle. */
  onBoxChange: (box: LabelBox) => void;
}

type DragMode =
  | { kind: "draw"; startX: number; startY: number }
  | { kind: "move"; offsetX: number; offsetY: number }
  | { kind: "resize"; corner: Corner; anchorX: number; anchorY: number };

type Corner = "nw" | "ne" | "sw" | "se";

const HANDLE_PX = 10;

export function PreviewCanvas({
  imageUrl,
  text,
  fontFamily,
  config,
  allFlavors,
  onBoxChange,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [drag, setDrag] = useState<DragMode | null>(null);

  // Load image + record natural dimensions
  useEffect(() => {
    if (!imageUrl) {
      imageRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Compute the shared font size that fits the worst-case flavor in the box.
  const fitSize = useMemo(() => {
    if (!size || !fontFamily) return config.fontSize;
    if (!config.autoFit) return config.fontSize;
    return computeFitSize(allFlavors, size, config, fontFamily);
  }, [size, fontFamily, config, allFlavors]);

  // Re-paint whenever anything visual changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !size) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size.w;
    canvas.height = size.h;
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.drawImage(img, 0, 0, size.w, size.h);

    if (fontFamily) {
      drawLabel(ctx, text, size, config, fontFamily, fitSize);
    }

    drawBoxOverlay(ctx, size, config.labelBox);
  }, [size, text, fontFamily, config, fitSize]);

  // ── Pointer interactions ─────────────────────────────────────────────────

  const toImageCoords = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas || !size) return null;
      const rect = canvas.getBoundingClientRect();
      const scale = size.w / rect.width;
      return {
        x: (clientX - rect.left) * scale,
        y: (clientY - rect.top) * scale,
      };
    },
    [size],
  );

  const hitTest = useCallback(
    (px: { x: number; y: number }): DragMode | null => {
      if (!size) return null;
      const b = boxPx(size, config.labelBox);
      const h = HANDLE_PX * (size.w / Math.max(size.w, 1)); // image-space px
      // Resize handles (corners)
      const corners: Array<[Corner, number, number]> = [
        ["nw", b.x, b.y],
        ["ne", b.x + b.width, b.y],
        ["sw", b.x, b.y + b.height],
        ["se", b.x + b.width, b.y + b.height],
      ];
      for (const [c, hx, hy] of corners) {
        if (Math.abs(px.x - hx) < h && Math.abs(px.y - hy) < h) {
          const anchorX =
            c === "nw" || c === "sw" ? b.x + b.width : b.x;
          const anchorY =
            c === "nw" || c === "ne" ? b.y + b.height : b.y;
          return { kind: "resize", corner: c, anchorX, anchorY };
        }
      }
      // Inside the box → move
      if (
        px.x >= b.x &&
        px.x <= b.x + b.width &&
        px.y >= b.y &&
        px.y <= b.y + b.height
      ) {
        return { kind: "move", offsetX: px.x - b.x, offsetY: px.y - b.y };
      }
      // Outside → start drawing a new box
      return { kind: "draw", startX: px.x, startY: px.y };
    },
    [size, config.labelBox],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const px = toImageCoords(e.clientX, e.clientY);
      if (!px) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const mode = hitTest(px);
      if (mode) setDrag(mode);
    },
    [toImageCoords, hitTest],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drag || !size) return;
      const px = toImageCoords(e.clientX, e.clientY);
      if (!px) return;
      const b = config.labelBox;
      let next: LabelBox = b;
      if (drag.kind === "draw") {
        const x1 = Math.min(drag.startX, px.x);
        const y1 = Math.min(drag.startY, px.y);
        const x2 = Math.max(drag.startX, px.x);
        const y2 = Math.max(drag.startY, px.y);
        next = pixelsToBox(size, { x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
      } else if (drag.kind === "move") {
        const bp = boxPx(size, b);
        const nx = clamp(px.x - drag.offsetX, 0, size.w - bp.width);
        const ny = clamp(px.y - drag.offsetY, 0, size.h - bp.height);
        next = pixelsToBox(size, { x: nx, y: ny, width: bp.width, height: bp.height });
      } else {
        const x1 = Math.min(drag.anchorX, px.x);
        const y1 = Math.min(drag.anchorY, px.y);
        const x2 = Math.max(drag.anchorX, px.x);
        const y2 = Math.max(drag.anchorY, px.y);
        next = pixelsToBox(size, { x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
      }
      // Enforce minimum size so the user can always grab the box again
      if (next.widthPercent < 2) next.widthPercent = 2;
      if (next.heightPercent < 2) next.heightPercent = 2;
      onBoxChange(next);
    },
    [drag, size, config.labelBox, toImageCoords, onBoxChange],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDrag(null);
    },
    [],
  );

  if (!imageUrl) {
    return (
      <div className="aspect-[3/4] w-full max-w-md mx-auto rounded-xl bg-cream-dark border border-gold-light/60 flex items-center justify-center text-sm text-ink-muted">
        Upload a bottle image to see the preview
      </div>
    );
  }

  const cursor =
    drag?.kind === "resize"
      ? "nwse-resize"
      : drag?.kind === "move"
        ? "grabbing"
        : "crosshair";

  return (
    <div className="w-full max-w-md mx-auto">
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor, touchAction: "none" }}
        className="w-full h-auto rounded-xl border border-gold-light/60 bg-white select-none"
      />
      <p className="text-xs text-ink-muted mt-2 text-center">
        Drag inside the box to move · drag a corner to resize · drag outside to redraw
        {config.autoFit ? ` · auto-fit ${Math.round(fitSize)}px` : ""}
      </p>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

interface Px {
  x: number;
  y: number;
  width: number;
  height: number;
}

function boxPx(size: { w: number; h: number }, box: LabelBox): Px {
  return {
    x: (size.w * box.xPercent) / 100,
    y: (size.h * box.yPercent) / 100,
    width: (size.w * box.widthPercent) / 100,
    height: (size.h * box.heightPercent) / 100,
  };
}

function pixelsToBox(size: { w: number; h: number }, px: Px): LabelBox {
  return {
    xPercent: clamp((px.x / size.w) * 100, 0, 100),
    yPercent: clamp((px.y / size.h) * 100, 0, 100),
    widthPercent: clamp((px.width / size.w) * 100, 0.5, 100),
    heightPercent: clamp((px.height / size.h) * 100, 0.5, 100),
  };
}

function drawBoxOverlay(
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  box: LabelBox,
) {
  const b = boxPx(size, box);
  ctx.save();
  // Dim everything outside the box very lightly so the box pops without
  // obscuring the bottle.
  ctx.strokeStyle = "rgba(217, 145, 25, 0.95)"; // brand gold
  ctx.lineWidth = Math.max(2, size.w * 0.003);
  ctx.setLineDash([size.w * 0.012, size.w * 0.008]);
  ctx.strokeRect(b.x, b.y, b.width, b.height);
  ctx.setLineDash([]);
  // Corner handles
  const handle = Math.max(6, size.w * 0.008);
  ctx.fillStyle = "rgba(217, 145, 25, 1)";
  for (const [hx, hy] of [
    [b.x, b.y],
    [b.x + b.width, b.y],
    [b.x, b.y + b.height],
    [b.x + b.width, b.y + b.height],
  ] as const) {
    ctx.beginPath();
    ctx.arc(hx, hy, handle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
