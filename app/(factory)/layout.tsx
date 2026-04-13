import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveSession, SESSION_COOKIE } from "@/lib/auth";
import { AppHeader } from "@/components/layout/app-header";

export default async function FactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const user = await resolveSession(token);
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F3EE]">
      <AppHeader user={user} />
      {children}
    </div>
  );
}
