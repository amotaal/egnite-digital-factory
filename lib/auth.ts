import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { User } from "./types";
export { SESSION_COOKIE } from "./constants";

// ─── Hardcoded users — change passwords in production! ───────────────────────
const USERS: Array<User & { password: string }> = [
  {
    id: "1",
    username: "admin",
    password: "egnite2024",
    name: { en: "Admin", ar: "مدير" },
    role: "admin",
  },
  {
    id: "2",
    username: "editor",
    password: "creative2024",
    name: { en: "Editor", ar: "محرر" },
    role: "editor",
  },
];

// ─── Session persistence ──────────────────────────────────────────────────────
const SESSIONS_FILE = path.join(
  process.env.DATA_DIR || path.join(process.cwd(), "data"),
  "sessions.json"
);

interface Session {
  userId: string;
  expiresAt: number;
}
type SessionStore = Record<string, Session>;

// In-memory cache so we're not hitting the disk on every request.
// Stored on globalThis so Next.js HMR and React Server Component module
// re-evaluation don't wipe it between requests in dev.
interface EfSessionGlobals {
  cache: SessionStore | null;
  writeQueue: Promise<void>;
}
const globalKey = "__efSessions" as const;
function getGlobals(): EfSessionGlobals {
  const g = globalThis as unknown as Record<string, EfSessionGlobals | undefined>;
  if (!g[globalKey]) {
    g[globalKey] = { cache: null, writeQueue: Promise.resolve() };
  }
  return g[globalKey]!;
}

async function loadSessions(): Promise<SessionStore> {
  const globals = getGlobals();
  if (globals.cache !== null) return globals.cache;
  let store: SessionStore;
  try {
    const raw = await fs.readFile(SESSIONS_FILE, "utf-8");
    store = JSON.parse(raw) as SessionStore;
  } catch {
    store = {};
  }
  // Prune expired sessions on load
  const now = Date.now();
  for (const token of Object.keys(store)) {
    if (store[token].expiresAt < now) delete store[token];
  }
  globals.cache = store;
  return store;
}

async function persistSessions(store: SessionStore): Promise<void> {
  const globals = getGlobals();
  // Serialize writes so concurrent createSession/deleteSession calls don't
  // clobber each other on disk.
  globals.writeQueue = globals.writeQueue
    .catch(() => undefined)
    .then(async () => {
      await fs.mkdir(path.dirname(SESSIONS_FILE), { recursive: true });
      await fs.writeFile(SESSIONS_FILE, JSON.stringify(store, null, 2));
    });
  await globals.writeQueue;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function findUser(username: string, password: string): User | null {
  const match = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!match) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safe } = match;
  return safe;
}

export function getUserById(id: string): User | null {
  const match = USERS.find((u) => u.id === id);
  if (!match) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safe } = match;
  return safe;
}

export async function createSession(userId: string): Promise<string> {
  const store = await loadSessions();
  const token = randomUUID();
  store[token] = { userId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  getGlobals().cache = store;
  await persistSessions(store);
  return token;
}

export async function resolveSession(token: string): Promise<User | null> {
  const store = await loadSessions();
  const session = store[token];
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    delete store[token];
    getGlobals().cache = store;
    await persistSessions(store);
    return null;
  }
  return getUserById(session.userId);
}

export async function deleteSession(token: string): Promise<void> {
  const store = await loadSessions();
  delete store[token];
  getGlobals().cache = store;
  await persistSessions(store);
}

