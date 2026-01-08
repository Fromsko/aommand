# Crush 统一配置部署方案

> 为团队快速统一 Crush 环境配置的完整解决方案

## 目录

- [方案概述](#方案概述)
- [架构设计](#架构设计)
- [快速开始](#快速开始)
- [详细实施](#详细实施)
- [部署指南](#部署指南)
- [使用说明](#使用说明)
- [维护指南](#维护指南)
- [常见问题](#常见问题)

---

## 方案概述

### 目标

通过统一的配置服务器，让团队成员能够快速、一致地配置 Crush 环境，包括：

- ✅ 统一的配置模板
- ✅ 预装的官方 Skills
- ✅ 一键安装脚本
- ✅ 版本控制和更新
- ✅ 跨平台支持（Windows/Linux/macOS）

### 方案特点

| 特性 | 说明 |
|------|------|
| **一键安装** | 一条命令完成所有配置 |
| **跨平台** | Windows、Linux、macOS 全支持 |
| **中心化管理** | 统一管理配置和 Skills |
| **版本控制** | 支持配置版本管理和回滚 |
| **增量更新** | 支持配置和 Skills 的自动更新 |
| **安全可靠** | HTTPS 传输，可选签名验证 |

### 适用场景

- 🏢 团队统一开发环境
- 📚 技术分享和培训
- 🚀 新成员快速上手
- 🔄 配置统一管理和更新

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel 服务器                          │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  /api/config│  │  /api/skills│  │  /install/* │       │
│  │  配置模板    │  │  Skills信息  │  │  安装脚本   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│         │                 │                 │               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  /api/health│  │  /api/docs  │  │    /web     │       │
│  │  健康检查    │  │  文档API    │  │  Web界面    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       用户本地环境                         │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ install.sh  │  │ install.bat │  │   Web UI    │       │
│  │ Unix安装脚本  │  │ Windows脚本 │  │  可选界面    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ crush.json │  │  ~/.config  │  │  /skills/   │       │
│  │  配置文件    │  │ /crush/     │  │  Skills目录  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

- **后端**: Next.js API Routes
- **部署**: Vercel
- **前端**: Next.js + Tailwind CSS（可选）
- **版本控制**: Git
- **配置管理**: JSON

### 数据流

```
用户执行安装脚本
    ↓
脚本检查环境（crush 是否安装）
    ↓
从服务器下载配置模板
    ↓
克隆/更新 Skills 仓库
    ↓
应用配置到本地
    ↓
验证安装结果
    ↓
完成并显示使用说明
```

---

## 快速开始

### 前置要求

- Vercel 账号
- Node.js 18+
- Git
- 测试用的 Windows/Linux/macOS 设备

### 5 分钟快速部署

```bash
# 1. 创建项目
npx create-next-app@latest crush-config --typescript --tailwind
cd crush-config

# 2. 添加必要的文件（见详细实施部分）

# 3. 部署到 Vercel
vercel login
vercel deploy

# 4. 获取部署 URL
# 假设部署 URL 是: https://crush-config.vercel.app

# 5. 测试安装（Linux/macOS）
curl -fsSL https://crush-config.vercel.app/install/unix | bash

# Windows PowerShell
iwr https://crush-config.vercel.app/install/win | iex
```

### 快速验证

安装完成后，验证配置：

```bash
# Linux/macOS
cat ~/.config/crush/crush.json
ls ~/.config/crush/skills/

# Windows
cat $env:LOCALAPPDATA\crush\crush.json
ls $env:LOCALAPPDATA\crush\skills
```

---

## 详细实施

### 项目结构

```
crush-config/
├── app/
│   ├── api/
│   │   ├── config/
│   │   │   └── route.ts          # 配置模板 API
│   │   ├── skills/
│   │   │   └── route.ts          # Skills 信息 API
│   │   ├── health/
│   │   │   └── route.ts          # 健康检查 API
│   │   ├── docs/
│   │   │   └── route.ts          # 文档 API
│   │   └── install/
│   │       ├── unix/
│   │       │   └── route.ts      # Unix 安装脚本
│   │       ├── windows/
│   │       │   └── route.ts      # Windows 安装脚本
│   │       └── route.ts          # 安装说明 API
│   ├── page.tsx                  # 首页（可选）
│   ├── layout.tsx
│   └── globals.css
├── public/
│   └── docs/                    # 文档文件
├── lib/
│   ├── config.ts                 # 配置定义
│   └── skills.ts                # Skills 管理
├── scripts/
│   ├── install-unix.sh           # Unix 安装脚本源
│   └── install-windows.ps1      # Windows 安装脚本源
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

### 1. 配置 API

**文件**: `app/api/config/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    version: "1.0.0",
    updated_at: new Date().toISOString(),
    $schema: "https://charm.land/crush.json",
    options: {
      skills_paths: process.platform === 'win32'
        ? ["%LOCALAPPDATA%\\crush\\skills"]
        : ["~/.config/crush/skills"]
    },
    skills: {
      repo: "https://github.com/anthropics/skills",
      branch: "main"
    },
    docs: {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/docs`,
      quickstart: `${process.env.NEXT_PUBLIC_SITE_URL}/docs/quickstart`
    },
    providers: {
      // 不包含敏感信息，只提供模板
      default_provider: "anthropic",
      models: {
        large: {
          default: "claude-3-5-sonnet-20241022",
          max_tokens: 200000
        },
        small: {
          default: "claude-3-haiku-20240307",
          max_tokens: 200000
        }
      }
    }
  }

  return NextResponse.json(config)
}
```

### 2. Skills API

**文件**: `app/api/skills/route.ts`

```typescript
import { NextResponse } from 'next/server'

// 预定义的 Skills 列表
const SKILLS = [
  {
    name: "algorithmic-art",
    description: "创建算法艺术，使用 p5.js",
    enabled: true,
    category: "creative"
  },
  {
    name: "brand-guidelines",
    description: "应用官方品牌指南",
    enabled: true,
    category: "design"
  },
  {
    name: "canvas-design",
    description: "创建视觉艺术（.png 和 .pdf）",
    enabled: true,
    category: "creative"
  },
  {
    name: "doc-coauthoring",
    description: "文档协作工作流",
    enabled: true,
    category: "docs"
  },
  {
    name: "docx",
    description: "Word 文档处理",
    enabled: true,
    category: "docs"
  },
  {
    name: "frontend-design",
    description: "前端界面设计",
    enabled: true,
    category: "dev"
  },
  {
    name: "mcp-builder",
    description: "MCP 服务器开发指南",
    enabled: true,
    category: "dev"
  },
  {
    name: "pdf",
    description: "PDF 工具包",
    enabled: true,
    category: "docs"
  },
  {
    name: "pptx",
    description: "PowerPoint 演示文稿处理",
    enabled: true,
    category: "docs"
  },
  {
    name: "skill-creator",
    description: "创建 skills 的指南",
    enabled: true,
    category: "dev"
  },
  {
    name: "webapp-testing",
    description: "Web 应用测试工具包",
    enabled: true,
    category: "dev"
  },
  {
    name: "xlsx",
    description: "Excel 表格处理",
    enabled: true,
    category: "docs"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let skills = SKILLS

  // 按类别过滤
  if (category) {
    skills = skills.filter(s => s.category === category)
  }

  return NextResponse.json({
    total: skills.length,
    skills
  })
}
```

### 3. 健康检查 API

**文件**: `app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0"
  })
}
```

### 4. Unix 安装脚本 API

**文件**: `app/api/install/unix/route.ts`

```typescript
import { NextResponse } from 'next/server'

const INSTALL_SCRIPT = `#!/bin/bash

# ============================================
# Crush 统一配置自动安装脚本
# 版本: 1.0.0
# ============================================

set -e

# 颜色定义
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# 配置
BASE_URL="\${BASE_URL:-{{BASE_URL}}"
CONFIG_DIR="\$HOME/.config/crush"
CONFIG_FILE="\$CONFIG_DIR/crush.json"
SKILLS_DIR="\$CONFIG_DIR/skills"
TEMP_DIR="/tmp/crush-install-\$\$"

# 打印带颜色的消息
print_success() {
    echo -e "\${GREEN}✓ \$1\${NC}"
}

print_error() {
    echo -e "\${RED}✗ \$1\${NC}"
}

print_info() {
    echo -e "\${BLUE}ℹ \$1\${NC}"
}

print_warning() {
    echo -e "\${YELLOW}⚠ \$1\${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "\$1" &> /dev/null
}

# 1. 检查 Crush 是否已安装
echo -e "\${BLUE}========================================\${NC}"
echo -e "\${BLUE}Crush 统一配置安装程序\${NC}"
echo -e "\${BLUE}========================================\${NC}"
echo ""

if ! command_exists crush; then
    print_error "Crush 未安装"
    echo ""
    echo "请先安装 Crush："
    echo ""
    if [[ "\$OSTYPE" == "darwin"* ]]; then
        echo "  macOS:"
        echo "  brew install crush"
        echo "  或下载: https://github.com/charmbracelet/crush/releases"
    elif [[ "\$OSTYPE" == "linux-gnu"* ]]; then
        echo "  Linux:"
        echo "  curl -fsSL https://crush.install.sh | bash"
        echo "  或下载: https://github.com/charmbracelet/crush/releases"
    fi
    echo ""
    exit 1
fi

print_success "Crush 已安装: \$(crush --version)"
echo ""

# 2. 获取服务器配置
print_info "正在从服务器下载配置..."
CONFIG_RESPONSE=\$(curl -s "\$BASE_URL/api/config")

if [[ \$? -ne 0 ]]; then
    print_error "无法连接到服务器: \$BASE_URL"
    exit 1
fi

print_success "配置下载成功"
echo ""

# 3. 显示配置信息
print_info "配置信息:"
echo "  版本: \$(echo "\$CONFIG_RESPONSE" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)"
echo "  更新时间: \$(echo "\$CONFIG_RESPONSE" | grep -o '"updated_at":"[^"]*"' | cut -d'"' -f4)"
echo ""

# 4. 创建目录
print_info "创建必要的目录..."
mkdir -p "\$CONFIG_DIR"
mkdir -p "\$SKILLS_DIR"
print_success "目录创建完成"
echo ""

# 5. 保存配置文件
print_info "保存配置文件..."
echo "\$CONFIG_RESPONSE" > "\$CONFIG_FILE"

# 美化 JSON（如果 python3 可用）
if command_exists python3; then
    python3 -m json.tool "\$CONFIG_FILE" > "\$CONFIG_FILE.tmp" 2>/dev/null && mv "\$CONFIG_FILE.tmp" "\$CONFIG_FILE"
fi

print_success "配置文件已保存: \$CONFIG_FILE"
echo ""

# 6. 安装/更新 Skills
if [[ -d "\$SKILLS_DIR/.git" ]]; then
    print_info "更新 Skills..."
    cd "\$SKILLS_DIR"
    git fetch origin
    git pull origin main
else
    print_info "安装 Skills..."
    rm -rf "\$SKILLS_DIR"
    mkdir -p "\$SKILLS_DIR"

    # 克隆仓库
    git clone https://github.com/anthropics/skills.git "\$SKILLS_DIR"

    # 移动文件
    if [[ -d "\$SKILLS_DIR/skills" ]]; then
        mv "\$SKILLS_DIR/skills"/* "\$SKILLS_DIR/" 2>/dev/null || true
        rm -rf "\$SKILLS_DIR/skills"
    fi
fi

# 统计 Skills 数量
SKILLS_COUNT=\$(ls -1 "\$SKILLS_DIR" 2>/dev/null | wc -l | tr -d ' ')
print_success "Skills 已安装/更新: \$SKILLS_COUNT 个"
echo ""

# 7. 验证安装
print_info "验证安装..."

# 检查配置文件
if [[ ! -f "\$CONFIG_FILE" ]]; then
    print_error "配置文件不存在"
    exit 1
fi

# 检查 Skills 目录
if [[ ! -d "\$SKILLS_DIR" ]]; then
    print_error "Skills 目录不存在"
    exit 1
fi

# 检查至少有一个 Skill
if [[ \$SKILLS_COUNT -eq 0 ]]; then
    print_error "没有安装任何 Skills"
    exit 1
fi

print_success "验证通过"
echo ""

# 8. 显示安装总结
echo -e "\${GREEN}========================================\${NC}"
echo -e "\${GREEN}✅ 安装成功！\${NC}"
echo -e "\${GREEN}========================================\${NC}"
echo ""
echo "📋 安装信息:"
echo "  配置文件: \$CONFIG_FILE"
echo "  Skills 目录: \$SKILLS_DIR"
echo "  Skills 数量: \$SKILLS_COUNT"
echo ""
echo "📖 文档地址: \$BASE_URL/docs"
echo ""
echo "🚀 现在可以运行 'crush' 开始使用了！"
echo ""
print_warning "提示: 需要配置 API Key 的同事，请运行:"
echo "  crush login"
echo ""
`

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

  // 替换脚本中的占位符
  const script = INSTALL_SCRIPT.replace(/\{\{BASE_URL\}\}/g, baseUrl)

  return new Response(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="install-crush.sh"'
    }
  })
}
```

### 5. Windows 安装脚本 API

**文件**: `app/api/install/windows/route.ts`

```typescript
import { NextResponse } from 'next/server'

const INSTALL_SCRIPT = `# Crush 统一配置自动安装脚本 (Windows PowerShell)
# 版本: 1.0.0

# 错误处理设置
\$ErrorActionPreference = "Stop"

# 配置
\$BaseUrl = if (\$env:BASE_URL) { \$env:BASE_URL } else { "{{BASE_URL}}" }
\$ConfigDir = "\$env:LOCALAPPDATA\\crush"
\$ConfigFile = "\$ConfigDir\\crush.json"
\$SkillsDir = "\$ConfigDir\\skills"

# 打印带颜色的消息
function Print-Success {
    param([string]\$message)
    Write-Host "✓ \$message" -ForegroundColor Green
}

function Print-Error {
    param([string]\$message)
    Write-Host "✗ \$message" -ForegroundColor Red
}

function Print-Info {
    param([string]\$message)
    Write-Host "ℹ \$message" -ForegroundColor Cyan
}

function Print-Warning {
    param([string]\$message)
    Write-Host "⚠ \$message" -ForegroundColor Yellow
}

# 1. 检查 Crush 是否已安装
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Crush 统一配置安装程序" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

\$crushCommand = Get-Command crush -ErrorAction SilentlyContinue
if (-not \$crushCommand) {
    Print-Error "Crush 未安装"
    Write-Host ""
    Write-Host "请先安装 Crush："
    Write-Host ""
    Write-Host "  1. 访问: https://github.com/charmbracelet/crush/releases"
    Write-Host "  2. 下载 Windows 版本"
    Write-Host "  3. 解压并添加到 PATH"
    Write-Host ""
    exit 1
}

# 获取 Crush 版本
\$crushVersion = & crush --version 2>&1
Print-Success "Crush 已安装: \$crushVersion"
Write-Host ""

# 2. 获取服务器配置
Print-Info "正在从服务器下载配置..."
try {
    \$ConfigResponse = Invoke-RestMethod -Uri "\$BaseUrl/api/config"
} catch {
    Print-Error "无法连接到服务器: \$BaseUrl"
    Write-Host "错误: \$\$_"
    exit 1
}

Print-Success "配置下载成功"
Write-Host ""

# 3. 显示配置信息
Print-Info "配置信息:"
Write-Host "  版本: \$(\$ConfigResponse.version)"
Write-Host "  更新时间: \$(\$ConfigResponse.updated_at)"
Write-Host ""

# 4. 创建目录
Print-Info "创建必要的目录..."
New-Item -ItemType Directory -Force -Path \$ConfigDir | Out-Null
New-Item -ItemType Directory -Force -Path \$SkillsDir | Out-Null
Print-Success "目录创建完成"
Write-Host ""

# 5. 保存配置文件
Print-Info "保存配置文件..."
\$ConfigResponse | ConvertTo-Json -Depth 10 | Out-File \$ConfigFile -Encoding utf8
Print-Success "配置文件已保存: \$ConfigFile"
Write-Host ""

# 6. 安装/更新 Skills
if (Test-Path "\$SkillsDir\\.git") {
    Print-Info "更新 Skills..."
    Set-Location \$SkillsDir
    git fetch origin
    git pull origin main
} else {
    Print-Info "安装 Skills..."

    # 删除旧的（如果有）
    Remove-Item -Path \$SkillsDir -Recurse -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path \$SkillsDir | Out-Null

    # 克隆仓库
    git clone https://github.com/anthropics/skills.git \$SkillsDir

    # 移动文件
    if (Test-Path "\$SkillsDir\\skills") {
        Move-Item -Path "\$SkillsDir\\skills\\*" -Destination \$SkillsDir -ErrorAction SilentlyContinue
        Remove-Item -Path "\$SkillsDir\\skills" -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 统计 Skills 数量
\$SkillsCount = (Get-ChildItem \$SkillsDir -Directory).Count
Print-Success "Skills 已安装/更新: \$SkillsCount 个"
Write-Host ""

# 7. 验证安装
Print-Info "验证安装..."

# 检查配置文件
if (-not (Test-Path \$ConfigFile)) {
    Print-Error "配置文件不存在"
    exit 1
}

# 检查 Skills 目录
if (-not (Test-Path \$SkillsDir)) {
    Print-Error "Skills 目录不存在"
    exit 1
}

# 检查至少有一个 Skill
if (\$SkillsCount -eq 0) {
    Print-Error "没有安装任何 Skills"
    exit 1
}

Print-Success "验证通过"
Write-Host ""

# 8. 显示安装总结
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ 安装成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 安装信息:"
Write-Host "  配置文件: \$ConfigFile"
Write-Host "  Skills 目录: \$SkillsDir"
Write-Host "  Skills 数量: \$SkillsCount"
Write-Host ""
Write-Host "📖 文档地址: \$BaseUrl/docs"
Write-Host ""
Write-Host "🚀 现在可以运行 'crush' 开始使用了！"
Write-Host ""
Print-Warning "提示: 需要配置 API Key 的同事，请运行:"
Write-Host "  crush login"
Write-Host ""
`

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

  // 替换脚本中的占位符
  const script = INSTALL_SCRIPT.replace(/\{\{BASE_URL\}\}/g, baseUrl)

  return new Response(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="install-crush.ps1"'
    }
  })
}
```

### 6. 可选：Web 首页

**文件**: `app/page.tsx`

```tsx
'use client'

import { useState } from 'react'

export default function Home() {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            🚀 Crush 配置中心
          </h1>
          <p className="text-xl text-slate-300">
            为团队快速统一 Crush 环境配置
          </p>
        </div>

        {/* Quick Install */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Unix Install */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🐧</span>
              Linux / macOS
            </h2>
            <div className="bg-slate-900 rounded p-4 font-mono text-sm mb-4">
              <code>curl -fsSL {baseUrl}/install/unix | bash</code>
            </div>
            <p className="text-slate-400 text-sm">
              支持 bash、zsh 等兼容 Bourne shell 的环境
            </p>
          </div>

          {/* Windows Install */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🪟</span>
              Windows
            </h2>
            <div className="bg-slate-900 rounded p-4 font-mono text-sm mb-4">
              <code>iwr {baseUrl}/install/win | iex</code>
            </div>
            <p className="text-slate-400 text-sm">
              需要 PowerShell 5.1 或更高版本
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">✨ 主要特性</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: '一键安装', desc: '一条命令完成所有配置' },
              { icon: '🌍', title: '跨平台', desc: 'Windows、Linux、macOS 全支持' },
              { icon: '🔄', title: '自动更新', desc: 'Skills 和配置自动同步更新' },
              { icon: '📦', title: '预装 Skills', desc: '包含 16+ 官方 Skills' },
              { icon: '🎯', title: '统一配置', desc: '团队环境完全一致' },
              { icon: '🔒', title: '安全可靠', desc: 'HTTPS 传输，配置安全' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Preview */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">📚 包含的 Skills</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'docx', desc: 'Word 文档处理' },
              { name: 'pdf', desc: 'PDF 工具包' },
              { name: 'pptx', desc: 'PowerPoint 演示文稿' },
              { name: 'xlsx', desc: 'Excel 表格处理' },
              { name: 'frontend-design', desc: '前端界面设计' },
              { name: 'mcp-builder', desc: 'MCP 服务器开发' },
              { name: 'webapp-testing', desc: 'Web 应用测试' },
              { name: 'skill-creator', desc: '创建 Skills' }
            ].map((skill, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="font-semibold text-blue-400 mb-1">{skill.name}</div>
                <div className="text-sm text-slate-400">{skill.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-slate-400">
            共 16+ 个官方 Skills · 访问 <a href={`${baseUrl}/api/skills`} className="text-blue-400 hover:underline">/api/skills</a> 查看完整列表
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400">
          <p>Powered by Next.js + Vercel</p>
          <p className="mt-2">
            问题反馈: <a href="https://github.com/charmbracelet/crush/issues" className="text-blue-400 hover:underline">GitHub Issues</a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 7. 环境变量配置

**文件**: `.env.local`

```bash
# 站点 URL（部署后 Vercel 会自动设置）
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

---

## 部署指南

### 部署到 Vercel

#### 方法 1: 使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 按照提示操作：
# - ? Set up and deploy "~/crush-config"? [Y/n] y
# - ? Which scope do you want to deploy to? Your Name
# - ? Link to existing project? [y/N] n
# - ? What's your project's name? crush-config
# - ? In which directory is your code located? ./
# - ? Want to override the settings? [y/N] n

# 4. 生产部署
vercel --prod
```

#### 方法 2: 使用 Vercel Dashboard

1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库或上传代码
4. 配置构建命令：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. 添加环境变量：
   - `NEXT_PUBLIC_SITE_URL`: `https://your-project-name.vercel.app`
6. 点击 "Deploy"

### 部署到其他平台

#### Docker 部署

**文件**: `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**部署命令**:

```bash
# 构建镜像
docker build -t crush-config .

# 运行容器
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  crush-config
```

---

## 使用说明

### 用户端安装步骤

#### Linux/macOS

```bash
# 方法 1: 一键安装（推荐）
curl -fsSL https://your-site.vercel.app/install/unix | bash

# 方法 2: 先下载再执行
curl -O https://your-site.vercel.app/install/unix
chmod +x unix
./unix
```

#### Windows (PowerShell)

```powershell
# 方法 1: 一键安装（推荐）
iwr https://your-site.vercel.app/install/win | iex

# 方法 2: 先下载再执行
iwr -OutFile install.ps1 https://your-site.vercel.app/install/win
.\install.ps1
```

### 验证安装

```bash
# 检查配置
cat ~/.config/crush/cush.json  # Linux/macOS
cat $env:LOCALAPPDATA\crush\crush.json  # Windows

# 检查 Skills
ls ~/.config/crush/skills/  # Linux/macOS
ls $env:LOCALAPPDATA\crush\skills  # Windows

# 运行 Crush
crush
```

### 手动更新

```bash
# Linux/macOS
curl -fsSL https://your-site.vercel.app/install/unix | bash

# Windows
iwr https://your-site.vercel.app/install/win | iex
```

### 配置 API Key

Crush 配置不包含 API Key，需要用户单独配置：

```bash
# 使用 Crush 登录
crush login

# 或手动编辑配置文件
```

### 自定义安装

#### 指定安装路径

```bash
# Linux/macOS
export SKILLS_DIR=~/my-skills
curl -fsSL https://your-site.vercel.app/install/unix | bash

# Windows
$env:SKILLS_DIR="C:\my-skills"
iwr https://your-site.vercel.app/install/win | iex
```

#### 仅更新 Skills

```bash
# Linux/macOS
cd ~/.config/crush/skills
git pull

# Windows
cd $env:LOCALAPPDATA\crush\skills
git pull
```

---

## 维护指南

### 更新配置

当需要更新配置模板时：

1. 修改 `app/api/config/route.ts` 中的配置
2. 重新部署到 Vercel
3. 用户运行安装脚本即可自动获取新配置

### 添加/删除 Skills

1. 修改 `app/api/skills/route.ts` 中的 SKILLS 列表
2. 重新部署
3. 用户下次运行安装脚本会看到更新

### 版本管理

#### 发布新版本

```typescript
// app/api/config/route.ts
const config = {
  version: "1.1.0",  // 更新版本号
  // ...
}
```

#### 通知用户更新

可以在 Web 首页或文档中添加版本信息。

### 监控和维护

#### 健康检查

```bash
# 检查服务器状态
curl https://your-site.vercel.app/api/health

# 应返回：
# {
#   "status": "ok",
#   "timestamp": "2024-01-09T12:00:00.000Z",
#   "version": "1.0.0"
# }
```

#### 日志分析

通过 Vercel Dashboard 查看访问日志和错误。

### 备份和恢复

#### 备份配置

```bash
# Linux/macOS
tar -czf crush-backup.tar.gz ~/.config/crush/

# Windows
Compress-Archive -Path "$env:LOCALAPPDATA\crush" -DestinationPath crush-backup.zip
```

#### 恢复配置

```bash
# Linux/macOS
tar -xzf crush-backup.tar.gz -C ~/

# Windows
Expand-Archive -Path crush-backup.zip -DestinationPath "$env:LOCALAPPDATA"
```

---

## 常见问题

### 安装问题

**Q: 提示 "Crush 未安装"？**

A: 需要先安装 Crush：
- Linux/macOS: `brew install crush` 或从 GitHub 下载
- Windows: 从 https://github.com/charmbracelet/crush/releases 下载

**Q: 安装失败，提示 "无法连接到服务器"？**

A: 检查：
1. 网络连接是否正常
2. 服务器 URL 是否正确
3. 防火墙是否阻止访问

**Q: Skills 下载失败？**

A: 检查：
1. Git 是否已安装
2. 网络是否能访问 GitHub
3. 尝试手动克隆：`git clone https://github.com/anthropics/skills.git`

### 配置问题

**Q: 如何添加自定义 Skills？**

A:
```bash
# 将自定义 Skills 复制到 skills 目录
cp -r my-custom-skill ~/.config/crush/skills/
```

**Q: 如何修改配置？**

A: 编辑配置文件：
```bash
# Linux/macOS
nano ~/.config/crush/crush.json

# Windows
notepad $env:LOCALAPPDATA\crush\crush.json
```

**Q: API Key 配置在哪里？**

A: Crush 配置不包含敏感信息。使用：
```bash
crush login
```

### 更新问题

**Q: 如何检查是否有更新？**

A: 运行安装脚本，会自动检测并更新：
```bash
curl -fsSL https://your-site.vercel.app/install/unix | bash
```

**Q: 更新会覆盖我的配置吗？**

A: 配置模板会覆盖，但建议：
1. 备份配置：`cp ~/.config/crush/cush.json ~/.config/crush/cush.json.backup`
2. 合并自定义配置到新模板

### 兼容性问题

**Q: 支持哪些 Shell？**

A:
- Linux: bash, zsh, fish 等 Bourne shell
- Windows: PowerShell 5.1+

**Q: 需要 Node.js 吗？**

A: 不需要。用户端只需要 Crush，服务器端需要 Node.js。

**Q: 可以在公司内网使用吗？**

A: 可以，但需要：
1. 在内网部署服务器
2. 修改 `BASE_URL` 指向内网地址
3. 确保可以访问 GitHub（或使用内网镜像）

---

## 附录

### API 文档

#### GET `/api/config`

返回配置模板。

**响应示例**:

```json
{
  "version": "1.0.0",
  "updated_at": "2024-01-09T12:00:00.000Z",
  "$schema": "https://charm.land/crush.json",
  "options": {
    "skills_paths": ["~/.config/crush/skills"]
  }
}
```

#### GET `/api/skills`

返回 Skills 列表。

**查询参数**:
- `category`: 按类别过滤（可选）

**响应示例**:

```json
{
  "total": 12,
  "skills": [
    {
      "name": "docx",
      "description": "Word 文档处理",
      "enabled": true,
      "category": "docs"
    }
  ]
}
```

#### GET `/api/health`

健康检查。

**响应示例**:

```json
{
  "status": "ok",
  "timestamp": "2024-01-09T12:00:00.000Z",
  "version": "1.0.0"
}
```

#### GET `/install/unix`

返回 Unix 安装脚本。

**Content-Type**: `text/plain; charset=utf-8`

#### GET `/install/win`

返回 Windows 安装脚本。

**Content-Type**: `text/plain; charset=utf-8`

### 配置选项

```typescript
interface CrushConfig {
  version: string              // 配置版本
  updated_at: string          // 更新时间（ISO 8601）
  $schema: string             // JSON Schema URL
  options: {
    skills_paths: string[]     // Skills 搜索路径
  }
  skills: {
    repo: string              // Skills 仓库 URL
    branch: string            // 仓库分支
  }
  docs: {
    url: string              // 文档地址
    quickstart: string       // 快速开始地址
  }
}
```

### 目录结构规范

#### Unix 系统

```
~/.config/crush/
├── crush.json              # 配置文件
└── skills/                 # Skills 目录
    ├── skill-1/
    │   └── SKILL.md
    ├── skill-2/
    │   └── SKILL.md
    └── ...
```

#### Windows 系统

```
%LOCALAPPDATA%\crush\
├── crush.json              # 配置文件
└── skills/                 # Skills 目录
    ├── skill-1/
    │   └── SKILL.md
    ├── skill-2/
    │   └── SKILL.md
    └── ...
```

### 相关链接

- [Crush 官方仓库](https://github.com/charmbracelet/crush)
- [Crush 文档](https://crush.dev)
- [Agent Skills](https://agentskills.io)
- [Anthropic Skills](https://github.com/anthropics/skills)
- [Vercel 部署](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)

---

## 许可证

本方案基于 MIT 许可证开源。使用时请保留版权声明。

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 更新日志

### v1.0.0 (2024-01-09)

- ✅ 初始版本发布
- ✅ 支持 Linux/macOS/Windows
- ✅ 包含 16+ 官方 Skills
- ✅ 一键安装脚本
- ✅ Web 界面（可选）
- ✅ 自动更新功能

---

**文档版本**: 1.0.0
**最后更新**: 2024-01-09
