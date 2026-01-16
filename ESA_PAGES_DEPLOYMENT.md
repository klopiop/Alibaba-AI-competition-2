# ESA Pages 简化部署指南

## ✅ 好消息：ESA Pages 支持边缘函数！

**不需要单独部署函数计算！** ESA Pages 现在支持 **Edge Functions（边缘函数）**，可以直接在 Pages 项目中部署 API。

## 🏗️ 简化架构

```
┌─────────────────────────────────────────┐
│         用户访问 ESA Pages          │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      ESA Pages (静态前端)            │
│  - HTML/CSS/JS 静态资源          │
│  - 边缘函数 (api/index.ts)         │ ← 直接处理 API
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      Qwen3-Max API               │
└─────────────────────────────────────────┘
```

## 📁 项目结构

```
.
├── api/
│   └── index.ts              # 边缘函数入口 ✅ 新增
├── src/
│   ├── app/                   # Next.js 前端
│   └── lib/
│       └── api.ts             # API 客户端
├── functions/                 # 函数计算（不再需要）
├── .env.production           # 环境变量
└── package.json
```

## 🚀 部署步骤

### 1. 配置环境变量

在项目根目录的 `.env.production` 中配置：

```env
# Qwen3-Max API 配置
OPENAI_API_KEY=sk-1a9017c965c355d67198b1171848c063
OPENAI_API_URL=https://apis.iflow.cn/v1/chat/completions
OPENAI_MODEL=qwen3-max

# NextAuth 配置
NEXTAUTH_SECRET=your_production_secret_key
NEXTAUTH_URL=https://your-pages-domain.aliyuncs.com
```

### 2. 推送代码到 GitHub

```bash
git add .
git commit -m "Add edge function for ESA Pages"
git push origin main
```

### 3. 在 ESA Pages 控制台部署

1. 登录阿里云控制台
2. 进入 **边缘安全加速 ESA** → **函数和 Pages** → **Pages**
3. 点击 **创建项目** 或选择现有项目
4. 连接 GitHub 仓库
5. 配置构建设置：
   ```
   框架：Next.js
   构建命令：pnpm build
   输出目录：./out
   Node.js 版本：20
   安装命令：pnpm install
   ```
6. 配置环境变量：
   ```env
   OPENAI_API_KEY=sk-1a9017c965c355d67198b1171848c063
   OPENAI_API_URL=https://apis.iflow.cn/v1/chat/completions
   OPENAI_MODEL=qwen3-max
   ```
7. 点击 **部署**

### 4. 配置边缘函数（自动）

ESA Pages 会自动识别 `api/` 目录中的边缘函数：

- `api/index.ts` → 处理 `/api/chat` 请求
- 自动配置 CORS
- 自动注入环境变量

## ✨ 优势

### 相比传统函数计算

| 特性 | 传统函数计算 | ESA Pages 边缘函数 |
|------|------------|------------------|
| 部署复杂度 | 需要单独部署服务 | ✅ 一键部署 |
| 网络延迟 | 可能较高 | ✅ 全球边缘节点 |
| 配置复杂度 | 需要配置触发器 | ✅ 自动配置 |
| 成本 | 按调用次数计费 | ✅ 包含在 Pages 中 |
| 维护 | 需要单独管理 | ✅ 统一管理 |

## 🧪 测试部署

部署完成后，访问您的 Pages 域名，测试 AI 聊天功能：

1. 打开算命页面：`https://your-domain.aliyuncs.com/zh/oracle`
2. 输入问题
3. 点击发送
4. 查看是否正常返回 AI 回复

## 🔍 故障排查

### 问题：API 调用失败

**检查项：**
1. 环境变量是否正确配置
2. Qwen3-Max API 密钥是否有效
3. 边缘函数是否正确部署

**查看日志：**
1. 进入 ESA Pages 项目详情
2. 点击 **日志** 标签
3. 查看边缘函数执行日志

### 问题：CORS 错误

**解决方法：**
边缘函数已自动配置 CORS，如果仍有问题，检查：
- 浏览器控制台错误信息
- 网络请求头

## 💰 成本

### ESA Pages
- **免费额度**：每月 10GB 流量
- **超出费用**：¥0.5/GB
- **边缘函数**：包含在 Pages 中，无需额外费用

**月度预估**：约 ¥0-50（中小规模）

## 📚 相关文档

- [ESA Pages 边缘函数文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/what-is-functions-and-pages/)
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 🎉 总结

现在部署超级简单：

1. ✅ 配置环境变量
2. ✅ 推送代码到 GitHub
3. ✅ 在 ESA Pages 点击部署
4. ✅ 完成！

无需单独配置函数计算、无需配置触发器、无需管理多个服务！
