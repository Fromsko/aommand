/**
 * Skills API 路由
 * 提供可用 Skills 列表，支持分类过滤
 *
 * GET /api/skills - 返回 skills 列表
 * GET /api/skills?category={category} - 返回指定分类的 skills
 */

import {
  filterSkillsByCategory,
  SKILLS,
  type Skill,
} from "@/lib/data/skills-data";
import { createErrorFromType, ErrorTypes } from "@/lib/utils/errors";

/**
 * Skills API 响应接口
 */
interface SkillsResponse {
  total: number;
  skills: Skill[];
}

/**
 * GET handler - 返回 skills 列表
 *
 * Requirements:
 * - 2.1: 返回包含 total 和 skills 数组的 JSON 响应
 * - 2.2: 支持 category 查询参数过滤
 * - 2.3: 每个 skill 包含 name, description, enabled, category 字段
 * - 2.4: 支持 creative, design, docs, dev 分类
 * - 2.5: 无效 category 返回空数组，total 为 0
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    // 过滤 skills（无效分类会返回空数组）
    const filteredSkills = filterSkillsByCategory(SKILLS, category);

    // 构建响应
    const response: SkillsResponse = {
      total: filteredSkills.length,
      skills: filteredSkills,
    };

    return Response.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Skills API error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to retrieve skills";

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
