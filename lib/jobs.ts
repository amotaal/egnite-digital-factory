import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Generic ephemeral job registry. Designed for batch features (labeler today,
 * future batch generators tomorrow) where each job has a working directory on
 * disk, a progress state in memory, and is reaped after the user confirms
 * download or after it goes stale.
 *
 * In-memory state is the source of truth for `progress`. Disk holds the
 * inputs / outputs / zip.
 */

export type JobStatus = "queued" | "running" | "done" | "failed";

export interface JobProgress {
  done: number;
  total: number;
  current?: string;
  errors: string[];
}

export interface Job<TMeta = unknown> {
  id: string;
  kind: string;
  status: JobStatus;
  progress: JobProgress;
  meta: TMeta;
  createdAt: number;
  updatedAt: number;
  /** Absolute path to the job's working directory. */
  dir: string;
  /** Error message if status === "failed". */
  error?: string;
}

type Listener = (job: Job) => void;

interface JobGlobals {
  jobs: Map<string, Job>;
  listeners: Map<string, Set<Listener>>;
  sweeperStarted: boolean;
}

// Computed at first use rather than at module-eval time so Turbopack's
// file-trace doesn't try to walk the whole project when it sees process.cwd().
let _jobsRoot: string | null = null;
function jobsRoot(): string {
  if (_jobsRoot) return _jobsRoot;
  if (process.env.JOBS_DIR) {
    _jobsRoot = process.env.JOBS_DIR;
  } else {
    const dataDir =
      process.env.DATA_DIR ||
      path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
    _jobsRoot = path.join(dataDir, "jobs");
  }
  return _jobsRoot;
}

const STALE_AFTER_MS = 60 * 60 * 1000; // 1 hour
const SWEEP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const GLOBAL_KEY = "__efJobs" as const;
function getGlobals(): JobGlobals {
  const g = globalThis as unknown as Record<string, JobGlobals | undefined>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      jobs: new Map(),
      listeners: new Map(),
      sweeperStarted: false,
    };
  }
  return g[GLOBAL_KEY]!;
}

function startSweeper() {
  const globals = getGlobals();
  if (globals.sweeperStarted) return;
  globals.sweeperStarted = true;
  setInterval(() => {
    void sweep();
  }, SWEEP_INTERVAL_MS).unref?.();
}

async function sweep() {
  const globals = getGlobals();
  const cutoff = Date.now() - STALE_AFTER_MS;
  for (const [id, job] of globals.jobs) {
    if (job.updatedAt < cutoff) {
      await deleteJob(id).catch(() => undefined);
    }
  }
  // Also reap any orphan dirs on disk
  try {
    const entries = await fs.readdir(jobsRoot(), { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (globals.jobs.has(entry.name)) continue;
      const dir = path.join(jobsRoot(), entry.name);
      const stat = await fs.stat(dir).catch(() => null);
      if (stat && stat.mtimeMs < cutoff) {
        await fs.rm(dir, { recursive: true, force: true }).catch(() => undefined);
      }
    }
  } catch {
    // Root dir may not exist yet
  }
}

export async function createJob<TMeta>(
  kind: string,
  meta: TMeta,
  total: number,
): Promise<Job<TMeta>> {
  startSweeper();
  await fs.mkdir(jobsRoot(), { recursive: true });
  const id = randomUUID();
  const dir = path.join(jobsRoot(), id);
  await fs.mkdir(dir, { recursive: true });
  const now = Date.now();
  const job: Job<TMeta> = {
    id,
    kind,
    status: "queued",
    progress: { done: 0, total, errors: [] },
    meta,
    createdAt: now,
    updatedAt: now,
    dir,
  };
  getGlobals().jobs.set(id, job as Job);
  return job;
}

export function getJob<TMeta = unknown>(id: string): Job<TMeta> | null {
  return (getGlobals().jobs.get(id) as Job<TMeta> | undefined) ?? null;
}

export function updateJob(
  id: string,
  patch: Partial<Pick<Job, "status" | "error">> & {
    progress?: Partial<JobProgress>;
  },
): Job | null {
  const job = getGlobals().jobs.get(id);
  if (!job) return null;
  if (patch.status) job.status = patch.status;
  if (patch.error !== undefined) job.error = patch.error;
  if (patch.progress) {
    job.progress = { ...job.progress, ...patch.progress };
  }
  job.updatedAt = Date.now();
  notify(job);
  return job;
}

export async function deleteJob(id: string): Promise<boolean> {
  const globals = getGlobals();
  const job = globals.jobs.get(id);
  if (job) {
    await fs.rm(job.dir, { recursive: true, force: true }).catch(() => undefined);
  } else {
    // Try to delete the dir anyway
    await fs
      .rm(path.join(jobsRoot(), id), { recursive: true, force: true })
      .catch(() => undefined);
  }
  globals.jobs.delete(id);
  const listeners = globals.listeners.get(id);
  if (listeners) {
    globals.listeners.delete(id);
  }
  return true;
}

export function subscribe(id: string, listener: Listener): () => void {
  const globals = getGlobals();
  let set = globals.listeners.get(id);
  if (!set) {
    set = new Set();
    globals.listeners.set(id, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) globals.listeners.delete(id);
  };
}

function notify(job: Job) {
  const set = getGlobals().listeners.get(job.id);
  if (!set) return;
  for (const listener of set) {
    try {
      listener(job);
    } catch {
      // Listener errors must not affect job progress
    }
  }
}
