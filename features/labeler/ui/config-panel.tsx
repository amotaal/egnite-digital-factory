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
      <div className="grid grid-cols-2 gap-2 -mx-1">
        <Toggle
          label="Auto-fit size"
          hint="Longest flavor sets the size — every label matches."
          checked={config.autoFit}
          onChange={(v) => set("autoFit", v)}
        />
        <Toggle
          label="One word per line"
          hint='"Blueberry Passion" → 2 lines.'
          checked={config.oneWordPerLine}
          onChange={(v) => set("oneWordPerLine", v)}
        />
      </div>

      {!config.autoFit && (
        <Range
          label="Font size"
          suffix="px"
          min={6}
          max={400}
          step={1}
          value={config.fontSize}
          onChange={(v) => set("fontSize", v)}
        />
      )}

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

      <Toggle
        label="Uppercase text"
        checked={config.uppercase}
        onChange={(v) => set("uppercase", v)}
      />
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

interface ToggleProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ label, hint, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-start gap-2 text-sm cursor-pointer px-1 py-1.5 rounded-lg hover:bg-cream-dark/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 mt-0.5 rounded border-gold-light accent-gold"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-ink font-medium leading-tight">{label}</span>
        {hint && <span className="text-[11px] text-ink-muted leading-tight">{hint}</span>}
      </span>
    </label>
  );
}
