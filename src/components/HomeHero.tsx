"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { type Locale } from "@/lib/i18n";

interface HomeHeroProps {
  dict: any; // Using any to avoid complex type import for now, or I can define the shape
  locale: Locale;
}

export default function HomeHero({ dict, locale }: HomeHeroProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-100px)] flex-col items-center justify-center text-center">
      
      {/* Decorative vertical line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 96, opacity: 1 }} // 24 * 4 = 96px
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent to-gold-muted/30" 
      />

      {/* Main Content */}
      <div className="z-10 flex max-w-4xl flex-col items-center gap-10 px-4">
        
        {/* Mystic Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center gap-4 text-xs font-medium tracking-[0.6em] text-gold-muted uppercase"
        >
          <span className="h-[1px] w-8 bg-gold-muted/40" />
          Mystic Dao
          <span className="h-[1px] w-8 bg-gold-muted/40" />
        </motion.div>

        {/* Hero Title - 极简高级感重构 */}
        <div className="relative z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
            className="font-serif text-5xl font-medium leading-tight md:text-7xl lg:text-8xl tracking-widest whitespace-nowrap"
          >
            {/* 1. 主体：近乎白色的香槟金，极度克制 */}
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ede3d1] to-[#d6c4a0]"
              style={{
                // 仅保留极微弱的文字阴影，增加离底感，绝不发光
                textShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              {dict.hero.title}
            </span>
          </motion.h1>
          
          {/* 2. 装饰：极细的金色线条，穿插在文字周围或下方，增加精致度 */}
          <motion.div
             initial={{ scaleX: 0, opacity: 0 }}
             animate={{ scaleX: 1, opacity: 1 }}
             transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
             className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#d6c4a0] to-transparent opacity-50"
          />
        </div>

        {/* Poetic Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="max-w-2xl text-lg font-light leading-relaxed text-zinc-400 md:text-2xl text-balance"
        >
          {dict.hero.subtitle}
        </motion.p>

        {/* Action Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex flex-col items-center gap-6 sm:flex-row"
        >
          
          {/* Primary Action - Glowing */}
          <Link
            href={`/${locale}/oracle`}
            className="group relative flex items-center gap-3 rounded-full bg-gold-strong/10 px-10 py-4 text-lg font-medium text-gold-strong transition-all duration-500 hover:bg-gold-strong/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(246,211,139,0.3)] border border-gold-soft/20"
          >
            <span className="relative z-10">{dict.hero.ctaOracle}</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-full bg-gold-soft/5 blur-md" />
          </Link>

          {/* Secondary Action - Minimal */}
          <Link
            href={`/${locale}/tcm`}
            className="text-sm font-medium tracking-widest text-zinc-500 transition-colors hover:text-gold-soft uppercase"
          >
            {dict.hero.ctaTcm}
          </Link>
        </motion.div>
      </div>

      {/* Bottom decorative element */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="text-[10px] tracking-[0.2em] text-gold-muted">SCROLL</div>
        <div className="h-12 w-[1px] bg-gradient-to-b from-gold-muted/50 to-transparent" />
      </motion.div>
    </div>
  );
}
