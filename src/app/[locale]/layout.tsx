import { use } from "react";
import { notFound } from "next/navigation";

import MysticBackground from "@/components/MysticBackground";
import PrimaryNav from "@/components/PrimaryNav";
import { locales, type Locale } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  return (
    <div className="relative min-h-screen bg-ink">
      <MysticBackground />
      <div className="relative z-10">
        <PrimaryNav locale={locale as Locale} />
        <main className="px-6 pb-24 md:px-12">{children}</main>
      </div>
    </div>
  );
}
