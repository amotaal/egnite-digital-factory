"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DocumentCard } from "./document-card";
import type { FactoryDocument } from "@/lib/types";

type SortKey = "updated" | "created" | "name";
type FilterKey = "all" | "recipe-card" | "infographic-card" | "beverage-card" | "extended-recipe";

const FILTERS: { value: FilterKey; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "✨" },
  { value: "recipe-card", label: "Recipes", emoji: "🍽️" },
  { value: "infographic-card", label: "Infographics", emoji: "📊" },
  { value: "beverage-card", label: "Beverages", emoji: "🥤" },
  { value: "extended-recipe", label: "Extended", emoji: "📖" },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "name", label: "Name (A–Z)" },
];

export function DocumentsBrowser({ documents }: { documents: FactoryDocument[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const filtered = useMemo(() => {
    let list = [...documents];
    if (filter !== "all") list = list.filter((d) => d.templateType === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "created") {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return list;
  }, [documents, filter, query, sort]);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gold inline-block" />
          All Documents
          <span className="text-xs font-normal text-ink-muted">
            ({filtered.length}
            {filtered.length !== documents.length ? ` of ${documents.length}` : ""})
          </span>
        </h2>
      </div>

      {/* Controls */}
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            className="pl-9"
            aria-label="Search documents"
          />
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gold-light/60 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                filter === f.value
                  ? "bg-gold text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
              aria-pressed={filter === f.value}
            >
              <span>{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <SlidersHorizontal
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none bg-white border border-gold-light/60 rounded-lg pl-9 pr-8 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-gold/40"
            aria-label="Sort documents"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gold-light/50 p-12 text-center">
          <div className="text-5xl mb-4">🌟</div>
          <p className="text-ink-muted text-sm">
            No documents yet. Start by creating one from a template above.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gold-light/50 p-10 text-center">
          <p className="text-ink-muted text-sm">No documents match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </section>
  );
}
