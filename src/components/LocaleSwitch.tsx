"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  zh: "中",
  en: "EN",
};

export default function LocaleSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (nextLocale: Locale) => {
    if (!pathname) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${nextLocale}`);
      return;
    }
    segments[0] = nextLocale;
    router.push(`/${segments.join("/")}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-gold-muted/40 bg-black/40 px-2 py-1 text-xs text-gold-soft">
      {locales.map((item) => (
        <button
          key={item}
          onClick={() => handleSwitch(item)}
          className={`rounded-full px-2 py-1 transition ${
            locale === item
              ? "bg-gold-soft/20 text-gold-strong"
              : "text-gold-muted hover:text-gold-strong"
          }`}
          type="button"
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
