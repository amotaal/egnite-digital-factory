import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { getAllAssets } from "@/lib/storage";
import { AssetsClient } from "./assets-client";

export const metadata = { title: "Assets — Egnite Digital Factory" };

export default async function AssetsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await resolveSession(token);
  if (!user) redirect("/login");

  const assets = await getAllAssets();

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <AssetsClient initialAssets={assets} userRole={user.role} />
    </main>
  );
}
