"use client";

import TaoistFlowBackground from "./TaoistFlowBackground";
import LuopanBackground from "./LuopanBackground";

export default function MysticBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep atmospheric base */}
      <div className="absolute inset-0 bg-ink" />
      
      {/* The Giant Rotating Compass (Luopan) - Background Layer */}
      <LuopanBackground />

      {/* Dynamic Spirit Writing (Golden Silk Talismans) - Foreground Layer */}
      {/* <TaoistFlowBackground /> */}

      {/* Ambient Lighting (Vignette & Glow) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,211,139,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(214,180,108,0.08),transparent_60%)]" />
    </div>
  );
}
