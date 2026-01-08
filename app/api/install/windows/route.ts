/**
 * Windows 安装脚本 API 路由
 * 提供 Windows 平台的 PowerShell 安装脚本
 *
 * GET /api/install/windows - 返回 PowerShell 安装脚本
 */

import { generateWindowsScript } from "@/lib/templates/windows-script";
import { createErrorFromType, ErrorTypes } from "@/lib/utils/errors";
import { getBaseUrl } from "@/lib/utils/url";
import { NextRequest } from "next/server";

/**
 * GET handler - 返回 Windows 安装脚本
 *
 * Requirements:
 * - 5.1: 返回 PowerShell 脚本，Content-Type 为 text/plain
 * - 5.2: 替换 BASE_URL 占位符为实际服务器 URL
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const baseUrl = getBaseUrl(request);
    const script = generateWindowsScript(baseUrl);

    return new Response(script, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Windows install script API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate Windows install script";

    return createErrorFromType(ErrorTypes.INTERNAL_ERROR, message);
  }
}

/**
 * POST handler - 方法不支持
 * Requirements: 9.5 - 不支持的方法返回 405
 */
export async function POST(): Promise<Response> {
  return createErrorFromType(
    ErrorTypes.METHOD_NOT_ALLOWED,
    "POST method is not supported for this endpoint. Use GET instead."
  );
}

/**
 * PUT handler - 方法不支持
 * Requirements: 9.5 - 不支持的方法返回 405
 */
export async function PUT(): Promise<Response> {
  return createErrorFromType(
    ErrorTypes.METHOD_NOT_ALLOWED,
    "PUT method is not supported for this endpoint. Use GET instead."
  );
}

/**
 * DELETE handler - 方法不支持
 * Requirements: 9.5 - 不支持的方法返回 405
 */
export async function DELETE(): Promise<Response> {
  return createErrorFromType(
    ErrorTypes.METHOD_NOT_ALLOWED,
    "DELETE method is not supported for this endpoint. Use GET instead."
  );
}

/**
 * PATCH handler - 方法不支持
 * Requirements: 9.5 - 不支持的方法返回 405
 */
export async function PATCH(): Promise<Response> {
  return createErrorFromType(
    ErrorTypes.METHOD_NOT_ALLOWED,
    "PATCH method is not supported for this endpoint. Use GET instead."
  );
}
