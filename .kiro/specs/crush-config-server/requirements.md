# Requirements Document

## Introduction

本文档定义了 **CRUSH 统一配置部署服务** 的需求规格。

### 关于 Crush

Crush 是由 Charmbracelet 开发的开源终端 AI 编程助手，具有以下核心特性：

- **多模型支持**: 支持 Anthropic Claude、OpenAI、Google Gemini、Groq、OpenRouter、Amazon Bedrock、Azure OpenAI 等多种 LLM 提供商
- **会话管理**: 为不同项目维护独立的上下文和持久化对话历史
- **LSP 集成**: 通过语言服务器协议增强代码理解能力
- **MCP 协议支持**: 通过 Model Context Protocol 服务器扩展功能（支持 stdio、HTTP、SSE 三种传输方式）
- **Agent Skills**: 支持 agentskills.io 开放标准，通过可复用的技能包扩展 AI 能力
- **跨平台**: 支持 macOS、Linux、Windows (PowerShell/WSL)、FreeBSD、OpenBSD、NetBSD

### 配置文件位置

Crush 配置文件按以下优先级加载：

1. `.crush.json` (项目根目录)
2. `crush.json` (项目根目录)
3. `$HOME/.config/crush/crush.json` (全局配置)

### Skills 发现路径

Crush 从以下路径发现 Skills：

