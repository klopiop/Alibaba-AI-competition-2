"use client";

import Link from "next/link";

import LocaleSwitch from "@/components/LocaleSwitch";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function PrimaryNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  // 用户认证已禁用（用于比赛展示）
  // const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);

  // useEffect(() => {
  //   setUser(getCurrentUser());
  // }, []);

  // const isAdmin = user?.role === "ADMIN";

  // const handleLogout = () => {
  //   logout();
  //   setUser(null);
  //   window.location.href = `/${locale}`;
  // };

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-6 py-6 md:px-12">
      {/* 左侧 Logo */}
      <div className="flex w-1/3 items-center justify-start gap-3 text-sm font-semibold tracking-[0.3em] text-gold-soft">
        <span className="h-2 w-2 rounded-full bg-gold-strong shadow-[0_0_20px_rgba(246,211,139,0.5)]" />
        玄策
      </div>

      {/* 中间导航 - 绝对居中 */}
      <nav className="hidden w-1/3 items-center justify-center gap-8 text-sm text-zinc-300 md:flex">
        <Link className="transition hover:text-gold-strong hover:scale-110" href={`/${locale}`}>
          {dict.nav.home}
        </Link>
        <Link className="transition hover:text-gold-strong hover:scale-110" href={`/${locale}/oracle`}>
          {dict.nav.oracle}
        </Link>
        <Link className="transition hover:text-gold-strong hover:scale-110" href={`/${locale}/tcm`}>
          {dict.nav.tcm}
        </Link>
        <Link className="transition hover:text-gold-strong hover:scale-110" href={`/${locale}/history`}>
          {dict.nav.history}
        </Link>
        {/* {isAdmin && (
          <Link className="transition hover:text-gold-strong hover:scale-110" href={`/${locale}/admin`}>
            {dict.nav.admin}
          </Link>
        )} */}
      </nav>

      {/* 右侧操作区 */}
      <div className="flex w-1/3 items-center justify-end gap-3">
        {/* 登录注册功能已禁用（用于比赛展示） */}
        {/* {!user && (
          <>
            <Link
              className="rounded-full border border-gold-muted/40 px-4 py-2 text-xs text-gold-soft transition hover:border-gold-soft/70 hover:text-gold-strong"
              href={`/${locale}/auth/login`}
            >
              {dict.nav.login}
            </Link>
            <Link
              className="rounded-full border border-gold-soft/40 px-4 py-2 text-xs text-gold-strong transition hover:border-gold-soft/70"
              href={`/${locale}/auth/register`}
            >
              {dict.nav.register}
            </Link>
          </>
        )}
        {user && (
          <>
            <span className="hidden text-xs text-zinc-400 md:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-gold-muted/40 px-3 py-1 text-xs text-gold-soft transition hover:border-gold-soft/70 hover:text-gold-strong"
            >
              {locale === "zh" ? "登出" : "Logout"}
            </button>
          </>
        )} */}
        <LocaleSwitch locale={locale} />
      </div>
    </header>
  );
}
