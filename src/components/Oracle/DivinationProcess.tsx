"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type DivinationProcessProps = {
  locale: Locale;
  onComplete: () => void;
};

export default function DivinationProcess({ locale, onComplete }: DivinationProcessProps) {
  const [step, setStep] = useState(0);

  const steps = locale === "zh" 
    ? ["观星定位...", "排盘演卦...", "推算运势...", "解析命理..."]
    : ["Aligning Stars...", "Casting Hexagrams...", "Calculating Destiny...", "Interpreting Fate..."];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 1500); // 每个步骤 1.5 秒
      return () => clearTimeout(timer);
    } else {
      // 完成后等待一下
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, steps.length, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 min-h-[400px]">
      {/* 卦象动画容器 */}
      <div className="relative h-48 w-48 flex items-center justify-center">
        {/* 外圈旋转 */}
        <motion.div
           className="absolute inset-0 rounded-full border-2 border-gold-muted/30 border-t-gold-strong"
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* 内圈反向旋转 */}
         <motion.div
           className="absolute inset-4 rounded-full border-2 border-gold-muted/30 border-b-gold-strong"
           animate={{ rotate: -360 }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* 中心八卦符号切换 */}
        <motion.div
           key={step}
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           className="text-6xl text-gold-strong font-serif"
        >
           {["☰", "☷", "☲", "☵", "☯"][Math.min(step, 4)]}
        </motion.div>
      </div>

      {/* 进度文字 */}
      <div className="space-y-2 text-center">
        <motion.h3
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-gold-strong tracking-[0.2em] font-medium"
        >
          {step < steps.length ? steps[step] : (locale === "zh" ? "完成" : "Complete")}
        </motion.h3>
        <div className="flex gap-2 justify-center mt-4">
           {steps.map((_, i) => (
             <motion.div
               key={i}
               className={`h-1 w-8 rounded-full ${i <= step ? "bg-gold-strong" : "bg-gold-muted/20"}`}
               layout
             />
           ))}
        </div>
      </div>
    </div>
  );
}
