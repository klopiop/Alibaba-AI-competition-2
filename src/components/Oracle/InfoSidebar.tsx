"use client";

import { Edit2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type UserInfo = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "male" | "female";
};

type InfoSidebarProps = {
  locale: Locale;
  info: UserInfo;
  onEdit: () => void;
};

export default function InfoSidebar({ locale, info, onEdit }: InfoSidebarProps) {
  return (
    <div className="w-full shrink-0 space-y-6 rounded-[24px] border border-gold-muted/20 bg-black/40 p-6 backdrop-blur-md md:w-64">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gold-muted">
          {locale === "zh" ? "命主信息" : "Subject"}
        </h3>
        <button
          onClick={onEdit}
          className="rounded-full p-2 text-gold-muted transition hover:bg-gold-soft/10 hover:text-gold-strong"
          title={locale === "zh" ? "修改信息" : "Edit Info"}
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500">{locale === "zh" ? "姓名" : "Name"}</label>
          <div className="font-serif text-lg text-gold-soft">{info.name}</div>
        </div>
        
        <div>
           <label className="text-xs text-zinc-500">{locale === "zh" ? "性别" : "Gender"}</label>
           <div className="text-sm text-zinc-300">
             {info.gender === "male" 
               ? (locale === "zh" ? "男" : "Male") 
               : (locale === "zh" ? "女" : "Female")}
           </div>
        </div>

        <div>
          <label className="text-xs text-zinc-500">{locale === "zh" ? "生辰" : "Birth Details"}</label>
          <div className="text-sm text-zinc-300 font-mono mt-1">
             <div>{info.birthDate}</div>
             <div>{info.birthTime}</div>
          </div>
        </div>

        {/* 装饰性八卦图 */}
        <div className="mt-4 flex justify-center opacity-20">
           <div className="h-24 w-24 rounded-full border border-gold-strong flex items-center justify-center text-4xl text-gold-strong">
             ☯
           </div>
        </div>
      </div>
    </div>
  );
}
