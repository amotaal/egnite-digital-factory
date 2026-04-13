import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getAllDocuments, createDocument } from "@/lib/storage";
import { getTemplate } from "@/lib/data/templates";
import type { TemplateType } from "@/lib/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const docs = await getAllDocuments();
  return Response.json({ documents: docs });
}

export async function POST(request: Request) {
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
  const { templateType, name, fields } = body as {
    templateType?: TemplateType;
    name?: string;
    fields?: Record<string, unknown>;
  };

  if (!templateType) {
    return Response.json({ error: "templateType required", code: "MISSING_FIELD" }, { status: 400 });
  }

  const template = getTemplate(templateType);
  if (!template) {
    return Response.json({ error: "Invalid template type", code: "INVALID_TEMPLATE" }, { status: 400 });
  }

  const trimmedName = typeof name === "string" ? name.trim().slice(0, 200) : "";

  try {
    const doc = await createDocument({
      name: trimmedName || `Untitled ${template.name.en}`,
      templateType,
      fields: (fields as never) ?? template.defaultFields,
      createdBy: user.id,
    });
    return Response.json({ document: doc }, { status: 201 });
  } catch (err) {
    console.error("Document create error:", err);
    return Response.json({ error: "Failed to create document", code: "INTERNAL" }, { status: 500 });
  }
}
