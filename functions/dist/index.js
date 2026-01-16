// ESA Edge Function 入口文件
// 路由到不同的 API 端点
import { handler as chatHandler } from './chat/index';
import { handler as loginHandler } from './auth/login';
import { handler as registerHandler } from './auth/register';
import { handler as exportHandler } from './admin/export';
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;
        // CORS 头
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
        // 处理 OPTIONS 请求
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        // 路由到不同的 API 端点
        try {
            if (path === '/api/chat' && method === 'POST') {
                return await chatHandler(request);
            }
            if (path === '/api/auth/login' && method === 'POST') {
                return await loginHandler(request);
            }
            if (path === '/api/auth/register' && method === 'POST') {
                return await registerHandler(request);
            }
            if (path === '/api/admin/export' && method === 'GET') {
                return await exportHandler(request);
            }
            // 未找到的路由
            return new Response(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        catch (error) {
            console.error('API Error:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    }
};
