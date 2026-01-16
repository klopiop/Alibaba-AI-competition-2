"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api";

// 引入子组件
import OracleForm from "./Oracle/OracleForm";
import DivinationProcess from "./Oracle/DivinationProcess";
import InfoSidebar from "./Oracle/InfoSidebar";
import ChatPanel from "./ChatPanel";

type UserInfo = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "male" | "female";
};

type OracleClientProps = {
  locale: Locale;
  dict: any;
};

export default function OracleClient({ locale, dict }: OracleClientProps) {
  // 登录认证已禁用（用于比赛展示）
  // const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<"form" | "divination" | "chat">("form");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // useEffect(() => {
  //   setIsAuthenticated(!!getCurrentUser());
  //   setIsLoading(false);
  // }, []);

  // 登录检查已禁用（用于比赛展示）
  // if (isLoading) {
  //   return null; // 或者显示加载骨架屏
  // }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
  //       <h2 className="text-2xl font-serif text-gold-strong">
  //         {locale === "zh" ? "请先登录" : "Login Required"}
  //       </h2>
  //       <p className="max-w-md text-zinc-400">
  //         {locale === "zh" 
  //           ? "神机推演需要记录您的命盘信息，请先登录或注册账号。" 
  //           : "To cast a reading and save your chart, please login or create an account."}
  //       </p>
  //       <Link
  //         href={`/${locale}/auth/login?redirect=/${locale}/oracle`}
  //         className="rounded-full bg-gold-strong px-8 py-3 font-semibold text-black transition hover:scale-105"
  //       >
  //         {locale === "zh" ? "前往登录" : "Go to Login"}
  //       </Link>
  //     </div>
  //   );
  // }

  // 2. 处理表单提交
  const handleFormSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setStep("divination");
  };

  // 3. 处理推演完成
  const handleDivinationComplete = () => {
    setStep("chat");
  };

  // 4. 处理编辑信息
  const handleEdit = () => {
    setStep("form");
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AnimatePresence mode="wait">
        
        {/* 步骤 1: 输入生辰八字 */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <OracleForm locale={locale} onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {/* 步骤 2: 卜卦推演动画 */}
        {step === "divination" && (
           <motion.div
            key="divination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[60vh] items-center justify-center"
          >
            <DivinationProcess locale={locale} onComplete={handleDivinationComplete} />
          </motion.div>
        )}

        {/* 步骤 3: 对话界面 (带侧边栏) */}
        {step === "chat" && userInfo && (
          <motion.div
             key="chat"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col gap-8 md:flex-row"
          >
            {/* 左侧信息看板 */}
            <motion.div 
               className="md:sticky md:top-24 h-fit"
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: "auto", opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
            >
               <InfoSidebar locale={locale} info={userInfo} onEdit={handleEdit} />
            </motion.div>

            {/* 右侧对话框 */}
            <div className="flex-1">
               <ChatPanel
                  locale={locale}
                  title={dict.oracle.title}
                  subtitle={dict.oracle.subtitle}
                  placeholder={dict.oracle.placeholder}
                  systemHint={dict.oracle.systemHint + `\n\nUser Info: Name: ${userInfo.name}, Gender: ${userInfo.gender}, Birth: ${userInfo.birthDate} ${userInfo.birthTime}`}
                  type="oracle"
               />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
