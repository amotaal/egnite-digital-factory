import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getAllAssets, createAsset } from "@/lib/storage";
import type { AssetCategory } from "@/lib/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const assets = await getAllAssets();
    return Response.json({ assets });
  } catch (err) {
    console.error("Asset list error:", err);
    return Response.json({ error: "Failed to load assets", code: "INTERNAL" }, { status: 500 });
  }
}

const VALID_CATEGORIES: AssetCategory[] = ["image", "icon", "pattern", "logo", "other"];

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await resolveSession(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, category, tags, url, icon, thumbnailUrl } = body as {
      name?: { en?: string; ar?: string };
      category?: string;
      tags?: unknown;
      url?: string;
      icon?: string;
      thumbnailUrl?: string;
    };

    if (!name?.en?.trim()) {
      return Response.json({ error: "English name is required", code: "VALIDATION" }, { status: 400 });
    }
    if (!category || !VALID_CATEGORIES.includes(category as AssetCategory)) {
      return Response.json(
        { error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`, code: "VALIDATION" },
        { status: 400 }
      );
    }
    if (category !== "icon" && !url?.trim()) {
      return Response.json({ error: "Image URL is required", code: "VALIDATION" }, { status: 400 });
    }

    const asset = await createAsset({
      name: { en: name.en.trim(), ar: (name.ar ?? "").trim() },
      category: category as AssetCategory,
      tags: Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : [],
      url: url ?? "",
      icon: icon?.trim() || undefined,
      thumbnailUrl: thumbnailUrl?.trim() || undefined,
      createdBy: user.id,
    });

    return Response.json({ asset }, { status: 201 });
  } catch (err) {
    console.error("Asset create error:", err);
    return Response.json({ error: "Failed to create asset", code: "INTERNAL" }, { status: 500 });
  }
}
