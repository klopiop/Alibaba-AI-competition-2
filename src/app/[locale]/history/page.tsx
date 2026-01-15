import Link from "next/link";

import { prisma } from "@/lib/db";
import { getDictionary, type Locale } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";

export default async function HistoryPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = getDictionary(params.locale);
  const session = await requireUser(params.locale);
  const conversations = await prisma.conversation.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-gold-muted/40 bg-black/60 px-6 py-8">
        <h1 className="text-3xl font-semibold text-gold-strong">
          {dict.history.title}
        </h1>
      </div>
      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-gold-muted/30 bg-black/70 px-6 py-10 text-sm text-zinc-400">
          {dict.history.empty}
        </div>
      ) : (
        <div className="grid gap-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex flex-col gap-3 rounded-2xl border border-gold-muted/30 bg-black/70 px-6 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-sm text-gold-soft">
                  {conversation.type === "ORACLE" ? dict.nav.oracle : dict.nav.tcm}
                </div>
                <div className="text-lg text-zinc-200">
                  {conversation.title || "Mystic Session"}
                </div>
                <div className="text-xs text-zinc-500">
                  {conversation.createdAt.toLocaleString()}
                </div>
              </div>
              <Link
                className="rounded-full border border-gold-soft/50 px-5 py-2 text-xs text-gold-strong"
                href={`/${params.locale}/result/${conversation.id}`}
              >
                {dict.history.view}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
