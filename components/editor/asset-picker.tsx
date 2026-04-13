"use client";
import React, { useEffect, useState } from "react";
import { X, Search, Loader2, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Asset, AssetCategory } from "@/lib/types";

interface AssetPickerModalProps {
  onSelect: (asset: Asset) => void;
  onClose: () => void;
  /** Preferred category to filter by initially */
  category?: AssetCategory;
}

const CATEGORIES: { value: AssetCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "icon", label: "Icons" },
  { value: "image", label: "Images" },
  { value: "pattern", label: "Patterns" },
  { value: "logo", label: "Logos" },
];

export function AssetPickerModal({ onSelect, onClose, category }: AssetPickerModalProps) {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [filter, setFilter] = useState<AssetCategory | "all">(category ?? "all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.assets) setAssets(data.assets);
        else setError(data.error ?? "Failed to load assets");
      })
      .catch(() => !cancelled && setError("Network error"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Escape to close + focus trap basics
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = (assets ?? []).filter((a) => {
    if (filter !== "all" && a.category !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.name.en.toLowerCase().includes(q) ||
      a.name.ar.includes(query) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Asset library picker"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gold-light/50">
          <h2 className="text-lg font-bold text-ink flex-1">Asset Library</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-cream text-ink-muted"
            aria-label="Close asset picker"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-gold-light/40 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or tag…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 bg-cream rounded-lg p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  filter === c.value
                    ? "bg-gold text-white shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {assets === null && !error && (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="animate-spin text-gold" />
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          {assets !== null && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-ink-muted gap-2">
              <ImageOff size={28} />
              <p className="text-sm">
                No assets found.
                {assets.length === 0 && " Go to the Assets page to upload some."}
              </p>
            </div>
          )}
          {filtered.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className="group flex flex-col items-center gap-1.5 p-2 rounded-lg border border-transparent hover:border-gold hover:bg-cream transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <div className="w-full aspect-square rounded-lg bg-cream border border-gold-light/40 flex items-center justify-center overflow-hidden">
                    {asset.category === "icon" && asset.icon ? (
                      <span className="text-4xl">{asset.icon}</span>
                    ) : asset.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.thumbnailUrl ?? asset.url}
                        alt={asset.name.en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageOff size={20} className="text-ink-muted" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-ink truncate max-w-full">
                    {asset.name.en}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gold-light/40 flex justify-between items-center">
          <span className="text-xs text-ink-muted">
            {assets === null ? "" : `${filtered.length} of ${assets.length} assets`}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
