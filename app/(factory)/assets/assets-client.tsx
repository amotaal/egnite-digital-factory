"use client";
import { useState, useMemo } from "react";
import { Plus, Search, Trash2, Pencil, Upload, ImageOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import type { Asset, AssetCategory, UserRole } from "@/lib/types";

const CATEGORIES: { value: AssetCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "✨" },
  { value: "icon", label: "Icons", emoji: "🧪" },
  { value: "image", label: "Images", emoji: "🖼️" },
  { value: "pattern", label: "Patterns", emoji: "🎨" },
  { value: "logo", label: "Logos", emoji: "✦" },
  { value: "other", label: "Other", emoji: "📦" },
];

interface AssetsClientProps {
  initialAssets: Asset[];
  userRole: UserRole;
}

export function AssetsClient({ initialAssets, userRole }: AssetsClientProps) {
  const toast = useToast();
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AssetCategory | "all">("all");
  const [editing, setEditing] = useState<Asset | null>(null);
  const [creating, setCreating] = useState(false);

  const isAdmin = userRole === "admin";

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (filter !== "all" && a.category !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        a.name.en.toLowerCase().includes(q) ||
        a.name.ar.includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [assets, query, filter]);

  const handleDelete = async (asset: Asset) => {
    if (!confirm(`Delete "${asset.name.en}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/assets/${asset.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Delete failed");
      }
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      toast.success(`Deleted "${asset.name.en}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaved = (asset: Asset, isNew: boolean) => {
    setAssets((prev) => {
      if (isNew) return [asset, ...prev];
      return prev.map((a) => (a.id === asset.id ? asset : a));
    });
    toast.success(isNew ? "Asset created" : "Asset updated");
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-ink">Asset Library</h1>
          <p className="text-ink-muted mt-1 text-sm">
            Reusable icons, images, patterns, and logos shared across every template.
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => setCreating(true)} className="gap-2">
            <Plus size={16} /> New Asset
          </Button>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or tag…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gold-light/60 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                filter === c.value
                  ? "bg-gold text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gold-light/50 p-12 text-center">
          <ImageOff size={36} className="text-ink-muted mx-auto mb-3" />
          <p className="text-ink-muted text-sm">
            {assets.length === 0
              ? "No assets yet. Create your first reusable ingredient icon or brand image."
              : "No assets match your filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group bg-white rounded-xl border border-gold-light/50 overflow-hidden shadow-sm hover:shadow-md hover:border-gold/40 transition-all"
            >
              <div className="aspect-square bg-cream flex items-center justify-center overflow-hidden border-b border-gold-light/40">
                {asset.category === "icon" && asset.icon ? (
                  <span className="text-6xl">{asset.icon}</span>
                ) : asset.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.thumbnailUrl ?? asset.url}
                    alt={asset.name.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff size={24} className="text-ink-muted" />
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">{asset.name.en}</p>
                    {asset.name.ar && (
                      <p className="text-xs text-ink-muted text-right font-arabic truncate" dir="rtl">
                        {asset.name.ar}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold bg-gold-light/30 px-2 py-0.5 rounded-full">
                    {asset.category}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditing(asset)}
                        className="p-1 rounded hover:bg-cream text-ink-muted hover:text-ink"
                        aria-label={`Edit ${asset.name.en}`}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(asset)}
                        className="p-1 rounded hover:bg-red-50 text-ink-muted hover:text-red-600"
                        aria-label={`Delete ${asset.name.en}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/edit modal */}
      {(creating || editing) && (
        <AssetFormModal
          asset={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}

interface AssetFormModalProps {
  asset: Asset | null;
  onClose: () => void;
  onSaved: (asset: Asset, isNew: boolean) => void;
}

function AssetFormModal({ asset, onClose, onSaved }: AssetFormModalProps) {
  const toast = useToast();
  const [nameEn, setNameEn] = useState(asset?.name.en ?? "");
  const [nameAr, setNameAr] = useState(asset?.name.ar ?? "");
  const [category, setCategory] = useState<AssetCategory>(asset?.category ?? "icon");
  const [icon, setIcon] = useState(asset?.icon ?? "");
  const [url, setUrl] = useState(asset?.url ?? "");
  const [tags, setTags] = useState(asset?.tags.join(", ") ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setUrl(data.url);
      else setError(data.error ?? "Upload failed");
    } catch {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        name: { en: nameEn.trim(), ar: nameAr.trim() },
        category,
        icon: icon.trim() || undefined,
        url: url.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = asset
        ? await fetch(`/api/assets/${asset.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/assets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      onSaved(data.asset, !asset);
      onClose();
    } catch {
      setError("Network error");
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={asset ? "Edit asset" : "Create asset"}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-light/50">
          <h2 className="text-lg font-bold text-ink">
            {asset ? "Edit Asset" : "New Asset"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-cream text-ink-muted"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required autoFocus />
            <Input
              label="Name (AR)"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              dir="rtl"
              className="text-right font-arabic"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Category</label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value as AssetCategory)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    category === c.value
                      ? "bg-gold text-white border-gold"
                      : "border-gold-light text-ink-muted hover:bg-cream"
                  }`}
                >
                  <span className="text-lg">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {category === "icon" && (
            <Input
              label="Emoji / Icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🧈"
              className="text-2xl text-center"
              hint="Any emoji or short text (e.g. 🧈 for butter)"
            />
          )}

          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              Image {category === "icon" ? "(optional)" : ""}
            </label>
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt="preview"
                className="w-full h-32 object-cover rounded-lg border border-gold-light mb-2"
              />
            )}
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <span
                  className={`w-full inline-flex items-center justify-center gap-2 bg-cream border border-gold-light text-gold hover:bg-gold-light text-sm font-medium rounded-lg px-3 py-2 ${
                    uploading ? "opacity-50" : ""
                  }`}
                >
                  <Upload size={14} />
                  {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
                </span>
              </label>
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              hint="Or paste an image URL"
              className="text-xs mt-2"
            />
          </div>

          <Textarea
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. ingredient, dairy, baking"
            hint="Comma-separated. Used for search."
            className="min-h-[60px]"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {asset ? "Save changes" : "Create asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
