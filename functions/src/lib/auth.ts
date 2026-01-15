import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * 验证 JWT Token
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

/**
 * 生成 JWT Token
 */
export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 天过期
  };

  return jwt.sign(payload, JWT_SECRET);
}

/**
 * 验证密码
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * 从请求中提取用户信息
 */
export async function getUserFromRequest(
  headers: Headers
): Promise<AuthUser | null> {
  const authHeader = headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

/**
 * 检查用户权限
 */
export function checkPermission(
  user: AuthUser | null,
  requiredRole?: string
): boolean {
  if (!user) return false;
  if (requiredRole && user.role !== requiredRole) return false;
  return true;
}
