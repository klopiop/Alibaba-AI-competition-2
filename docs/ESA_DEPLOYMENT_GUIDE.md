# 阿里云 ESA Pages + 函数计算 混合部署指南

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                     用户请求                              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              ESA Pages (静态前端)                      │
│  - Next.js 静态导出 (output: 'export')              │
│  - HTML/CSS/JS 全球边缘分发                              │
│  - 无服务器端渲染                                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│         阿里云函数计算 (后端 API)                     │
│  - /api/auth/* - 认证 API                                │
│  - /api/chat - Chat API                                   │
│  - /api/admin/* - 管理 API                                │
│  - 边缘执行，低延迟                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│          阿里云 RDS MySQL (数据库)                     │
│  - 用户表 (User)                                           │
│  - 会话表 (Session)                                        │
│  - 消息表 (Message)                                        │
│  - 审计日志 (AuditLog)                                     │
└─────────────────────────────────────────────────────────────┘
```

## 部署步骤

### 阶段 1：配置 Next.js 静态导出

#### 1.1 修改 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出
  output: 'export',
  
  // 图片优化（静态导出需要禁用）
  images: {
    unoptimized: true,
  },
  
  // 移除中间件（静态导出不支持）
  // middleware: { ... }  // 删除
  
  // 环境变量（生产环境）
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;
```

#### 1.2 创建环境变量配置文件

**.env.production**
```env
# API 基础 URL（指向阿里云函数计算）
NEXT_PUBLIC_API_BASE_URL=https://your-function-endpoint.aliyuncs.com

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

# NextAuth 配置（用于前端 JWT 验证）
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com
```

### 阶段 2：创建阿里云函数计算

#### 2.1 函数目录结构

```
functions/
├── src/
│   ├── chat/
│   │   └── index.ts          # Chat API
│   ├── auth/
│   │   ├── login.ts          # 登录 API
│   │   ├── register.ts       # 注册 API
│   │   └── session.ts        # Session API
│   ├── admin/
│   │   └── export.ts         # 导出 API
│   ├── lib/
│   │   ├── db.ts             # 数据库连接
│   │   ├── prisma.ts         # Prisma 客户端
│   │   └── auth.ts           # 认证逻辑
│   └── types/
│       └── index.ts           # 类型定义
├── prisma/
│   ├── schema.prisma           # 数据库模型
│   └── migrations/             # 数据库迁移
├── package.json
├── tsconfig.json
└── .env
```

#### 2.2 函数配置示例

**functions/package.json**
```json
{
  "name": "esa-backend-functions",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@prisma/client": "^6.19.2",
    "@prisma/adapter": "^2.11.1",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.2",
    "prisma": "^6.19.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "tsx": "^4.19.2",
    "typescript": "^5"
  }
}
```

**functions/src/chat/index.ts**
```typescript
import { createServer } from 'http';
import { handler as chatHandler } from './chat';

const server = createServer(async (req, res) => {
  // CORS 处理
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method === 'POST' && req.url === '/api/chat') {
    await chatHandler(req, res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Function server running on port ${PORT}`);
});
```

#### 2.3 Prisma 配置

**functions/prisma/schema.prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  passwordHash String
  role        String   @default("USER")
  bannedAt    DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionToken String   @unique
  expires      DateTime
  createdAt    DateTime @default(now())
  
  @@index([userId])
}

model Conversation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // ORACLE | TCM
  title     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}

model Message {
  id             String   @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String   // USER | ASSISTANT
  content        String
  createdAt      DateTime @default(now())
  
  @@index([conversationId])
}

model AuditLog {
  id        String   @id @default(cuid())
  actorId  String
  action    String
  message   String
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())
  
  @@index([actorId])
}
```

### 阶段 3：阿里云 RDS 配置

#### 3.1 创建 RDS 实例

1. 登录阿里云控制台
2. 进入 **云数据库 RDS** → **创建实例**
3. 选择 **MySQL 8.0** 版本
4. 选择合适的规格（建议：2核4GB 起步）
5. 设置白名单（允许函数计算访问）

#### 3.2 获取连接信息

```env
DATABASE_URL="mysql://username:password@rm-xxxxx.mysql.rds.aliyuncs.com:3306/dbname"
```

### 阶段 4：部署到 ESA Pages

#### 4.1 创建 GitHub 仓库

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

#### 4.2 在 ESA 控制台创建 Pages 项目

1. 登录阿里云控制台
2. 进入 **边缘安全加速 ESA** → **函数和 Pages** → **Pages**
3. 点击 **创建项目**
4. 选择 **GitHub** 仓库
5. 配置构建设置：
   - **框架**：Next.js
   - **构建命令**：`npm run build`
   - **输出目录**：`./out`
   - **Node.js 版本**：20
   - **安装命令**：`pnpm install`

#### 4.3 配置环境变量

在 ESA Pages 项目设置中添加：
```env
NEXT_PUBLIC_API_BASE_URL=https://your-function-endpoint.aliyuncs.com
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com
```

### 阶段 5：部署到阿里云函数计算

#### 5.1 创建函数

1. 进入 **函数计算 FC** 控制台
2. 创建 **服务**：`esa-backend-service`
3. 创建 **函数**：
   - `chat-function`：处理 /api/chat
   - `auth-login-function`：处理 /api/auth/login
   - `auth-register-function`：处理 /api/auth/register
   - `admin-export-function`：处理 /api/admin/export

#### 5.2 配置函数

**函数配置示例（chat-function）**
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

#### 5.3 配置 HTTP 触发器

为每个函数配置 HTTP 触发器：
- **认证方式**：匿名
- **请求方式**：POST
- **路径**：`/api/chat`、`/api/auth/login` 等

#### 5.4 配置自定义域名

1. 在函数计算服务中创建自定义域名
2. 绑定域名：`api.yourdomain.com`
3. 配置路由规则：
   ```
   /api/chat -> chat-function
   /api/auth/login -> auth-login-function
   /api/auth/register -> auth-register-function
   /api/admin/export -> admin-export-function
   ```

### 阶段 6：前端 API 调用改造

#### 6.1 创建 API 客户端

**src/lib/api.ts**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Chat API
export async function sendChatMessage(data: {
  type: 'oracle' | 'tcm';
  messages: Array<{ role: string; content: string }>;
  locale: string;
  conversationId?: string;
  systemHint?: string;
}) {
  return apiRequest<{ reply: string; conversationId: string }>(
    '/api/chat',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// Auth API
export async function login(credentials: {
  email: string;
  password: string;
}) {
  return apiRequest<{ user: { id: string; email: string; role: string }; token: string }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  );
}

export async function register(data: {
  email: string;
  password: string;
}) {
  return apiRequest<{ user: { id: string; email: string; role: string }; token: string }>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// Admin API
export async function exportData() {
  return apiRequest<{ data: any }>('/api/admin/export');
}
```

#### 6.2 更新组件使用 API

**src/components/ChatPanel.tsx**（修改部分）
```typescript
import { sendChatMessage } from '@/lib/api';

// 替换原有的 fetch 调用
const response = await sendChatMessage({
  type: type === 'tcm' ? 'tcm' : 'oracle',
  messages,
  locale,
  conversationId,
  systemHint,
});
```

### 阶段 7：数据库迁移

#### 7.1 在函数计算环境中运行迁移

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

#### 7.2 或使用阿里云 DMS 数据传输服务

1. 创建迁移任务
2. 选择源数据库（本地 SQLite）
3. 选择目标数据库（阿里云 RDS）
4. 执行迁移

## 成本估算

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

## 监控与日志

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
- 备份状态

## 安全建议

1. **HTTPS**：启用 SSL/TLS
2. **API 认证**：JWT Token 验证
3. **数据库安全**：
   - 使用强密码
   - 配置白名单
   - 定期备份数据
4. **速率限制**：在函数中实现 API 限流
5. **输入验证**：所有用户输入必须验证

## 故障排查

### 常见问题

**1. Pages 部署失败**
- 检查构建日志
- 确认 `output: 'export'` 配置
- 验证依赖版本

**2. 函数调用失败**
- 检查函数日志
- 验证环境变量
- 确认数据库连接

**3. CORS 错误**
- 在函数中添加 CORS 头
- 配置函数 HTTP 触发器

**4. 数据库连接失败**
- 验证 RDS 白名单
- 检查连接字符串
- 确认数据库实例状态

## 扩展建议

1. **CDN 加速**：使用阿里云 CDN 加速静态资源
2. **对象存储 OSS**：存储用户上传的文件
3. **日志服务 SLS**：集中收集和分析日志
4. **云盾**：DDoS 防护
5. **WAF**：Web 应用防火墙

## 参考链接

- [ESA Pages 文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/what-is-functions-and-pages/)
- [函数计算文档](https://help.aliyun.com/zh/functioncompute/)
- [RDS 文档](https://help.aliyun.com/zh/rds/)
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
