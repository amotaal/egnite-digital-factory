import { promises as fs } from "fs";
import path from "path";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getJob } from "@/lib/jobs";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });
  const user = await resolveSession(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await ctx.params;
  const job = getJob(id);
  if (!job || job.kind !== "labeler") {
    return new Response("Not Found", { status: 404 });
  }
  if (job.status !== "done") {
    return new Response("Job not ready", { status: 409 });
  }

  const zipPath = path.join(job.dir, "output.zip");
  const stat = await fs.stat(zipPath).catch(() => null);
  if (!stat) return new Response("Zip missing", { status: 410 });

  const nodeStream = createReadStream(zipPath);
  // Node streams are async iterables — Response accepts a ReadableStream
  // wrapper around them.
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;

  const filename = `labels-${id.slice(0, 8)}.zip`;
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
