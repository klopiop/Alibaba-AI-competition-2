"use client";

import TcmClient from "@/components/TcmClient";
import { getDictionary, type Locale } from "@/lib/i18n";
import { use } from "react";

export default function TcmPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const resolvedParams = use(params);
  const dict = getDictionary(resolvedParams.locale);
  
  return <TcmClient locale={resolvedParams.locale} dict={dict} />;
}
