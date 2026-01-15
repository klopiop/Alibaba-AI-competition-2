"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, use } from "react";

import { getDictionary, type Locale } from "@/lib/i18n";
import { register, login } from "@/lib/api";

export default function RegisterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const resolvedParams = use(params);
  const dict = getDictionary(resolvedParams.locale);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await register({ email, password });
      await login({ email, password });
      router.push(`/${resolvedParams.locale}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-[28px] border border-gold-muted/40 bg-black/70 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-gold-strong">
          {dict.auth.titleRegister}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {resolvedParams.locale === "zh"
            ? "创建身份，以便记录问诊历史。"
            : "Create an account to store your sessions."}
        </p>
      </div>
      <div className="space-y-4">
        <input
          className="w-full rounded-full border border-gold-muted/40 bg-black/60 px-4 py-3 text-sm text-zinc-200"
          placeholder={dict.auth.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-full border border-gold-muted/40 bg-black/60 px-4 py-3 text-sm text-zinc-200"
          placeholder={dict.auth.password}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="text-xs text-rose-300">{error}</p>}
        <button
          className="w-full rounded-full border border-gold-soft/60 bg-gold-soft/15 px-6 py-3 text-sm font-semibold text-gold-strong"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? dict.common.loading : dict.auth.submit}
        </button>
      </div>
      <Link
        className="text-xs text-gold-soft hover:text-gold-strong"
        href={`/${resolvedParams.locale}/auth/login`}
      >
        {dict.auth.switchToLogin}
      </Link>
    </div>
  );
}
