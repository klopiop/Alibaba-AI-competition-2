// ESA Edge Function 入口文件
// 只处理 API 请求，其他请求由静态资源处理
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        // 只处理 API 请求
        if (path.startsWith('/api/')) {
            // TODO: 实现实际的 API 逻辑
            return new Response(JSON.stringify({ message: 'API endpoint', path }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }
        // 非 API 请求：返回 undefined 让 ESA 处理静态资源
        // 或者使用 env.ASSETS.fetch(request) 获取静态资源
        if (env && env.ASSETS) {
            return env.ASSETS.fetch(request);
        }
        // 如果没有 ASSETS，返回 undefined 让平台处理
        return undefined;
    }
};
