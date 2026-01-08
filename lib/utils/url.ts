/**
 * URL 工具模块
 * 提供 URL 自动检测和处理功能
 */

import { NextRequest } from "next/server";

/**
 * 获取服务器基础 URL
 *
 * 优先级：
 * 1. NEXT_PUBLIC_BASE_URL 环境变量（用户显式配置）
 * 2. 请求头中的 host（从实际请求获取，保持用户访问的 URL）
 * 3. VERCEL_URL 环境变量（Vercel 部署时自动提供，但可能是预览 URL）
 * 4. 默认 localhost:3000（本地开发兜底）
 *
 * @param request - Next.js 请求对象
 * @returns 服务器基础 URL（包含协议）
 *
 * Requirements: 11.3 - URL 检测逻辑
 */
export function getBaseUrl(request: NextRequest): string {
  // 优先级 1: 用户显式配置的 URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 优先级 2: 从请求头获取 host（保持用户访问的实际 URL）
  const host = request.headers.get("host");
  if (host) {
    // 判断是否为本地开发环境
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  // 优先级 3: Vercel 部署时自动提供的 URL（可能是预览 URL）
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 优先级 4: 默认返回 localhost（本地开发兜底）
  return "http://localhost:3000";
}
