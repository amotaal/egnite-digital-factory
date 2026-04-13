import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getAllDocuments } from "@/lib/storage";
import { TEMPLATES } from "@/lib/data/templates";
import { NewDocumentButton } from "./new-document-button";
import { DocumentCard } from "./document-card";

export const metadata = { title: "Dashboard — Egnite Digital Factory" };

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await resolveSession(token);
  if (!user) redirect("/login");

  const allDocs = await getAllDocuments();

  const templateIcons: Record<string, string> = {
    "recipe-card": "🍽️",
    "infographic-card": "📊",
    "beverage-card": "🥤",
    "extended-recipe": "📖",
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-ink">
          Welcome, <span className="text-gold">{user.name.en}</span>
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Create, edit, and export branded recipe cards and guides.
        </p>
      </div>

      {/* ── New Document ──────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gold inline-block" />
          Start a New Document
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-gold-light/50 overflow-hidden shadow-sm hover:shadow-md hover:border-gold/40 transition-all group"
            >
              {/* Template thumbnail */}
              <div
                className="h-36 bg-gradient-to-br from-cream to-gold-light/40 flex items-center justify-center border-b border-gold-light/40"
                style={{ position: "relative" }}
              >
                <span className="text-6xl opacity-60 group-hover:opacity-90 transition-opacity">
                  {templateIcons[template.id] ?? "📄"}
                </span>
                <div className="absolute top-2 end-2 bg-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {template.dimensions.orientation}
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-base text-ink">{template.name.en}</h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed line-clamp-2">
                    {template.description.en}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                  <span className="bg-cream-dark rounded px-2 py-0.5 font-medium">
                    {template.dimensions.width} × {template.dimensions.height}px
                  </span>
                  <span className="bg-cream-dark rounded px-2 py-0.5 font-medium">A4</span>
                </div>
                <NewDocumentButton templateType={template.id} templateName={template.name.en} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Documents ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gold inline-block" />
          All Documents
          <span className="text-xs font-normal text-ink-muted">({allDocs.length})</span>
        </h2>

        {allDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gold-light/50 p-12 text-center">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-ink-muted text-sm">
              No documents yet. Start by creating one from a template above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
