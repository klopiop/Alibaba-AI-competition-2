"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type { Locale } from "@/lib/i18n";

type UserInfo = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "male" | "female";
};

type OracleFormProps = {
  locale: Locale;
  onSubmit: (info: UserInfo) => void;
};

export default function OracleForm({ locale, onSubmit }: OracleFormProps) {
  const [info, setInfo] = useState<UserInfo>({
    name: "",
    birthDate: "",
    birthTime: "",
    gender: "male",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.name && info.birthDate && info.birthTime) {
      onSubmit(info);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg space-y-8 rounded-[32px] border border-gold-muted/30 bg-black/60 p-8 md:p-12 backdrop-blur-sm"
    >
      <div className="text-center">
        <h2 className="font-serif text-3xl font-medium text-gold-strong">
          {locale === "zh" ? "生辰八字" : "Birth Details"}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {locale === "zh"
            ? "请输入您的生辰信息，以便神机推演。"
            : "Please enter your birth details for the oracle reading."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 姓名 */}
        <div className="space-y-2">
          <label className="text-xs text-gold-muted uppercase tracking-wider">
            {locale === "zh" ? "姓名 / Name" : "Name"}
          </label>
          <input
            name="name"
            value={info.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gold-muted/20 bg-black/40 px-4 py-3 text-zinc-200 outline-none focus:border-gold-strong/50 transition-colors"
            placeholder={locale === "zh" ? "请输入姓名" : "Enter your name"}
            required
          />
        </div>

        {/* 性别 */}
        <div className="space-y-2">
          <label className="text-xs text-gold-muted uppercase tracking-wider">
            {locale === "zh" ? "性别 / Gender" : "Gender"}
          </label>
          <div className="flex gap-4">
             <label className="flex-1 cursor-pointer">
               <input 
                 type="radio" 
                 name="gender" 
                 value="male" 
                 checked={info.gender === "male"} 
                 onChange={handleChange}
                 className="peer hidden"
               />
               <div className="rounded-xl border border-gold-muted/20 bg-black/40 px-4 py-3 text-center text-zinc-400 peer-checked:border-gold-strong peer-checked:text-gold-strong peer-checked:bg-gold-strong/10 transition-all">
                 {locale === "zh" ? "男" : "Male"}
               </div>
             </label>
             <label className="flex-1 cursor-pointer">
               <input 
                 type="radio" 
                 name="gender" 
                 value="female" 
                 checked={info.gender === "female"} 
                 onChange={handleChange}
                 className="peer hidden"
               />
               <div className="rounded-xl border border-gold-muted/20 bg-black/40 px-4 py-3 text-center text-zinc-400 peer-checked:border-gold-strong peer-checked:text-gold-strong peer-checked:bg-gold-strong/10 transition-all">
                 {locale === "zh" ? "女" : "Female"}
               </div>
             </label>
          </div>
        </div>

        {/* 日期和时间 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gold-muted uppercase tracking-wider">
              {locale === "zh" ? "出生日期" : "Date of Birth"}
            </label>
            <input
              type="date"
              name="birthDate"
              value={info.birthDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-gold-muted/20 bg-black/40 px-4 py-3 text-zinc-200 outline-none focus:border-gold-strong/50 transition-colors scheme-dark"
              required
            />
          </div>
          <div className="space-y-2">
             <label className="text-xs text-gold-muted uppercase tracking-wider">
              {locale === "zh" ? "出生时间" : "Time"}
            </label>
            <input
              type="time"
              name="birthTime"
              value={info.birthTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-gold-muted/20 bg-black/40 px-4 py-3 text-zinc-200 outline-none focus:border-gold-strong/50 transition-colors scheme-dark"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gold-strong py-4 font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {locale === "zh" ? "开始推演" : "Begin Divination"}
        </button>
      </form>
    </motion.div>
  );
}
