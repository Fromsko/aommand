# Crush Skills 配置总结

## 概述

Crush 支持 [Agent Skills](https://agentskills.io) 开放标准，这是一个可重用的技能包标准，用于扩展 AI 代理的能力。技能是包含 `SKILL.md` 文件的文件夹，Crush 可以按需发现和激活。

## 配置完成情况

### 1. Skills 目录
**位置**: `/root/.config/crush/skills/`

### 2. 配置文件
**项目级配置**: `/config/workspace/crush.json`

```json
{
  "$schema": "https://charm.land/crush.json",
  "options": {
    "skills_paths": [
      "/root/.config/crush/skills"
    ]
  }
}
```

### 3. 已安装的官方 Skills (16个)

从 [anthropics/skills](https://github.com/anthropics/skills) 仓库安装：

#### 创意与设计
- **algorithmic-art** - 使用 p5.js 创建算法艺术、生成艺术、流场或粒子系统
- **canvas-design** - 创建美观的视觉艺术（.png 和 .pdf），包括海报、设计作品
- **frontend-design** - 创建高质量的前端界面、网页组件、仪表盘、React 组件等

#### 文档处理
- **doc-coauthoring** - 结构化文档协作工作流，适用于编写文档、提案、技术规范等
- **docx** - Word 文档的创建、编辑、分析，支持修订模式、注释、格式保留
- **pdf** - PDF 工具包，支持文本提取、表格处理、创建、合并、分割文档和表单处理
- **pptx** - PowerPoint 演示文稿的创建、编辑和分析

#### 开发工具
- **mcp-builder** - 高质量 MCP (Model Context Protocol) 服务器开发指南
- **skill-creator** - 创建有效 skills 的指南
- **webapp-testing** - 使用 Playwright 测试本地 Web 应用程序的工具包
- **web-artifacts-builder** - 使用现代前端技术创建复杂的 HTML artifacts

#### 数据处理
- **xlsx** - Excel 表格的创建、编辑和分析，支持公式、格式、数据分析和可视化

#### 沟通与品牌
- **brand-guidelines** - 应用 Anthropic 官方品牌颜色和排版
- **internal-comms** - 编写各类内部通信的资源（状态报告、领导层更新、公司简报等）
- **slack-gif-creator** - 创建 Slack 优化动画 GIF 的知识和工具

#### 工具与主题
- **theme-factory** - 使用主题样式化 artifacts 的工具包，包含 10 个预设主题

## 技能工作原理

### 三级加载系统

1. **元数据** (name + description) - 始终在上下文中 (~100 words)
   - 用于确定何时激活技能
   - 在 SKILL.md 的 YAML frontmatter 中定义

2. **SKILL.md 正文** - 技能触发时加载 (<5k words)
   - 包含使用技能的指令和指导
   - 仅在技能触发后才加载

3. **捆绑资源** - 按 Claude 需要加载
   - `scripts/` - 可执行代码（Python/Bash 等）
   - `references/` - 文档和参考资料
   - `assets/` - 在输出中使用的文件（模板、图标、字体等）

### Skill 目录结构

```
skill-name/
├── SKILL.md          # 必需：说明 + 元数据
├── scripts/          # 可选：可执行代码
├── references/       # 可选：文档
└── assets/           # 可选：模板、资源
```

## 使用方法

### 自动激活
Crush 会根据任务的描述自动识别并激活合适的 skill。无需手动指定。

### 示例场景
- "创建一个文档" → 激活 docx skill
- "设计一个网页" → 激活 frontend-design skill
- "分析这个 PDF" → 激活 pdf skill
- "构建一个 MCP 服务器" → 激活 mcp-builder skill

## 技能配置路径

Crush 从以下路径发现技能：
1. **Unix 系统**: `~/.config/crush/skills/`
2. **Windows 系统**: `%LOCALAPPDATA%\crush\skills\`
3. **自定义路径**: 通过配置文件中的 `options.skills_paths` 指定
4. **环境变量**: 通过 `CRUSH_SKILLS_DIR` 环境变量覆盖默认路径

## 创建自定义技能

### 步骤概览
1. **理解技能** - 通过具体示例了解技能用途
2. **规划内容** - 分析并规划可重用的技能内容（脚本、参考、资产）
3. **初始化技能** - 运行 `init_skill.py` 创建模板
4. **编辑技能** - 实现资源并编写 SKILL.md
5. **打包技能** - 运行 `package_skill.py` 创建 .skill 文件
6. **迭代改进** - 基于实际使用进行迭代

### SKILL.md 格式

```yaml
---
name: skill-name
description: 清晰描述技能功能及何时使用
---

# Skill Name

## When to use this skill
[说明何时使用此技能]

## How to use
[具体使用步骤和指南]
```

### 必需字段
- **name**: 技能唯一标识符（1-64字符，小写字母、数字和连字符）
- **description**: 技能描述（1-1024字符，说明技能功能和适用场景）

## 官方资源

- **Agent Skills 官网**: https://agentskills.io
- **Anthropic Skills 仓库**: https://github.com/anthropics/skills
- **Crush 官方仓库**: https://github.com/charmbracelet/crush
- **MCP 协议文档**: https://modelcontextprotocol.io

## 配置验证

### 检查已安装的 skills
```bash
ls -la /root/.config/crush/skills/
```

### 查看 skill 信息
```bash
# 查看所有 skills 的简要信息
for skill in /root/.config/crush/skills/*/; do
  echo "=== $(basename "$skill") ==="
  head -5 "$skill/SKILL.md" 2>/dev/null
done
```

### 验证配置文件
```bash
cat /config/workspace/crush.json
```

## 兼容性

Agent Skills 标准被多个 AI 开发工具支持：
- Crush
- Claude Code
- Cursor
- VS Code (Insiders)
- OpenAI Codex

## 最佳实践

1. **渐进式披露**: 保持主要 SKILL.md 内容在 5000 tokens 以下
2. **文件引用**: 将详细参考材料分离到单独文件中
3. **自包含**: 脚本应该明确说明依赖关系
4. **错误处理**: 提供有用的错误消息和边缘情况处理
5. **避免重复**: 信息应该只在 SKILL.md 或 references 文件中存在一处

## Crush 全局配置

**全局配置文件**: `/config/.local/share/crush/crush.json`

当前配置包含：
- **Provider**: zai
- **Large Model**: glm-4.7 (max_tokens: 131072)
- **Small Model**: glm-4.5-air (max_tokens: 98304)

## 安装日期

2026-01-09

## Crush 版本

v0.31.0
