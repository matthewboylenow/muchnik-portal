"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Scale } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div
      className={`glass-card-static p-8 ${
        error ? "border-[var(--color-negative)]/30 shadow-[0_0_30px_rgba(248,113,113,0.1)]" : ""
      }`}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-manhattan)]/10 mb-4">
          <Scale className="w-6 h-6 text-[var(--color-manhattan)]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Muchnik Elder Law
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          SEO Intelligence Platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-manhattan)] focus:outline-none focus:ring-1 focus:ring-[var(--color-manhattan)]/50 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-manhattan)] focus:outline-none focus:ring-1 focus:ring-[var(--color-manhattan)]/50 transition-colors"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--color-negative)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-manhattan)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-manhattan)]/90 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
