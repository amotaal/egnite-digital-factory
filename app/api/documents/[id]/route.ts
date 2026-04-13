import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getDocument, updateDocument, deleteDocument } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await getDocument(id);
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ document: doc });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body", code: "BAD_JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Request body required", code: "BAD_REQUEST" }, { status: 400 });
  }
  try {
    const updated = await updateDocument(id, body as Record<string, unknown>);
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ document: updated });
  } catch (err) {
    console.error("Document update error:", err);
    return Response.json({ error: "Failed to update document", code: "INTERNAL" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await deleteDocument(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
