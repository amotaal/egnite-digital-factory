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

  const body = await request.json();
  const { templateType, name, fields } = body as {
    templateType: TemplateType;
    name: string;
    fields?: Record<string, unknown>;
  };

  if (!templateType) {
    return Response.json({ error: "templateType required" }, { status: 400 });
  }

  const template = getTemplate(templateType);
  if (!template) {
    return Response.json({ error: "Invalid template type" }, { status: 400 });
  }

  const doc = await createDocument({
    name: name || `Untitled ${template.name.en}`,
    templateType,
    fields: (fields as never) ?? template.defaultFields,
    createdBy: user.id,
  });

  return Response.json({ document: doc }, { status: 201 });
}
