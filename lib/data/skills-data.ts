/**
 * Skills 数据模块
 * 定义 Agent Skills 的数据结构和管理函数
 */

/**
 * Skill 分类类型
 * - creative: 创意和思维能力
 * - design: 设计相关能力
 * - docs: 文档处理能力
 * - dev: 开发相关能力
 */
export type SkillCategory = "creative" | "design" | "docs" | "dev";

/**
 * 有效的分类列表
 */
export const VALID_CATEGORIES: SkillCategory[] = [
  "creative",
  "design",
  "docs",
  "dev",
];

/**
 * Skill 接口定义
 */
export interface Skill {
  /** 唯一标识符，kebab-case 格式 */
  name: string;
  /** 技能描述，非空字符串 */
  description: string;
  /** 是否启用 */
  enabled: boolean;
  /** 技能分类 */
  category: SkillCategory;
}

/**
 * 预定义的官方 Skills 列表
 * 来源于 anthropics/skills 仓库
 */
export const SKILLS: Skill[] = [
  // Creative 分类
  {
    name: "think",
    description:
      "Extended thinking and reasoning capabilities for complex problem solving",
    enabled: true,
    category: "creative",
  },
  {
    name: "brainstorm",
    description: "Generate creative ideas and explore multiple solutions",
    enabled: true,
    category: "creative",
  },

  // Design 分类
  {
    name: "ui-design",
    description: "User interface design patterns and best practices",
    enabled: true,
    category: "design",
  },
  {
    name: "system-design",
    description: "System architecture and design principles",
    enabled: true,
    category: "design",
  },
  {
    name: "api-design",
    description: "RESTful API design and documentation",
    enabled: true,
    category: "design",
  },

  // Docs 分类
  {
    name: "markdown",
    description: "Markdown formatting and documentation writing",
    enabled: true,
    category: "docs",
  },
  {
    name: "readme-writer",
    description: "Generate comprehensive README files for projects",
    enabled: true,
    category: "docs",
  },
  {
    name: "changelog",
    description: "Generate and maintain changelog documentation",
    enabled: true,
    category: "docs",
  },

  // Dev 分类
  {
    name: "code-review",
    description: "Code review assistance and best practice suggestions",
    enabled: true,
    category: "dev",
  },
  {
    name: "refactor",
    description: "Code refactoring and optimization suggestions",
    enabled: true,
    category: "dev",
  },
  {
    name: "test-writer",
    description: "Generate unit tests and test cases",
    enabled: true,
    category: "dev",
  },
  {
    name: "debug",
    description: "Debugging assistance and error analysis",
    enabled: true,
    category: "dev",
  },
];

/**
 * 验证字符串是否为有效的 kebab-case 格式
 * @param str 要验证的字符串
 * @returns 是否为有效的 kebab-case
 */
export function isKebabCase(str: string): boolean {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(str);
}

/**
 * 验证分类是否有效
 * @param category 要验证的分类
 * @returns 是否为有效分类
 */
export function isValidCategory(category: string): category is SkillCategory {
  return VALID_CATEGORIES.includes(category as SkillCategory);
}

/**
 * 按分类过滤 Skills
 * @param skills Skills 数组
 * @param category 可选的分类过滤条件
 * @returns 过滤后的 Skills 数组
 *
 * 行为说明：
 * - 如果未提供 category，返回所有 skills
 * - 如果 category 无效，返回空数组
 * - 如果 category 有效，返回匹配该分类的 skills
 */
export function filterSkillsByCategory(
  skills: Skill[],
  category?: string
): Skill[] {
  // 未提供分类时返回所有 skills
  if (!category) {
    return skills;
  }

  // 无效分类返回空数组
  if (!isValidCategory(category)) {
    return [];
  }

  // 返回匹配分类的 skills
  return skills.filter((skill) => skill.category === category);
}

/**
 * 获取所有 Skills 的名称集合（用于验证唯一性）
 * @param skills Skills 数组
 * @returns 名称集合
 */
export function getSkillNames(skills: Skill[]): Set<string> {
  return new Set(skills.map((skill) => skill.name));
}

/**
 * 验证 Skills 数组中的名称是否唯一
 * @param skills Skills 数组
 * @returns 是否所有名称都唯一
 */
export function areSkillNamesUnique(skills: Skill[]): boolean {
  const names = skills.map((skill) => skill.name);
  return new Set(names).size === names.length;
}
