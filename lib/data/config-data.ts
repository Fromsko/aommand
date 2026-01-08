/**
 * 配置数据模块
 * 定义 Crush 配置模板的数据结构和生成函数
 */

/**
 * LSP 服务器配置接口
 */
export interface LSPServerConfig {
  command: string;
  args?: string[];
}

/**
 * LSP 配置接口
 */
export interface LSPConfig {
  enabled: boolean;
  servers: Record<string, LSPServerConfig>;
}

/**
 * 配置选项接口
 */
export interface ConfigOptions {
  skills_paths: string[];
  lsp: LSPConfig;
}

/**
 * Skills 配置接口
 */
export interface SkillsConfig {
  enabled: boolean;
  auto_discover: boolean;
}

/**
 * 模型配置接口
 */
export interface ModelConfig {
  name: string;
  display_name: string;
  default?: boolean;
}

/**
 * Provider 配置接口
 */
export interface ProviderConfig {
  name: string;
  api_key_env: string;
  models: ModelConfig[];
}

/**
 * Crush 完整配置接口
 */
export interface CrushConfig {
  version: string;
  updated_at: string;
  schema: string;
  options: ConfigOptions;
  skills: SkillsConfig;
  providers: ProviderConfig[];
}

/**
 * 应用版本号（语义化版本格式 X.Y.Z）
 */
export const APP_VERSION = "1.0.0";

/**
 * 配置 Schema URL
 */
export const CONFIG_SCHEMA_URL = "https://charm.land/crush.json";

/**
 * 默认 Skills 路径配置
 */
export const DEFAULT_SKILLS_PATHS = ["~/.config/crush/skills"];

/**
 * 默认 LSP 服务器配置
 */
export const DEFAULT_LSP_SERVERS: Record<string, LSPServerConfig> = {
  typescript: {
    command: "typescript-language-server",
    args: ["--stdio"],
  },
  python: {
    command: "pylsp",
  },
  rust: {
    command: "rust-analyzer",
  },
};

/**
 * 默认 Provider 配置
 */
export const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    name: "anthropic",
    api_key_env: "ANTHROPIC_API_KEY",
    models: [
      {
        name: "claude-sonnet-4-20250514",
        display_name: "Claude Sonnet 4",
        default: true,
      },
      {
        name: "claude-3-5-haiku-20241022",
        display_name: "Claude 3.5 Haiku",
      },
    ],
  },
  {
    name: "openai",
    api_key_env: "OPENAI_API_KEY",
    models: [
      {
        name: "gpt-4o",
        display_name: "GPT-4o",
      },
      {
        name: "gpt-4o-mini",
        display_name: "GPT-4o Mini",
      },
    ],
  },
  {
    name: "google",
    api_key_env: "GOOGLE_API_KEY",
    models: [
      {
        name: "gemini-2.0-flash",
        display_name: "Gemini 2.0 Flash",
      },
      {
        name: "gemini-1.5-pro",
        display_name: "Gemini 1.5 Pro",
      },
    ],
  },
];

/**
 * 生成完整的 Crush 配置对象
 * @returns CrushConfig 完整配置对象
 */
export function generateConfig(): CrushConfig {
  return {
    version: APP_VERSION,
    updated_at: new Date().toISOString(),
    schema: CONFIG_SCHEMA_URL,
    options: {
      skills_paths: DEFAULT_SKILLS_PATHS,
      lsp: {
        enabled: true,
        servers: DEFAULT_LSP_SERVERS,
      },
    },
    skills: {
      enabled: true,
      auto_discover: true,
    },
    providers: DEFAULT_PROVIDERS,
  };
}
