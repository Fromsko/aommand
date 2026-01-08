/**
 * Config API 路由
 * 提供 Crush 配置模板的 JSON 数据
 *
 * GET /api/config - 返回完整配置 JSON
 */

import { generateConfig } from "@/lib/data/config-data";
import { createErrorFromType, ErrorTypes } from "@/lib/utils/errors";

/**
 * GET handler - 返回配置 JSON
 *
 * Requirements:
 * - 1.1: 返回包含 version, updated_at, schema, options, skills, providers 的 JSON
 * - 1.2: updated_at 使用 ISO 8601 时间戳
 * - 1.4: Content-Type 设置为 application/json
 * - 1.5: 内部错误返回 500 状态码
 */
export async function GET(): Promise<Response> {
  try {
    const config = generateConfig();

    return Response.json(config, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Config API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate configuration";

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
