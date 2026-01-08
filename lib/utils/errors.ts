/**
 * API 错误处理工具模块
 * 提供统一的错误类型、错误响应生成和错误类型常量
 */

/**
 * 自定义 API 错误类
 * 用于在 API 路由中抛出带有状态码和错误类型的错误
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 创建标准化的错误响应
 * @param statusCode HTTP 状态码
 * @param error 错误类型标识
 * @param message 错误详细信息
 * @returns Response 对象
 */
export function createErrorResponse(
  statusCode: number,
  error: string,
  message: string
): Response {
  return Response.json({ error, message }, { status: statusCode });
}

/**
 * 错误类型常量
 * 定义常用的 HTTP 错误类型及其状态码
 */
export const ErrorTypes = {
  NOT_FOUND: { status: 404, error: "Not Found" },
  METHOD_NOT_ALLOWED: { status: 405, error: "Method Not Allowed" },
  INTERNAL_ERROR: { status: 500, error: "Internal Server Error" },
  VALIDATION_ERROR: { status: 400, error: "Validation Error" },
} as const;

/**
 * 从 ErrorTypes 创建错误响应的便捷函数
 * @param errorType ErrorTypes 中的错误类型
 * @param message 错误详细信息
 * @returns Response 对象
 */
export function createErrorFromType(
  errorType: (typeof ErrorTypes)[keyof typeof ErrorTypes],
  message: string
): Response {
  return createErrorResponse(errorType.status, errorType.error, message);
}
