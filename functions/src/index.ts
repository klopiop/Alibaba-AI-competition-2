// ESA 函数计算入口文件
// 导出所有 API 路由处理函数

import { handler as authLogin } from './auth/login.js';
import { handler as authRegister } from './auth/register.js';
import { handler as chatIndex } from './chat/index.js';
import { handler as adminExport } from './admin/export.js';

// 默认导出所有函数
export default {
  '/api/auth/login': authLogin,
  '/api/auth/register': authRegister,
  '/api/chat': chatIndex,
  '/api/admin/export': adminExport,
};