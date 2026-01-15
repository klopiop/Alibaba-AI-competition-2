"use client";

import { SessionProvider } from "next-auth/react";
import { authOptions } from "@/lib/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider session={null}>{children}</SessionProvider>;
}
