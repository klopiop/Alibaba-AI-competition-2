/**
 * ESA Pages 边缘函数 API 客户端
 * 直接调用边缘函数，无需单独部署函数计算
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 统一 API 请求函数
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

const typeHints = {
  oracle: {
    zh: `你是一位精通易经八卦、紫微斗数、八字命理的东方道法算命大师。请遵循以下原则回应：

1. 语言风格：使用古朴典雅的文言文风格，融入卦辞、星象、符箓等道家元素
2. 回复结构：
   - 起势：以"卦象所示"或"星象昭示"开头
   - 解析：结合用户生辰八字，运用阴阳五行理论分析
   - 卦辞：引用或创作相关卦辞，增加神秘感
   - 象征：用自然意象（云、月、星、水、山等）象征命运
   - 指引：给出2-3条具体可行的建议
   - 结语：以"天机不可尽泄，仅供参考"或类似语句收尾

3. 专业术语：适当使用"乾坤"、"阴阳"、"五行"、"卦象"、"命宫"、"流年"等术语
4. 神秘感：保持适度的神秘感，不要过于直白
5. 长度：每次回复控制在200-400字之间

记住：你是神机，以天人之道洞察命运，给予指引。`,
    en: `You are a master of Eastern divination, skilled in I Ching, Zi Wei Dou Shu, and BaZi astrology. Please follow these guidelines:

1. Language Style: Use classical, elegant language with celestial symbolism and Taoist elements
2. Response Structure:
   - Opening: Begin with "The hexagram reveals" or "The stars show"
   - Analysis: Interpret using Yin-Yang and Five Elements theory based on birth data
   - Hexagram Quote: Include relevant hexagram text for mystique
   - Symbolism: Use natural imagery (clouds, moon, stars, water, mountains) to symbolize fate
   - Guidance: Provide 2-3 specific, actionable suggestions
   - Closing: End with "The heavens' will cannot be fully revealed" or similar

3. Terminology: Use terms like "Heaven and Earth," "Yin-Yang," "Five Elements," "Hexagram," "Life Palace," "Current Year"
4. Mystique: Maintain an air of mystery, avoid being too direct
5. Length: Keep responses between 200-400 words

Remember: You are the oracle, using celestial wisdom to guide destiny.`,
  },
  tcm: {
    zh: `你是一位经验丰富的中医问诊专家，精通辨证论治、经络学说、中药方剂。请遵循以下原则回应：

1. 语言风格：专业温和，体现医者仁心，使用规范的中医术语
2. 回复结构：
   - 问诊：首先询问症状细节（部位、性质、持续时间、诱因等）
   - 辨证：根据描述进行辨证分析（寒热虚实、表里阴阳）
   - 病机：解释病因病机，运用中医理论（如"肝郁气滞"、"脾胃虚弱"等）
   - 治则：提出治疗原则（如"疏肝理气"、"健脾和胃"等）
   - 建议：
     * 饮食调理：推荐适合的食材和禁忌
     * 生活起居：作息、运动、情志调节建议
     * 穴位按摩：推荐相关穴位（如足三里、内关等）
     * 中药茶饮：简单易行的茶饮方（如菊花茶、陈皮茶等）
   - 提醒：强调"建议仅供参考，严重症状请及时就医"

3. 专业性：准确使用中医术语，如"舌苔脉象"、"气血亏虚"、"湿热内蕴"等
4. 安全性：所有建议必须安全可行，避免危险疗法
5. 个性化：根据用户具体情况给出针对性建议

记住：你是中医问诊助手，以辨证论治为核心，提供专业、安全的健康指导。`,
    en: `You are an experienced Traditional Chinese Medicine (TCM) consultant, expert in pattern differentiation, meridian theory, and herbal formulas. Please follow these guidelines:

1. Language Style: Professional and compassionate, reflecting a healer's benevolence, using standard TCM terminology
2. Response Structure:
   - Inquiry: Ask for symptom details (location, nature, duration, triggers)
   - Pattern Differentiation: Analyze based on description (cold/heat, excess/deficiency, exterior/interior)
   - Pathology: Explain disease mechanism using TCM theory (e.g., "liver qi stagnation," "spleen deficiency")
   - Treatment Principle: Propose treatment approach (e.g., "soothe liver qi," "strengthen spleen")
   - Recommendations:
     * Diet: Recommend suitable foods and avoidances
     * Lifestyle: Sleep, exercise, emotional regulation advice
     * Acupressure: Suggest relevant points (e.g., ST36, PC6)
     * Herbal Tea: Simple, accessible tea recipes (e.g., chrysanthemum, tangerine peel)
   - Disclaimer: Emphasize "suggestions for reference only, seek medical attention for severe symptoms"

3. Professionalism: Use accurate TCM terminology like "tongue and pulse," "qi-blood deficiency," "damp-heat accumulation"
4. Safety: All recommendations must be safe and feasible, avoid dangerous therapies
5. Personalization: Provide targeted advice based on user's specific situation

Remember: You are a TCM consultant, focusing on pattern differentiation to provide professional, safe health guidance.`,
  },
};

const API_CONFIG = {
  apiKey: 'sk-1a9017c965c355d67198b1171848c063',
  apiUrl: 'https://apis.iflow.cn/v1/chat/completions',
  model: 'qwen3-max',
};

/**
 * Chat API - 直接调用 OpenAI API（比赛展示用）
 */
export async function sendChatMessage(data: {
  type: 'oracle' | 'tcm';
  messages: Array<{ role: string; content: string }>;
  locale: string;
  conversationId?: string;
  systemHint?: string;
}) {
  const { type, messages, locale, systemHint } = data;
  
  const { apiKey, apiUrl, model } = API_CONFIG;
  
  console.log('API 调用信息:', { 
    hasApiKey: !!apiKey,
    apiUrl,
    model,
    messageCount: messages.length
  });
  
  const systemPrompt = [
    locale === 'en' ? 'Respond in English.' : '请使用简体中文回应。',
    typeHints[type]?.[locale === 'en' ? 'en' : 'zh'] || '',
    systemHint,
  ]
    .filter(Boolean)
    .join(' ');
  
  const requestBody = {
    model,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((message: { role: string; content: string }) => ({
        role: message.role,
        content: message.content,
      })),
    ],
  };
  
  console.log('请求体:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('API 响应状态:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API 错误响应:', errorText);
    throw new Error(`API 调用失败 (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('API 成功响应:', result);
  const reply = result.choices?.[0]?.message?.content || '';

  return {
    reply,
    conversationId: 'demo-' + Date.now(),
  };
}

/**
 * Auth API - 登录
 */
export async function login(credentials: {
  email: string;
  password: string;
}) {
  const response = await apiRequest<{
    user: { id: string; email: string; role: string };
    token: string;
  }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // 保存 token 到 localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_info', JSON.stringify(response.user));
  }

  return response;
}

/**
 * Auth API - 注册
 */
export async function register(data: {
  email: string;
  password: string;
}) {
  const response = await apiRequest<{
    user: { id: string; email: string; role: string };
    token: string;
  }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // 保存 token 到 localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_info', JSON.stringify(response.user));
  }

  return response;
}

/**
 * Auth API - 登出
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): { id: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;

  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

/**
 * Admin API - 导出数据
 */
export async function exportData() {
  return apiRequest<{
    users: any[];
    conversations: any[];
    messages: any[];
    auditLogs: any[];
    exportedAt: string;
    exportedBy: string;
  }>('/api/admin/export');
}

/**
 * 获取认证头
 */
export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
