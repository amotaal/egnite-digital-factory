"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FactoryDocument } from "@/lib/types";

const TEMPLATE_ICONS: Record<string, string> = {
  "recipe-card": "🍽️",
  "infographic-card": "📊",
  "beverage-card": "🥤",
  "extended-recipe": "📖",
};

const TEMPLATE_LABELS: Record<string, string> = {
  "recipe-card": "Recipe Card",
  "infographic-card": "Infographic",
  "beverage-card": "Beverage Guide",
  "extended-recipe": "Extended Recipe",
};

export function DocumentCard({ document }: { document: FactoryDocument }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${document.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDuplicating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: document.templateType,
          name: `${document.name} (Copy)`,
          fields: document.fields,
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDuplicating(false);
    }
  };

  const heroImage = (document.fields as unknown as Record<string, unknown>)?.heroImage as string | undefined;

  return (
    <div
      className="bg-white rounded-2xl border border-gold-light/50 overflow-hidden shadow-sm hover:shadow-md hover:border-gold/40 transition-all cursor-pointer group"
      onClick={() => router.push(`/editor/${document.id}`)}
    >
      {/* Thumbnail */}
      <div className="h-28 bg-gradient-to-br from-cream to-gold-light/30 flex items-center justify-center border-b border-gold-light/30 relative overflow-hidden">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt={document.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-50">
            {TEMPLATE_ICONS[document.templateType] ?? "📄"}
          </span>
        )}
        <Badge
          variant="gold"
          className="absolute top-2 end-2 text-[9px] uppercase tracking-wide"
        >
          {TEMPLATE_LABELS[document.templateType] ?? document.templateType}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-ink truncate">{document.name}</h3>
        <p className="text-[11px] text-ink-muted mt-0.5">
          {new Date(document.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/editor/${document.id}`);
          }}
        >
          <Edit2 size={12} />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 text-ink-muted hover:text-ink"
          loading={duplicating}
          title="Duplicate"
          onClick={handleDuplicate}
        >
          <Copy size={13} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
          loading={deleting}
          onClick={handleDelete}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
}
