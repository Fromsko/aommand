/**
 * 配置数据模块
 * 定义 Crush 配置模板的数据结构和生成函数
 *
 * 配置格式参考 Crush 官方文档：
 * - providers: map[string]ProviderConfig
 * - models: map[string]ModelConfig
 */

/**
 * Provider 配置接口（单个 provider）
 */
export interface ProviderConfig {
  api_key?: string;
  api_key_env?: string;
  base_url?: string;
}

/**
 * Model 配置接口（单个 model）
 */
export interface ModelConfig {
  model: string;
  provider: string;
  max_tokens?: number;
}

/**
 * Recent Model 配置接口
 */
export interface RecentModelConfig {
  model: string;
  provider: string;
}

/**
 * MCP 服务器配置接口
 */
export interface MCPServerConfig {
  type: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

/**
 * Crush 完整配置接口（符合官方格式）
 */
export interface CrushConfig {
  $schema?: string;
  mcp?: Record<string, MCPServerConfig>;
  tools?: Record<string, object>;
  providers?: Record<string, ProviderConfig>;
  models?: Record<string, ModelConfig>;
  recent_models?: Record<string, RecentModelConfig[]>;
}

/**
 * 配置 Schema URL
 */
export const CONFIG_SCHEMA_URL = "https://charm.land/crush.json";

/**
 * 默认 Provider 配置（对象格式）
 */
export const DEFAULT_PROVIDERS: Record<string, ProviderConfig> = {
  anthropic: {
    api_key_env: "ANTHROPIC_API_KEY",
  },
  openai: {
    api_key_env: "OPENAI_API_KEY",
  },
  google: {
    api_key_env: "GOOGLE_API_KEY",
  },
};

/**
 * 默认 Model 配置
 */
export const DEFAULT_MODELS: Record<string, ModelConfig> = {
  large: {
    model: "claude-sonnet-4-20250514",
    provider: "anthropic",
    max_tokens: 8192,
  },
  small: {
    model: "claude-3-5-haiku-20241022",
    provider: "anthropic",
    max_tokens: 4096,
  },
};

/**
 * 默认 Recent Models 配置
 */
export const DEFAULT_RECENT_MODELS: Record<string, RecentModelConfig[]> = {
  large: [
    { model: "claude-sonnet-4-20250514", provider: "anthropic" },
    { model: "gpt-4o", provider: "openai" },
  ],
  small: [
    { model: "claude-3-5-haiku-20241022", provider: "anthropic" },
    { model: "gpt-4o-mini", provider: "openai" },
  ],
};

/**
 * 生成完整的 Crush 配置对象
 * @returns CrushConfig 完整配置对象（符合官方格式）
 */
export function generateConfig(): CrushConfig {
  return {
    $schema: CONFIG_SCHEMA_URL,
    providers: DEFAULT_PROVIDERS,
    models: DEFAULT_MODELS,
    recent_models: DEFAULT_RECENT_MODELS,
  };
}
