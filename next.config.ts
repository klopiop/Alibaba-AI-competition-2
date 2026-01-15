import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出模式，生成纯静态 HTML 到 out 目录
  output: 'export',

  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true,
  },

  // 排除 functions 目录
  outputFileTracingExcludes: {
    '*': ['./functions/**/*'],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;
