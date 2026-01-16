# 函数计算部署指南

## 📋 部署前检查清单

- ✅ 函数代码已编译到 `functions/dist` 目录
- ✅ 环境变量已配置在 `functions/.env`
- ✅ 数据库连接字符串已准备（可选）
- ✅ Qwen3-Max API 密钥已配置

## 🚀 部署步骤

### 方式一：通过阿里云控制台部署

#### 1. 创建函数计算服务

1. 登录阿里云控制台
2. 进入 **函数计算 FC** → **服务及函数**
3. 点击 **创建服务**
   - 服务名称：`esa-backend-service`
   - 描述：ESA Pages 后端 API 服务
   - 运行时：Node.js 20

#### 2. 创建函数

创建以下函数：

| 函数名称 | 处理路径 | 方法 | 说明 |
|---------|----------|------|------|
| `chat-function` | `/api/chat` | POST | AI 对话 API |
| `login-function` | `/api/auth/login` | POST | 用户登录 |
| `register-function` | `/api/auth/register` | POST | 用户注册 |
| `export-function` | `/api/admin/export` | GET | 数据导出 |

#### 3. 配置函数（以 chat-function 为例）

**基本信息：**
- 函数名称：`chat-function`
- 请求处理程序：`index.handler`
- 运行时：Node.js 20
- 内存规格：512 MB
- 超时时间：60 秒

**环境变量：**
```env
OPENAI_API_KEY=sk-1a9017c965c355d67198b1171848c063
OPENAI_API_URL=https://apis.iflow.cn/v1/chat/completions
OPENAI_MODEL=qwen3-max
DATABASE_URL=mysql://username:password@rm-xxxxx.mysql.rds.aliyuncs.com:3306/dbname
NEXTAUTH_SECRET=your_production_secret_key
NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com
NODE_ENV=production
```

**代码配置：**
- 代码上传方式：选择 **上传 ZIP 包**
- 上传 `functions/dist` 目录的压缩包
- 或选择 **通过 OSS 上传**，上传到 OSS 后引用

#### 4. 配置 HTTP 触发器

每个函数都需要配置 HTTP 触发器：

1. 进入函数详情页
2. 点击 **触发器管理** → **创建触发器**
3. 配置：
   - 触发器类型：HTTP 触发器
   - 触发器名称：`http-trigger`
   - 认证方式：**匿名访问**（重要！）
   - 请求方式：根据函数配置（POST/GET）
   - 路径：`/api/chat`（或其他 API 路径）

#### 5. 配置自定义域名（推荐）

1. 进入 **域名管理**
2. 添加自定义域名：
   - 域名：`api.yourdomain.com`
   - 路径：`/api/*`
   - 目标服务：`esa-backend-service`
3. 配置 DNS 解析：
   - 类型：CNAME
   - 记录值：阿里云提供的 CNAME 地址

### 方式二：通过 Serverless Devs 部署（推荐）

```bash
# 安装 Serverless Devs
npm install -g @serverless-devs/s

# 登录阿里云
s config login

# 初始化项目
cd functions
s init

# 部署
s deploy
```

## 🔧 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `OPENAI_API_KEY` | Qwen3-Max API 密钥 | `sk-1a9017c965c355d67198b1171848c063` |
| `OPENAI_API_URL` | Qwen3-Max API 地址 | `https://apis.iflow.cn/v1/chat/completions` |
| `OPENAI_MODEL` | 模型名称 | `qwen3-max` |

### 可选变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | 数据库连接字符串 | `mysql://user:pass@host:3306/db` |
| `NEXTAUTH_SECRET` | JWT 密钥 | `your-secret-key` |
| `NEXTAUTH_URL` | 应用 URL | `https://your-domain.aliyuncs.com` |
| `NODE_ENV` | 运行环境 | `production` |

## 📝 数据库配置（可选）

如果需要存储对话历史：

### 1. 创建 RDS MySQL 实例

1. 进入 **云数据库 RDS** 控制台
2. 创建 MySQL 8.0 实例
3. 配置白名单：添加函数计算的 IP 地址

### 2. 运行数据库迁移

```bash
cd functions

# 设置数据库连接
echo 'DATABASE_URL="mysql://username:password@host:3306/dbname"' > .env

# 生成 Prisma 客户端
pnpm prisma generate

# 推送迁移
pnpm prisma migrate deploy
```

## 🧪 测试部署

### 测试 Chat API

```bash
curl -X POST https://your-function-endpoint.aliyuncs.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "type": "oracle",
    "messages": [{"role": "user", "content": "你好"}],
    "locale": "zh"
  }'
```

### 测试登录 API

```bash
curl -X POST https://your-function-endpoint.aliyuncs.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔍 故障排查

### 问题：函数调用失败

**可能原因：**
- 环境变量未配置
- 代码上传不完整
- HTTP 触发器配置错误

**解决方法：**
1. 检查函数日志
2. 验证环境变量
3. 确认触发器路径和方法

### 问题：CORS 错误

**可能原因：**
- 触发器认证方式不是匿名
- CORS 头未正确配置

**解决方法：**
1. 确保触发器认证方式为"匿名访问"
2. 检查代码中的 CORS 配置

### 问题：数据库连接失败

**可能原因：**
- 数据库白名单未配置
- 连接字符串错误
- 数据库实例未启动

**解决方法：**
1. 添加函数计算 IP 到 RDS 白名单
2. 验证 DATABASE_URL 格式
3. 检查数据库实例状态

## 📊 监控与日志

### 函数计算监控

- 调用次数
- 平均执行时间
- 错误率
- 资源使用情况

### 查看日志

1. 进入函数详情页
2. 点击 **日志查询**
3. 选择时间范围和日志级别
4. 查看实时日志和历史日志

## 💰 成本估算

### 函数计算费用

- 免费额度：每月 100 万次调用
- 超出费用：¥1.33/百万次
- 内存费用：512MB ¥0.000031/GB秒
- 执行时间费用：¥0.000031/GB秒

**月度预估：**
- 10 万次调用：约 ¥1.33
- 平均执行 500ms：约 ¥0.08
- **总计：约 ¥1.41/月**

### RDS 费用（可选）

- 2核4GB 实例：约 ¥200/月
- 存储：¥0.007/GB/月

## 📚 相关文档

- [函数计算文档](https://help.aliyun.com/zh/functioncompute/)
- [Serverless Devs 文档](https://www.serverless-devs.com/)
- [Prisma 文档](https://www.prisma.io/docs)
