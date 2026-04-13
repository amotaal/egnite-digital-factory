import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { saveUpload } from "@/lib/storage";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid multipart body", code: "BAD_FORM" }, { status: 400 });
  }
  const file = formData.get("file") as File | null;
  if (!file) {
    return Response.json({ error: "No file provided", code: "MISSING_FILE" }, { status: 400 });
  }

  const MAX_BYTES = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File must be under 5MB", code: "FILE_TOO_LARGE" }, { status: 413 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP, GIF, and SVG are allowed", code: "BAD_MIME" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUpload(buffer, file.name);
    return Response.json({ url }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ error: "Failed to save upload", code: "INTERNAL" }, { status: 500 });
  }
}
