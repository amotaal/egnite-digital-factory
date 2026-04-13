"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }
      // Hard navigation bypasses the Next.js Router Cache, which otherwise
      // can serve a stale server-component payload from a previous session.
      window.location.href = next;
    } catch {
      setError("Network error — please try again");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-ink">Welcome back</h2>
        <p className="text-sm text-ink-muted mt-0.5">Sign in to your workspace</p>
      </div>

      <Input
        label="Username"
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        required
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          className="absolute end-3 top-[30px] text-ink-muted hover:text-ink"
          tabIndex={-1}
        >
          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        Sign In
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #B78D4B 0, #B78D4B 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl border border-gold-light/50 overflow-hidden">
          {/* Header stripe */}
          <div className="bg-gold px-8 py-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={22} className="text-cream" />
              <span className="font-black text-2xl tracking-widest text-cream">EGNITE</span>
            </div>
            <p className="text-gold-light text-sm font-medium">Digital Factory</p>
          </div>

          {/* Form wrapped in Suspense for useSearchParams */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-gold" size={24} />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-ink-muted/60">
              Creativity with Confidence — Egnite Flavors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
