# 阿里云 ESA Pages + 函数计算 混合部署方案

## 📋 项目概述

本项目已配置为支持阿里云 ESA Pages（静态前端）+ 函数计算（后端 API）的混合部署架构。

## 🏗️ 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                     用户请求                              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              ESA Pages (静态前端)                      │
│  - Next.js 静态导出                                      │
│  - HTML/CSS/JS 全球边缘分发                              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│         阿里云函数计算 (后端 API)                     │
│  - /api/auth/* - 认证 API                                │
│  - /api/chat - Chat API                                   │
│  - /api/admin/* - 管理 API                                │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│          阿里云 RDS MySQL (数据库)                     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 项目结构

```
.
├── docs/
│   └── ESA_DEPLOYMENT_GUIDE.md    # 详细部署指南
├── functions/                        # 函数计算后端代码
│   ├── src/
│   │   ├── chat/
│   │   │   └── index.ts          # Chat API
│   │   ├── auth/
│   │   │   ├── login.ts          # 登录 API
│   │   │   └── register.ts       # 注册 API
│   │   ├── admin/
│   │   │   └── export.ts         # 导出 API
│   │   └── lib/
│   │       ├── prisma.ts         # Prisma 客户端
│   │       └── auth.ts           # 认证逻辑
│   ├── prisma/
│   │   └── schema.prisma           # 数据库模型
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── src/                              # Next.js 前端代码
│   ├── lib/
│   │   └── api.ts              # API 客户端
│   └── app/
├── next.config.ts                    # Next.js 配置（已修改为静态导出）
├── package.json
└── .env.production                   # 生产环境变量
```

## 🚀 快速开始

### 前置条件

1. ✅ 阿里云账号
2. ✅ 开通 ESA 边缘安全加速
3. ✅ 开通"函数和 Pages"服务
4. ✅ GitHub 仓库

### 部署步骤

#### 阶段 1：准备代码

```bash
# 1. 克隆或初始化 Git 仓库
git init
git add .
git commit -m "Initial commit for ESA deployment"

# 2. 推送到 GitHub
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

#### 阶段 2：部署前端到 ESA Pages

1. 登录阿里云控制台
2. 进入 **边缘安全加速 ESA** → **函数和 Pages** → **Pages**
3. 点击 **创建项目**
4. 选择 **GitHub** 仓库并授权
5. 配置构建设置：
   ```
   框架：Next.js
   构建命令：npm run build
   输出目录：./out
   Node.js 版本：20
   安装命令：pnpm install
   ```
6. 配置环境变量：
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-function-endpoint.aliyuncs.com
   NEXTAUTH_SECRET=your_production_secret
   NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com
   ```
7. 点击 **部署**

#### 阶段 3：创建阿里云 RDS 数据库

1. 进入 **云数据库 RDS** 控制台
2. 创建 **MySQL 8.0** 实例
3. 配置白名单（允许函数计算访问）
4. 获取连接字符串：
   ```env
   DATABASE_URL="mysql://username:password@rm-xxxxx.mysql.rds.aliyuncs.com:3306/dbname"
   ```

#### 阶段 4：部署函数计算

1. 进入 **函数计算 FC** 控制台
2. 创建 **服务**：`esa-backend-service`
3. 创建 **函数**（每个 API 一个函数）：
   - `chat-function`：处理 /api/chat
   - `auth-login-function`：处理 /api/auth/login
   - `auth-register-function`：处理 /api/auth/register
   - `admin-export-function`：处理 /api/admin/export

4. 配置函数（以 chat-function 为例）：
   ```json
   {
     "handler": "index.handler",
     "runtime": "nodejs20",
     "memorySize": 512,
     "timeout": 60,
     "environmentVariables": {
       "DATABASE_URL": "mysql://...",
       "OPENAI_API_KEY": "sk-...",
       "OPENAI_MODEL": "gpt-4o-mini",
       "NEXTAUTH_SECRET": "your_secret",
       "NEXTAUTH_URL": "https://your-pages-domain.aliyuncs.com"
     }
   }
   ```

5. 配置 HTTP 触发器：
   - 认证方式：匿名
   - 请求方式：POST
   - 路径：`/api/chat`

6. 配置自定义域名和路由规则

#### 阶段 5：数据库迁移

```bash
# 进入 functions 目录
cd functions

# 安装依赖
pnpm install

# 生成 Prisma 客户端
pnpm prisma generate

# 推送迁移
pnpm prisma migrate deploy
```

## 📝 环境变量配置

### 前端（.env.production）

```env
# API 基础 URL（指向函数计算）
NEXT_PUBLIC_API_BASE_URL=https://your-function-endpoint.aliyuncs.com

# OpenAI API 配置（兼容 OpenAI 标准格式）
# 支持自定义 API URL（例如：OpenAI、Azure OpenAI、或其他兼容服务）
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4o-mini

# NextAuth 配置
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com
```

### 后端（functions/.env）

```env
# 数据库连接字符串
DATABASE_URL="mysql://username:password@rm-xxxxx.mysql.rds.aliyuncs.com:3306/dbname"

# OpenAI API 配置（兼容 OpenAI 标准格式）
# 支持自定义 API URL（例如：OpenAI、Azure OpenAI、或其他兼容服务）
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4o-mini

# NextAuth 配置
NEXTAUTH_SECRET=your-production-secret-key-change-me
NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com

# 运行环境
NODE_ENV=production
```

## 🔧 开发调试

### 本地开发

```bash
# 前端开发
npm run dev

# 后端开发（在 functions 目录）
cd functions
pnpm dev
```

### 测试 API

```bash
# 测试登录
curl -X POST https://your-function-endpoint.aliyuncs.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 测试 Chat API
curl -X POST https://your-function-endpoint.aliyuncs.com/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"oracle","messages":[{"role":"user","content":"Hello"}],"locale":"zh"}'
```

## 💰 成本估算

### ESA Pages
- **免费额度**：每月 10GB 流量
- **超出费用**：¥0.5/GB
- **存储**：¥0.005/GB/月

### 函数计算
- **免费额度**：每月 100万次调用
- **超出费用**：¥1.33/百万次
- **内存**：512MB ¥0.000031/GB秒

### RDS MySQL
- **实例**：2核4GB 起步约 ¥200/月
- **存储**：¥0.007/GB/月

**月度预估**：约 ¥300-500（中小规模）

## 🔒 安全建议

1. ✅ 启用 HTTPS
2. ✅ 使用强密码和 JWT 认证
3. ✅ 配置 RDS 白名单
4. ✅ 实现速率限制
5. ✅ 验证所有用户输入
6. ✅ 定期备份数据库
7. ✅ 监控异常访问

## 📚 监控与日志

### ESA Pages 监控
- 访问日志
- 错误日志
- 性能指标

### 函数计算监控
- 调用次数
- 平均执行时间
- 错误率
- 资源使用

### RDS 监控
- 连接数
- QPS
- 慢查询日志

## ❓ 故障排查

### Pages 部署失败
- 检查构建日志
- 确认 [`next.config.ts`](next.config.ts:1) 配置
- 验证依赖版本

### 函数调用失败
- 检查函数日志
- 验证环境变量
- 确认数据库连接

### CORS 错误
- 检查函数中的 CORS 头配置
- 验证 HTTP 触发器设置

## 📚 详细文档

完整的部署指南请参考：[`docs/ESA_DEPLOYMENT_GUIDE.md`](docs/ESA_DEPLOYMENT_GUIDE.md)

## 🤝 技术支持

- [ESA Pages 文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/what-is-functions-and-pages/)
- [函数计算文档](https://help.aliyun.com/zh/functioncompute/)
- [RDS 文档](https://help.aliyun.com/zh/rds/)
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
