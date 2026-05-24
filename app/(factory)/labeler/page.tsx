import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { ESSENCES } from "@/lib/data/essences";
import { LabelerStudio } from "@/features/labeler/ui/labeler-studio";

export const metadata = { title: "Labeler — Egnite Digital Factory" };

export default async function LabelerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await resolveSession(token);
  if (!user) redirect("/login");

  const essenceFlavors = ESSENCES.map((e) => e.flavor);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">
          <span className="text-gold">Labeler</span>
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Batch-generate labeled bottle images. Upload a blank bottle, a font, and a
          list of flavors — download the rendered set as a zip.
        </p>
      </div>
      <LabelerStudio essenceFlavors={essenceFlavors} />
    </main>
  );
}
