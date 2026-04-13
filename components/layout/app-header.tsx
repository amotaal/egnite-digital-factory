"use client";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Sparkles, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout — we still want to redirect
    }
    // Hard navigation — bypasses Router Cache so the new login page doesn't
    // reuse stale authenticated RSC payloads from the previous session.
    window.location.href = "/login";
  };

  return (
    <header className="h-14 bg-white border-b border-gold-light/60 flex items-center px-4 gap-3 sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-gold hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded px-1"
        aria-label="Egnite Digital Factory — Dashboard"
      >
        <Sparkles size={20} className="text-gold" />
        <span className="font-display font-extrabold text-2xl tracking-tight text-gold" style={{ letterSpacing: "-0.5px" }}>
          Egnite
        </span>
      </button>

      <div className="flex-1" />

      {/* Nav links */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard")}
        className={`gap-1.5 ${isActive("/dashboard") ? "bg-cream-dark text-ink" : ""}`}
        aria-current={isActive("/dashboard") ? "page" : undefined}
      >
        <LayoutDashboard size={16} />
        Dashboard
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/assets")}
        className={`gap-1.5 ${isActive("/assets") ? "bg-cream-dark text-ink" : ""}`}
        aria-current={isActive("/assets") ? "page" : undefined}
      >
        <FolderOpen size={16} />
        <span className="hidden sm:inline">Assets</span>
      </Button>

      {/* User + Logout */}
      <div className="flex items-center gap-3 border-s border-gold-light/60 ps-3">
        <span className="text-sm text-ink-muted hidden sm:block">
          {user.name.en}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
