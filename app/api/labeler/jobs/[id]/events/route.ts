import { cookies } from "next/headers";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getJob, subscribe, type Job } from "@/lib/jobs";

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

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const safeEnqueue = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };
      const finish = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed
        }
      };
      const send = (j: Job) => {
        const payload = {
          status: j.status,
          progress: j.progress,
          error: j.error,
        };
        safeEnqueue(`data: ${JSON.stringify(payload)}\n\n`);
        if (j.status === "done" || j.status === "failed") {
          safeEnqueue("event: end\ndata: {}\n\n");
          finish();
        }
      };

      send(job);
      const unsubscribe = subscribe(id, send);
      const heartbeat = setInterval(() => safeEnqueue(": ping\n\n"), 15000);
      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
