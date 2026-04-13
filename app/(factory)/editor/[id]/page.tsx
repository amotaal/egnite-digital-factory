import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getDocument } from "@/lib/storage";
import { EditorShell } from "@/components/editor/editor-shell";
import { EditorErrorBoundary } from "@/components/ui/error-boundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocument(id);
  return {
    title: doc ? `${doc.name} — Egnite Digital Factory` : "Editor — Egnite Digital Factory",
  };
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await resolveSession(token);
  if (!user) redirect("/login");

  const doc = await getDocument(id);
  if (!doc) notFound();

  return (
    <EditorErrorBoundary>
      <EditorShell initialDocument={doc} />
    </EditorErrorBoundary>
  );
}
