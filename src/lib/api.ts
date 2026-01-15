/**
 * 阿里云函数计算 API 客户端
 * 用于 ESA Pages 静态部署时调用后端 API
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

  // 从 localStorage 获取 token
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Chat API
 */
export async function sendChatMessage(data: {
  type: 'oracle' | 'tcm';
  messages: Array<{ role: string; content: string }>;
  locale: string;
  conversationId?: string;
  systemHint?: string;
}) {
  return apiRequest<{ reply: string; conversationId: string }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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
