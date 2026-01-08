/**
 * Health API 路由
 * 返回服务健康状态信息
 */

import { APP_VERSION } from "@/lib/data/config-data";
import { createErrorFromType, ErrorTypes } from "@/lib/utils/errors";

/**
 * Health 响应接口
 */
export interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
  version: string;
}

/**
 * GET /api/health
 * 返回服务健康状态
 */
export async function GET(): Promise<Response> {
  try {
    const response: HealthResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
    };

    return Response.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Health API error:", error);

    const errorResponse: HealthResponse = {
      status: "error",
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
    };

    return Response.json(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