- Unix: `~/.config/crush/skills/`
- Windows: `%LOCALAPPDATA%\crush\skills\`
- 自定义路径: 通过配置文件中的 `options.skills_paths` 指定

### 项目目标

通过统一的配置服务器，让团队成员能够快速、一致地配置 Crush 环境，包括：

- 统一的配置模板（providers、models、MCP、LSP 配置）
- 预装的官方 Agent Skills（来自 anthropics/skills 仓库）
- 跨平台一键安装脚本
- 版本控制和自动更新

服务基于 Next.js 16 App Router 构建，部署于 Vercel 平台。

## Glossary

- **Crush**: Charmbracelet 开发的终端 AI 编程助手 CLI 工具
- **Config_Server**: 配置服务器，提供配置模板、Skills 信息和安装脚本的 Next.js 应用
- **Config_API**: 配置 API 模块，负责返回 Crush 配置模板的 JSON 数据
- **Skills_API**: Skills API 模块，负责返回可用 Skills 列表和详情
- **Health_API**: 健康检查 API 模块，负责返回服务状态信息
- **Install_Script_Generator**: 安装脚本生成器，负责生成跨平台安装脚本
- **Web_UI**: Web 用户界面，提供可视化的配置管理和安装指引
- **Agent_Skill**: 符合 agentskills.io 标准的能力扩展模块，包含 SKILL.md 定义文件
- **SKILL.md**: Agent Skill 的核心文件，包含 YAML frontmatter（name、description）和 Markdown 指令
- **Config_Template**: 配置模板，定义 Crush 的默认配置结构（符合 https://charm.land/crush.json schema）
- **MCP**: Model Context Protocol，Anthropic 提出的模型上下文协议
- **LSP**: Language Server Protocol，语言服务器协议
- **Provider**: LLM 提供商（如 Anthropic、OpenAI、Gemini 等）

## Requirements

### Requirement 1: 配置模板 API

**User Story:** As a 团队成员, I want to 获取统一的 Crush 配置模板, so that 我可以快速配置本地 Crush 环境。

#### Acceptance Criteria

1. WHEN a client requests GET /api/config, THE Config_API SHALL return a JSON response containing version, updated_at, schema URL, options, skills configuration, and provider settings
2. WHEN the Config_API generates a response, THE Config_API SHALL include the current ISO 8601 timestamp in the updated_at field
3. WHEN the Config_API returns skills_paths, THE Config_API SHALL return platform-appropriate paths based on the request context
4. THE Config_API SHALL return a response with Content-Type header set to application/json
5. IF the Config_API encounters an internal error, THEN THE Config_API SHALL return a 500 status code with an error message

### Requirement 2: Skills 列表 API

**User Story:** As a 团队成员, I want to 查看可用的 Skills 列表, so that 我可以了解 Crush 支持的能力扩展。

#### Acceptance Criteria

1. WHEN a client requests GET /api/skills, THE Skills_API SHALL return a JSON response containing total count and skills array
2. WHEN a client requests GET /api/skills with category query parameter, THE Skills_API SHALL filter and return only skills matching the specified category
3. WHEN the Skills_API returns a skill, THE Skills_API SHALL include name, description, enabled status, and category fields
4. THE Skills_API SHALL support the following categories: creative, design, docs, dev
5. IF an invalid category is provided, THEN THE Skills_API SHALL return an empty skills array with total count of 0

### Requirement 3: 健康检查 API

**User Story:** As a 运维人员, I want to 检查服务健康状态, so that 我可以监控服务可用性。

#### Acceptance Criteria

1. WHEN a client requests GET /api/health, THE Health_API SHALL return a JSON response containing status, timestamp, and version fields
2. WHEN the service is running normally, THE Health_API SHALL return status as "ok"
3. THE Health_API SHALL return the current ISO 8601 timestamp in the timestamp field
4. THE Health_API SHALL return the application version in the version field
5. THE Health_API SHALL respond within 200 milliseconds under normal conditions

### Requirement 4: Unix 安装脚本生成

**User Story:** As a Linux/macOS 用户, I want to 通过一条命令安装 Crush 及其配置, so that 我可以快速完成环境配置。

#### Acceptance Criteria

1. WHEN a client requests GET /api/install/unix, THE Install_Script_Generator SHALL return a bash script with Content-Type text/plain
2. WHEN generating the script, THE Install_Script_Generator SHALL replace the BASE_URL placeholder with the actual server URL
3. IF Crush is not installed, THEN THE Install_Script_Generator SHALL generate a script that automatically downloads and installs the Crush binary from the server
4. THE Install_Script_Generator SHALL generate a script that detects the platform (linux/darwin) and architecture (amd64/arm64) to download the correct binary
5. THE Install_Script_Generator SHALL generate a script that creates the config directory at ~/.config/crush/
6. THE Install_Script_Generator SHALL generate a script that downloads and saves the configuration from /api/config
7. THE Install_Script_Generator SHALL generate a script that clones or updates the Skills repository from GitHub
8. THE Install_Script_Generator SHALL generate a script that validates the installation by checking crush binary, config file and skills directory existence

### Requirement 5: Windows 安装脚本生成

**User Story:** As a Windows 用户, I want to 通过一条命令安装 Crush 及其配置, so that 我可以快速完成环境配置。

#### Acceptance Criteria

1. WHEN a client requests GET /api/install/windows, THE Install_Script_Generator SHALL return a PowerShell script with Content-Type text/plain
2. WHEN generating the script, THE Install_Script_Generator SHALL replace the BASE_URL placeholder with the actual server URL
3. IF Crush is not installed, THEN THE Install_Script_Generator SHALL generate a script that automatically downloads and installs the Crush binary from the server
4. THE Install_Script_Generator SHALL generate a script that creates the config directory at %LOCALAPPDATA%\crush\
5. THE Install_Script_Generator SHALL generate a script that downloads and saves the configuration from /api/config
6. THE Install_Script_Generator SHALL generate a script that clones or updates the Skills repository from GitHub
7. THE Install_Script_Generator SHALL generate a script that validates the installation by checking crush binary, config file and skills directory existence
8. THE Install_Script_Generator SHALL generate a script that adds the Crush binary to the user's PATH if not already present

### Requirement 5.5: Crush 二进制文件托管

**User Story:** As a 用户, I want to 从配置服务器下载 Crush 二进制文件, so that 我不需要额外配置安装源。

#### Acceptance Criteria

1. THE Config_Server SHALL host Crush binary files for Linux (amd64, arm64), macOS (amd64, arm64), and Windows (amd64) platforms
2. WHEN a client requests GET /api/download/crush/{platform}/{arch}, THE Config_Server SHALL return the corresponding binary file
3. THE Config_Server SHALL return Content-Type application/octet-stream for binary downloads
4. THE Config_Server SHALL store binary files in the public/binaries directory
5. IF the requested binary does not exist, THEN THE Config_Server SHALL return a 404 status code

### Requirement 6: Web 用户界面

**User Story:** As a 团队成员, I want to 通过 Web 界面查看安装说明和 Skills 列表, so that 我可以直观地了解如何使用配置服务。

#### Acceptance Criteria

1. WHEN a user visits the root URL (/), THE Web_UI SHALL display a landing page with installation instructions for both Unix and Windows platforms
2. THE Web_UI SHALL display the Unix installation command: curl -fsSL {baseUrl}/api/install/unix | bash
3. THE Web_UI SHALL display the Windows installation command: iwr {baseUrl}/api/install/windows | iex
4. THE Web_UI SHALL display a list of available Skills with their names and descriptions
5. THE Web_UI SHALL display the main features of the configuration service
6. THE Web_UI SHALL be responsive and display correctly on mobile devices
7. THE Web_UI SHALL use a dark theme with appropriate color contrast for readability

### Requirement 7: 配置数据验证

**User Story:** As a 开发者, I want to 确保配置数据格式正确, so that 安装脚本可以正确解析和使用配置。

#### Acceptance Criteria

1. THE Config_API SHALL return a config object that conforms to the Crush configuration schema
2. WHEN serializing the config, THE Config_API SHALL produce valid JSON that can be parsed back to an equivalent object
3. THE Config_API SHALL ensure the version field follows semantic versioning format (X.Y.Z)
4. THE Config_API SHALL ensure all required fields are present in the response
5. IF a required field is missing in the internal config, THEN THE Config_API SHALL return a 500 error with details

### Requirement 8: Skills 数据管理

**User Story:** As a 管理员, I want to 管理 Skills 列表数据, so that 我可以控制团队可用的 Skills。

#### Acceptance Criteria

1. THE Skills_API SHALL maintain a predefined list of official Skills with accurate metadata
2. WHEN a skill is marked as enabled: false, THE Skills_API SHALL still include it in the response but with the enabled field set to false
3. THE Skills_API SHALL ensure each skill has a unique name identifier
4. THE Skills_API SHALL ensure skill names follow the kebab-case naming convention
5. THE Skills_API SHALL ensure skill descriptions are non-empty strings

### Requirement 9: 错误处理

**User Story:** As a 用户, I want to 在发生错误时获得清晰的错误信息, so that 我可以理解问题并采取适当的行动。

#### Acceptance Criteria

1. WHEN an API endpoint encounters an error, THE Config_Server SHALL return an appropriate HTTP status code (4xx for client errors, 5xx for server errors)
2. WHEN an error occurs, THE Config_Server SHALL return a JSON response with error and message fields
3. THE Config_Server SHALL log errors with sufficient context for debugging
4. IF a requested resource is not found, THEN THE Config_Server SHALL return a 404 status code
5. IF the request method is not supported, THEN THE Config_Server SHALL return a 405 status code

### Requirement 10: 安装脚本输出格式

**User Story:** As a 用户, I want to 在安装过程中看到清晰的进度和状态信息, so that 我可以了解安装是否成功。

#### Acceptance Criteria

1. THE Install_Script_Generator SHALL generate scripts that display colored output for success (green), error (red), info (blue), and warning (yellow) messages
2. THE Install_Script_Generator SHALL generate scripts that display a summary section at the end showing config file path, skills directory path, and skills count
3. THE Install_Script_Generator SHALL generate scripts that display the documentation URL after successful installation
4. THE Install_Script_Generator SHALL generate scripts that provide clear next steps including the crush login command
5. WHEN an installation step fails, THE Install_Script_Generator SHALL generate scripts that display the specific error and exit immediately

### Requirement 11: Vercel 部署配置

**User Story:** As a 开发者, I want to 将服务部署到 Vercel 平台, so that 团队成员可以通过公网访问配置服务。

#### Acceptance Criteria

1. THE Config_Server SHALL be deployable to Vercel with zero configuration (Vercel auto-detects Next.js)
2. THE Config_Server SHALL support Vercel's automatic HTTPS certificate provisioning
3. THE Config_Server SHALL implement URL detection logic that uses VERCEL_URL environment variable when available
4. THE Config_Server SHALL include a README with deployment instructions for both Git integration and CLI methods
5. WHERE custom caching is needed, THE Config_Server MAY include a vercel.json configuration file for cache headers
6. THE Config_Server SHALL support automatic deployments when connected to a Git repository (main branch → production, PR → preview)
