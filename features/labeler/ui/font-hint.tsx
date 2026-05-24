"use client";
import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

export function FontHint() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-gold-light/60 bg-cream/60 text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-ink-muted hover:text-ink"
      >
        <Info size={12} className="text-gold shrink-0" />
        <span>Which font file should I pick?</span>
        <ChevronDown
          size={12}
          className={`ms-auto transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-3 pb-2.5 pt-1 text-ink-muted leading-relaxed border-t border-gold-light/40">
          <p className="mb-1.5">
            <span className="text-ink font-semibold">Copperplate Gothic Std</span> ships
            in many weights — the number is the weight, the suffix is the glyph set.
          </p>
          <ul className="list-disc list-inside space-y-0.5 mb-1.5">
            <li>
              <span className="font-mono">29</span> Light · <span className="font-mono">30</span> Regular · <span className="font-mono">31</span> Bold · <span className="font-mono">32</span> Heavy · <span className="font-mono">33</span> Black
            </li>
            <li>
              <span className="font-mono">AB</span> = letters only ·{" "}
              <span className="font-mono">BC</span> = letters + numerals + punctuation
            </li>
          </ul>
          <p className="text-ink">
            Recommended: <span className="font-mono font-semibold">Copperplate-Gothic-Std-32-BC</span>{" "}
            for the brand &ldquo;Bold&rdquo; sample.{" "}
            <span className="font-mono font-semibold">Std-30-BC</span> for the Light sample.
            Prefer <span className="font-mono">BC</span> so flavor names with numerals
            (&ldquo;v.1&rdquo;, &ldquo;v.2&rdquo;) render correctly.
          </p>
        </div>
      )}
    </div>
  );
}
