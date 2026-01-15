"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getDictionary, type Locale } from "@/lib/i18n";

interface User {
  id: string;
  email: string | null;
  role: string;
  createdAt: string;
  bannedAt: string | null;
}

interface AuditLog {
  id: string;
  action: string;
  message: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: { email: string | null } | null;
}

export default function AdminPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "zh";
  const dict = getDictionary(locale);

  const [users, setUsers] = useState<User[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 实现 API 调用获取数据
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gold-soft">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-gold-muted/40 bg-black/60 px-6 py-8">
        <h1 className="text-3xl font-semibold text-gold-strong">
          {dict.admin.title}
        </h1>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gold-strong">
            {dict.admin.users}
          </h2>
          <Link
            className="rounded-full border border-gold-soft/50 px-4 py-2 text-xs text-gold-strong"
            href="/api/admin/export"
            prefetch={false}
          >
            {dict.admin.export}
          </Link>
        </div>
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-zinc-500 text-sm">No users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-2xl border border-gold-muted/30 bg-black/70 px-6 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-sm text-gold-soft">{user.email}</div>
                  <div className="text-xs text-zinc-500">
                    {user.role} · {new Date(user.createdAt).toLocaleString()}
                  </div>
                  {user.bannedAt && (
                    <div className="text-xs text-rose-300">
                      Banned: {new Date(user.bannedAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <button
                  className="rounded-full border border-gold-soft/50 px-4 py-2 text-xs text-gold-strong"
                  onClick={() => {}}
                >
                  {user.bannedAt ? dict.admin.unban : dict.admin.ban}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gold-strong">
          {dict.admin.audits}
        </h2>
        <div className="space-y-3">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="rounded-2xl border border-gold-muted/30 bg-black/70 px-6 py-4 text-sm text-zinc-300"
            >
              <div className="text-gold-soft">{audit.action}</div>
              <div className="mt-1 text-xs text-zinc-500">
                {audit.actor?.email || "system"} · {new Date(audit.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {audit.ip} · {audit.userAgent}
              </div>
              <div className="mt-2 text-sm text-zinc-300">{audit.message}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
