"use client";
import type { LabelerConfig, TextAlign } from "../types";

interface ConfigPanelProps {
  config: LabelerConfig;
  onChange: (config: LabelerConfig) => void;
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const set = <K extends keyof LabelerConfig>(key: K, value: LabelerConfig[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <Range
        label="Horizontal position"
        suffix="%"
        min={0}
        max={100}
        step={0.5}
        value={config.xPercent}
        onChange={(v) => set("xPercent", v)}
      />
      <Range
        label="Vertical position"
        suffix="%"
        min={0}
        max={100}
        step={0.5}
        value={config.yPercent}
        onChange={(v) => set("yPercent", v)}
      />
      <Range
        label="Max width"
        suffix="%"
        min={5}
        max={100}
        step={1}
        value={config.maxWidthPercent}
        onChange={(v) => set("maxWidthPercent", v)}
      />
      <Range
        label="Font size"
        suffix="px"
        min={6}
        max={400}
        step={1}
        value={config.fontSize}
        onChange={(v) => set("fontSize", v)}
      />
      <Range
        label="Letter spacing"
        suffix="px"
        min={-10}
        max={50}
        step={0.5}
        value={config.letterSpacing}
        onChange={(v) => set("letterSpacing", v)}
      />

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Color</span>
          <input
            type="color"
            value={config.color}
            onChange={(e) => set("color", e.target.value)}
            className="h-9 w-full rounded-lg border border-gold-light bg-white cursor-pointer"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Weight</span>
          <select
            value={config.fontWeight}
            onChange={(e) =>
              set("fontWeight", e.target.value === "bold" ? "bold" : "normal")
            }
            className="h-9 px-2 rounded-lg border border-gold-light bg-white text-sm"
          >
            <option value="normal">Regular</option>
            <option value="bold">Bold</option>
          </select>
        </label>
      </div>

      <div>
        <p className="text-sm font-medium text-ink mb-1.5">Alignment</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(["left", "center", "right"] as TextAlign[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => set("align", a)}
              className={`text-xs font-medium capitalize px-2 py-1.5 rounded-lg border transition-colors ${
                config.align === a
                  ? "bg-gold text-white border-gold"
                  : "bg-cream border-gold-light text-ink-muted hover:bg-cream-dark"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={config.uppercase}
          onChange={(e) => set("uppercase", e.target.checked)}
          className="size-4 rounded border-gold-light accent-gold"
        />
        <span className="text-ink">Uppercase text</span>
      </label>
    </div>
  );
}

interface RangeProps {
  label: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

function Range({ label, suffix, min, max, step, value, onChange }: RangeProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-xs text-ink-muted font-mono tabular-nums">
          {value}
          {suffix ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold"
      />
    </div>
  );
}
