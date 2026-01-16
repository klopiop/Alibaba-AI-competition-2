"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChatPanel from "./ChatPanel";
import type { Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/api";

type TcmClientProps = {
  locale: Locale;
  dict: any;
};

export default function TcmClient({ locale, dict }: TcmClientProps) {
  // 登录认证已禁用（用于比赛展示）
  // const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   setIsAuthenticated(!!getCurrentUser());
  //   setIsLoading(false);
  // }, []);

  // 登录检查已禁用（用于比赛展示）
  // if (isLoading) {
  //   return null; 
  // }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
  //       <h2 className="text-2xl font-serif text-gold-strong">
  //         {locale === "zh" ? "请先登录" : "Login Required"}
  //       </h2>
  //       <p className="max-w-md text-zinc-400">
  //         {locale === "zh" 
  //           ? "中医问诊需要建立健康档案，请先登录或注册账号。" 
  //           : "To start a TCM consultation and save your health records, please login."}
  //       </p>
  //       <Link
  //         href={`/${locale}/auth/login?redirect=/${locale}/tcm`}
  //         className="rounded-full bg-gold-strong px-8 py-3 font-semibold text-black transition hover:scale-105"
  //       >
  //         {locale === "zh" ? "前往登录" : "Go to Login"}
  //       </Link>
  //     </div>
  //   );
  // }

  // 已登录，显示对话框
  return (
    <ChatPanel
      locale={locale}
      title={dict.tcm.title}
      subtitle={dict.tcm.subtitle}
      placeholder={dict.tcm.placeholder}
      systemHint={dict.tcm.systemHint}
      type="tcm"
    />
  );
}
