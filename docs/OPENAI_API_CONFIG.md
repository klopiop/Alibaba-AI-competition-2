# OpenAI API 配置指南

本项目支持标准 OpenAI API 格式,可以自定义 API URL 以使用不同的 AI 服务提供商。

## 📋 支持的服务

### 1. OpenAI 官方
```env
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4o-mini
```

### 2. Azure OpenAI
```env
OPENAI_API_KEY=your-azure-api-key
OPENAI_API_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview
OPENAI_MODEL=gpt-4o-mini
```

### 3. 其他兼容 OpenAI 格式的服务

#### DeepSeek
```env
OPENAI_API_KEY=your-deepseek-api-key
OPENAI_API_URL=https://api.deepseek.com/v1/chat/completions
OPENAI_MODEL=deepseek-chat
```

#### Moonshot AI (月之暗面)
```env
OPENAI_API_KEY=your-moonshot-api-key
OPENAI_API_URL=https://api.moonshot.cn/v1/chat/completions
OPENAI_MODEL=moonshot-v1-8k
```

#### 通义千问
```env
OPENAI_API_KEY=your-qwen-api-key
OPENAI_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
OPENAI_MODEL=qwen-turbo
```

#### 智谱 AI
```env
OPENAI_API_KEY=your-zhipu-api-key
OPENAI_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
OPENAI_MODEL=glm-4
```

## 🔧 配置步骤

### 前端配置（ESA Pages）

在 ESA Pages 控制台的环境变量中添加:

```env
OPENAI_API_KEY=your_api_key
OPENAI_API_URL=https://your-api-endpoint.com/v1/chat/completions
OPENAI_MODEL=your_model_name
```

### 后端配置（函数计算）

在函数计算的环境变量中添加:

```env
OPENAI_API_KEY=your_api_key
OPENAI_API_URL=https://your-api-endpoint.com/v1/chat/completions
OPENAI_MODEL=your_model_name
```

## 📝 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `OPENAI_API_KEY` | ✅ 是 | API 密钥 | `sk-xxx` |
| `OPENAI_API_URL` | ❌ 否 | API 端点 URL（默认：OpenAI 官方） | `https://api.openai.com/v1/chat/completions` |
| `OPENAI_MODEL` | ❌ 否 | 模型名称（默认：gpt-4o-mini） | `gpt-4o-mini` |

## 🧪 测试配置

配置完成后,可以通过以下方式测试:

### 1. 本地测试

```bash
# 设置环境变量
export OPENAI_API_KEY=your_key
export OPENAI_API_URL=https://your-api-url.com/v1/chat/completions
export OPENAI_MODEL=your_model

# 启动开发服务器
pnpm dev
```

### 2. API 测试

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "oracle",
    "messages": [{"role": "user", "content": "你好"}],
    "locale": "zh"
  }'
```

## ⚠️ 注意事项

1. **API URL 格式**
   - 必须是完整的 URL,包括路径
   - 必须指向 `/chat/completions` 端点
   - 某些服务可能需要额外的查询参数

2. **模型名称**
   - 确保模型名称与服务提供商匹配
   - 某些服务可能需要特定的部署名称

3. **API 密钥**
   - 妥善保管密钥,不要提交到 Git
   - 在生产环境使用专用的生产密钥

4. **兼容性**
   - 确保服务完全兼容 OpenAI API 格式
   - 测试流式输出、错误处理等功能

## 🐛 故障排查

### 问题：API 调用失败

**可能原因:**
- API URL 不正确
- API 密钥无效或过期
- 模型名称不存在
- 网络连接问题

**解决方法:**
1. 检查环境变量配置
2. 查看函数计算日志
3. 使用 curl 直接测试 API
4. 确认 API 密钥权限

### 问题：响应格式错误

**可能原因:**
- 服务不完全兼容 OpenAI 格式
- 响应解析逻辑需要调整

**解决方法:**
1. 查看原始响应内容
2. 检查服务文档
3. 必要时修改 [`functions/src/chat/index.ts`](functions/src/chat/index.ts:160) 中的响应解析逻辑

## 📚 参考资源

- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [Azure OpenAI 文档](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)
- [Moonshot AI 文档](https://platform.moonshot.cn/docs)
