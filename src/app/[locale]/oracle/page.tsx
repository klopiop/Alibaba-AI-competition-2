"use client";

import OracleClient from "@/components/OracleClient";
import { getDictionary, type Locale } from "@/lib/i18n";
import { use } from "react";

export default function OraclePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const resolvedParams = use(params);
  const dict = getDictionary(resolvedParams.locale);
  
  return <OracleClient locale={resolvedParams.locale} dict={dict} />;
}
