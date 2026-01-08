# CRUSH 统一配置部署方案 - 技术点分析

> 从文档中提取的技术点，按前端框架、AI 相关、工程实践三类归纳
>
> ⚠️ **2026 年 1 月更新**：已同步最新框架版本信息

---

## 📊 技术版本速查表（2026 年 1 月）

| 技术            | 最新版本 | 官方文档                                             | 主要变更                            |
| --------------- | -------- | ---------------------------------------------------- | ----------------------------------- |
| **Next.js**     | v16.1.1  | [nextjs.org/docs](https://nextjs.org/docs)           | Turbopack 改进、Server Actions 增强 |
| **TailwindCSS** | v4.1.18  | [tailwindcss.com/docs](https://tailwindcss.com/docs) | 配置文件结构变更、JIT 优化          |
| **DaisyUI**     | v5.5.14  | [daisyui.com](https://daisyui.com)                   | 需配合 Tailwind v4.x                |
| **React**       | v19.x    | [react.dev](https://react.dev)                       | Server Components 稳定              |

---

## 一、前端框架

### 1. Next.js (App Router)

**当前版本**：v16.1.1

**用途**：

- 全栈框架，同时处理前端页面和后端 API
- 使用 App Router (`app/` 目录) 组织路由
- API Routes (`app/api/*/route.ts`) 提供 RESTful 接口
- v16.x 引入 Turbopack 改进和 Server Actions 增强

**文档中的应用**：

```typescript
// app/api/config/route.ts
export async function GET() {
  return NextResponse.json(config);
}
```

#### 📂 路由方式对比

Next.js 提供两种路由方式：**Pages Router**（传统）和 **App Router**（现代，推荐）

| 特性                    | Pages Router            | App Router                       |
| ----------------------- | ----------------------- | -------------------------------- |
| 路由目录                | `pages/`                | `app/`                           |
| 页面文件                | `index.js` / `about.js` | `page.tsx`                       |
| 动态路由                | `[id].js`               | `[id]/page.tsx`                  |
| API 路由                | `pages/api/*.ts`        | `app/api/*/route.ts`             |
| React Server Components | ❌ 不支持               | ✅ 支持                          |
| 并行路由                | ❌                      | ✅ `@folder`                     |
| 拦截路由                | ❌                      | ✅ `(.)folder`                   |
| 错误/加载状态           | 手动处理                | 内置 `error.tsx` / `loading.tsx` |
| 路由分组                | ❌                      | ✅ `(group)`                     |
| 适用场景                | 小型项目、旧代码库      | 新项目、大型应用                 |

**目录结构示例**：

```
# Pages Router (传统)
pages/
├── index.js          → /
├── about.js          → /about
├── blog/[id].js      → /blog/123
└── api/
    └── hello.ts      → /api/hello

# App Router (推荐)
app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
├── blog/
│   └── [id]/
│       └── page.tsx  → /blog/123
├── api/
│   └── hello/
│       └── route.ts  → /api/hello
├── (marketing)/      → 路由分组，不影响 URL
│   ├── pricing/
│   └── features/
├── @modal/           → 并行路由
├── loading.tsx       → 加载状态
└── error.tsx         → 错误边界
```

**App Router 高级功能**：

```tsx
// 1. 路由分组 - 组织代码不影响 URL
app/(marketing)/pricing/page.tsx  → /pricing
app/(dashboard)/settings/page.tsx → /settings

// 2. 并行路由 - 同时渲染多个页面
app/@modal/login/page.tsx  // 模态框路由
app/layout.tsx             // 同时接收 children 和 modal

// 3. 拦截路由 - 不跳转加载内容
app/feed/(..)photo/[id]/page.tsx  // 拦截 /photo/[id]

// 4. 内置加载状态
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />
}

// 5. 错误边界
// app/dashboard/error.tsx
'use client'
export default function Error({ error, reset }) {
  return <button onClick={reset}>重试</button>
}
```

**⚠️ 常见坑点**：

1. **SSR 与 CSR 混用导致 Hydration 错误**

   ```tsx
   // ❌ 错误：服务端和客户端渲染结果不一致
   <div>{new Date().toLocaleString()}</div>;

   // ✅ 正确：使用 useEffect 或 suppressHydrationWarning
   const [time, setTime] = useState<string>();
   useEffect(() => setTime(new Date().toLocaleString()), []);
   ```

2. **App Router 与 Pages Router 兼容性**

   - 不要在同一项目混用两种路由
   - 迁移时逐步替换，使用 `next.config.js` 配置

3. **Serverless 数据库连接池管理**

   ```typescript
   // ✅ 使用 Prisma 时配置连接池
   // prisma/schema.prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL") // Vercel Serverless 需要
   }
   ```

4. **Server Components vs Client Components**

   ```tsx
   // 默认是 Server Component，使用 hooks 需标记
   "use client";
   import { useState } from "react";

   // Server Component 中安全访问数据库
   // app/users/page.tsx (无需 'use client')
   import { db } from "@/lib/db";
   export default async function UsersPage() {
     const users = await db.user.findMany();
     return <UserList users={users} />;
   }
   ```

5. **UI 框架兼容性**
   - 部分 UI 库（如 DaisyUI）在 SSR 下可能有 hydration 问题
   - 需要测试并可能使用 `dynamic import` + `ssr: false`

> 💡 **建议**：新项目优先选择 App Router，充分利用 React Server Components 和高级路由功能

---

### 2. TailwindCSS

**当前版本**：v4.1.18

**用途**：

- 原子化 CSS 框架
- 快速构建响应式 UI
- 无需编写自定义 CSS

**文档中的应用**：

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
  <h1 className="text-5xl font-bold mb-4">🚀 Crush 配置中心</h1>
</div>
```

**⚠️ 常见坑点**：

1. **v4.x 配置文件变更**

   ```javascript
   // v4.x 新配置结构
   // tailwind.config.js
   export default {
     content: ["./app/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: {
         // v4.x 对 theme 配置有调整
       },
     },
   };
   ```

2. **JIT 模式下类名冲突**

   ```tsx
   // ❌ 避免动态拼接类名
   className={`text-${color}-500`}

   // ✅ 使用完整类名或 clsx
   className={color === 'red' ? 'text-red-500' : 'text-blue-500'}
   ```

3. **与 CSS-in-JS 混用优先级问题**
   - Tailwind 类和 styled-components 可能冲突
   - 建议选择一种方案为主

---

### 3. DaisyUI

**当前版本**：v5.5.14

**用途**：

- Tailwind CSS 组件库
- 提供预设计的 UI 组件
- 支持多主题切换

**⚠️ 常见坑点**：

1. **版本绑定**

   ```bash
   # DaisyUI v5.x 必须配合 TailwindCSS v4.x
   npm install daisyui@5 tailwindcss@4
   ```

2. **SSR 渲染不一致**

   ```tsx
   // 部分组件在 Next.js SSR 下可能出现 hydration mismatch
   // 解决方案：使用 dynamic import
   import dynamic from "next/dynamic";
   const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });
   ```

3. **主题切换配置**
   ```javascript
   // tailwind.config.js
   module.exports = {
     plugins: [require("daisyui")],
     daisyui: {
       themes: ["light", "dark", "cupcake"],
     },
   };
   ```

---

### 4. React Server Components (RSC)

**用途**：

- 服务端渲染组件，减少客户端 JS
- 直接在组件中访问数据库/文件系统
- 默认所有组件都是 Server Component

**文档中的应用**：

```tsx
// 'use client' 标记客户端组件
'use client'
import { useState } from 'react'
export default function Home() { ... }
```

**注意事项**：

- 使用 `useState`、`useEffect` 等 hooks 必须标记 `'use client'`
- Server Component 不能传递函数给 Client Component
- 数据获取优先在 Server Component 中进行

---

## 二、AI 相关

### 1. Crush CLI

**用途**：

- Anthropic 官方 AI 助手命令行工具
- 支持 Skills 扩展能力
- 本地开发和自动化任务

**文档中的应用**：

```bash
# 检查安装
crush --version

# 登录配置 API Key
crush login
```

**注意事项**：

- 需要 Anthropic API Key
- Skills 路径配置在 `crush.json`
- 不同平台配置目录不同

---

### 2. Skills 系统

**用途**：

- 扩展 AI 助手能力的模块化系统
- 每个 Skill 包含 `SKILL.md` 定义文件
- 支持文档处理、代码生成、设计等场景

**文档中的应用**：

```typescript
const SKILLS = [
  { name: "docx", description: "Word 文档处理", category: "docs" },
  { name: "mcp-builder", description: "MCP 服务器开发", category: "dev" },
  // ...
];
```

**注意事项**：

- Skills 存放在 `~/.config/crush/skills/` (Unix) 或 `%LOCALAPPDATA%\crush\skills` (Windows)
- 官方 Skills 仓库：https://github.com/anthropics/skills
- 可以创建自定义 Skills

---

### 3. MCP (Model Context Protocol)

**用途**：

- Anthropic 提出的模型上下文协议
- 标准化 AI 与外部工具/数据的交互
- 文档中提到 `mcp-builder` Skill

**注意事项**：

- MCP 是开放协议，不限于 Anthropic
- 需要配置 MCP 服务器
- 与 Skills 系统互补

---

## 三、工程实践

### 1. Vercel 部署

**用途**：

- Next.js 官方推荐的部署平台
- 自动 CI/CD、边缘网络、Serverless Functions
- 免费额度适合个人/小团队

**文档中的应用**：

```bash
# CLI 部署
vercel login
vercel deploy
vercel --prod

# 环境变量
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

**⚠️ Serverless 数据库接入注意**：

```typescript
// 推荐使用 Prisma 或 Drizzle ORM
// 配置连接池避免连接数爆炸

// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// 或使用 @vercel/postgres
import { sql } from '@vercel/postgres'
```

**注意事项**：

- `NEXT_PUBLIC_` 前缀的环境变量会暴露给客户端
- Serverless Functions 有执行时间限制（免费版 10s）
- 注意 Vercel 的带宽和请求数限制

---

### 2. 跨平台安装脚本

**用途**：

- 一键安装配置，降低用户门槛
- 支持 Unix (bash) 和 Windows (PowerShell)
- 自动检测环境、下载配置、安装 Skills

**文档中的应用**：

```bash
# Unix
curl -fsSL https://site.vercel.app/install/unix | bash

# Windows
iwr https://site.vercel.app/install/win | iex
```

**注意事项**：

- `curl | bash` 有安全风险，建议用户先审查脚本
- PowerShell 执行策略可能阻止脚本运行
- 脚本需要处理各种边界情况（网络失败、权限不足等）

---

### 3. API 设计 (RESTful)

**用途**：

- 提供配置、Skills 信息、健康检查等接口
- 安装脚本通过 API 获取数据
- 支持版本控制和动态更新

**文档中的应用**：

```
GET /api/config    → 配置模板
GET /api/skills    → Skills 列表
GET /api/health    → 健康检查
GET /install/unix  → Unix 安装脚本
GET /install/win   → Windows 安装脚本
```

**注意事项**：

- 使用 `NextResponse.json()` 返回 JSON
- 设置正确的 `Content-Type` 和 `Content-Disposition`
- 考虑添加 CORS 头支持跨域

---

### 4. 环境变量管理

**用途**：

- 分离配置和代码
- 区分开发/预览/生产环境
- 保护敏感信息（API Key 等）

**文档中的应用**：

```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
```

**注意事项**：

- `.env.local` 不要提交到 Git
- `NEXT_PUBLIC_` 前缀变量会打包到客户端
- Vercel 环境变量在 Dashboard 中配置

---

### 5. Docker 容器化

**用途**：

- 环境一致性
- 便于私有化部署
- 支持 Kubernetes 编排

**文档中的应用**：

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

**注意事项**：

- 使用 `alpine` 镜像减小体积
- 多阶段构建可进一步优化
- 注意 `.dockerignore` 排除不必要文件

---

### 6. Git 版本控制

**用途**：

- Skills 仓库管理
- 配置版本追踪
- 支持增量更新

**文档中的应用**：

```bash
# 克隆 Skills
git clone https://github.com/anthropics/skills.git

# 更新 Skills
git fetch origin
git pull origin main
```

**注意事项**：

- 安装脚本需要检测 Git 是否安装
- 考虑网络问题（GitHub 访问受限地区）
- 可以使用镜像仓库作为备选

---

### 7. 健康检查 (Health Check)

**用途**：

- 监控服务状态
- 负载均衡器探测
- 自动化运维

**文档中的应用**：

```typescript
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
```

**注意事项**：

- 健康检查应该快速响应
- 可以添加依赖服务检查（数据库连接等）
- 考虑添加版本信息便于排查问题

---

## 技术栈总结

```
┌─────────────────────────────────────────────────────────┐
│              技术栈全景图（2026年1月）                  │
├─────────────────────────────────────────────────────────┤
│  前端框架                                               │
│  ├── Next.js v16.1.1 (App Router + Turbopack)          │
│  ├── React v19.x (Server Components)                   │
│  ├── TailwindCSS v4.1.18                               │
│  └── DaisyUI v5.5.14                                   │
├─────────────────────────────────────────────────────────┤
│  AI 相关                                                │
│  ├── Crush CLI (Anthropic)                             │
│  ├── Skills 系统                                        │
│  └── MCP (Model Context Protocol)                      │
├─────────────────────────────────────────────────────────┤
│  工程实践                                               │
│  ├── Vercel (部署 + Serverless)                        │
│  ├── Prisma / Drizzle ORM (数据库)                     │
│  ├── Docker (容器化)                                    │
│  ├── RESTful API                                        │
│  ├── 跨平台脚本 (bash/PowerShell)                       │
│  └── 环境变量管理                                       │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ 建议的实施步骤

1. **确认框架版本**：锁定 Next.js v16.x、TailwindCSS v4.x、DaisyUI v5.x
2. **查阅官方指南**：Next.js Docs、TailwindCSS Docs、DaisyUI Docs
3. **测试 SSR/CSR 场景**：尤其是 App Router 与 DaisyUI 的兼容性
4. **数据库接入方案**：优先考虑 Prisma ORM，测试 Vercel Serverless 连接池
5. **UI 方案选择**：TailwindCSS + DaisyUI 是主流组合

---

## 学习建议

1. **入门优先级**：Next.js → TailwindCSS → DaisyUI → Vercel 部署
2. **AI 方向**：Crush CLI → Skills 开发 → MCP 协议
3. **工程进阶**：Prisma ORM → Docker → CI/CD → 监控告警

---

_文档更新时间：2026 年 1 月_
