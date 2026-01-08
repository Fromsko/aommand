# Vercel CLI 本地使用完整指南

> 本文档涵盖 Vercel CLI 的本地开发、域名配置、Next.js 部署以及数据库连接等核心内容。

## 目录

1. [安装与登录](#1-安装与登录)
2. [项目链接与初始化](#2-项目链接与初始化)
3. [本地开发](#3-本地开发)
4. [环境变量管理](#4-环境变量管理)
5. [域名配置](#5-域名配置)
6. [部署 Next.js 项目](#6-部署-nextjs-项目)
7. [数据库连接配置](#7-数据库连接配置)
8. [常用命令速查](#8-常用命令速查)

---

## 1. 安装与登录

### 安装 Vercel CLI

```bash
# 使用 npm 全局安装
npm i -g vercel

# 或使用 pnpm
pnpm add -g vercel
```

### 登录账户

```bash
# 交互式登录
vercel login

# 使用 token 登录（适合 CI/CD）
vercel login --token <your-token>
```

### 查看当前登录用户

```bash
vercel whoami
```

---

## 2. 项目链接与初始化

### 链接本地目录到 Vercel 项目

```bash
# 在项目根目录执行，交互式选择或创建项目
vercel link

# 指定项目名称（非交互式）
vercel link --project my-project-name

# 跳过所有确认提示
vercel link --yes
```

链接成功后会在项目根目录创建 `.vercel` 文件夹，包含 `project.json`：

```json
{
  "orgId": "team_xxx",
  "projectId": "prj_xxx"
}
```

### 拉取项目配置

```bash
# 拉取远程项目设置到本地
vercel pull

# 拉取环境变量到 .env.local
vercel env pull .env.local
```

---

## 3. 本地开发

### 启动本地开发服务器

```bash
# 启动 vercel dev（模拟 Vercel 部署环境）
vercel dev

# 指定端口
vercel dev --listen 3001

# 跳过确认提示
vercel dev --yes
```

> **注意**：如果你使用 Next.js，框架自带的 `npm run dev` 已经提供了完整的本地开发支持（包括 API Routes、Middleware 等），通常不需要 `vercel dev`。

### 本地构建

```bash
# 在本地构建项目（输出到 .vercel/output）
vercel build

# 部署预构建的输出
vercel deploy --prebuilt
```

---

## 4. 环境变量管理

### 查看环境变量

```bash
vercel env ls
```

### 添加环境变量

```bash
# 交互式添加
vercel env add

# 指定变量名和环境
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

### 拉取环境变量到本地

```bash
# 拉取到 .env.local（默认）
vercel env pull

# 拉取到指定文件
vercel env pull .env.development.local

# 拉取特定环境的变量
vercel env pull --environment=production
```

### 删除环境变量

```bash
vercel env rm VARIABLE_NAME
```

### 环境变量作用域

| 环境          | 说明                                          |
| ------------- | --------------------------------------------- |
| `production`  | 生产部署时使用                                |
| `preview`     | 预览部署（非主分支）时使用                    |
| `development` | 本地开发时使用（通过 `vercel env pull` 获取） |

---

## 5. 域名配置

### 5.1 添加二级域名（子域名）

假设你已有域名 `example.com`，想添加二级域名 `app.example.com`：

#### 方法一：通过 Dashboard（推荐）

1. 进入 Vercel Dashboard → 选择项目 → Settings → Domains
2. 输入 `app.example.com`，点击 Add
3. Vercel 会提示你添加 CNAME 记录

#### 方法二：通过 CLI 使用 alias

```bash
# 先部署获取部署 URL
vercel

# 将域名绑定到部署
vercel alias <deployment-url> app.example.com

# 例如
vercel alias my-project-xxx.vercel.app app.example.com
```

### 5.2 DNS 配置

在你的域名 DNS 服务商处添加记录：

**子域名（如 app.example.com）**：

```
类型: CNAME
名称: app
值: cname.vercel-dns.com
```

**根域名（如 example.com）**：

```
类型: A
名称: @
值: 76.76.21.21
```

### 5.3 使用 Vercel DNS 管理

如果你的域名使用 Vercel 的 DNS 服务器：

```bash
# 查看 DNS 记录
vercel dns ls

# 添加 CNAME 记录（子域名）
vercel dns add example.com app CNAME cname.vercel-dns.com

# 添加 A 记录
vercel dns add example.com @ A 76.76.21.21

# 删除 DNS 记录
vercel dns rm <record-id>
```

### 5.4 vercel.json 中配置域名重定向

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

### 5.5 本地 hosts 文件配置（开发测试用）

在本地测试二级域名时，可以修改 hosts 文件：

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

```
127.0.0.1 app.example.com
```

---

## 6. 部署 Next.js 项目

### 6.1 首次部署

```bash
# 在 Next.js 项目根目录
cd my-nextjs-app

# 直接部署（会自动检测框架）
vercel

# 部署到生产环境
vercel --prod
```

### 6.2 部署流程

1. **链接项目**：首次运行 `vercel` 会提示链接或创建项目
2. **自动检测**：Vercel 自动识别 Next.js 框架
3. **构建**：执行 `npm run build` 或 `next build`
4. **部署**：上传构建产物到 Vercel 边缘网络

### 6.3 vercel.json 配置示例

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "regions": ["hkg1", "sin1"],
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ]
}
```

### 6.4 部署命令选项

```bash
# 预览部署（默认）
vercel

# 生产部署
vercel --prod

# 强制重新部署（不使用缓存）
vercel --force

# 指定环境变量
vercel -e DATABASE_URL=xxx -e API_KEY=yyy

# 本地构建后部署
vercel build
vercel deploy --prebuilt
```

---

## 7. 数据库连接配置

### 7.1 配置数据库连接字符串

#### 通过 CLI 添加

```bash
# 添加数据库 URL 到各环境
vercel env add DATABASE_URL production
# 输入: postgresql://user:password@host:5432/dbname

vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

#### 通过 Dashboard

1. 进入项目 Settings → Environment Variables
2. 添加 `DATABASE_URL` 变量
3. 选择适用的环境（Production/Preview/Development）

### 7.2 本地开发使用数据库

```bash
# 拉取环境变量到本地
vercel env pull .env.local
```

`.env.local` 文件内容示例：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
REDIS_URL="redis://localhost:6379"
```

### 7.3 Vercel 集成数据库

Vercel 提供多种数据库集成，连接后会自动注入环境变量：

| 数据库            | 自动注入的环境变量                       |
| ----------------- | ---------------------------------------- |
| Vercel Postgres   | `POSTGRES_URL`, `POSTGRES_PRISMA_URL` 等 |
| Vercel KV (Redis) | `KV_URL`, `KV_REST_API_URL` 等           |
| Vercel Blob       | `BLOB_READ_WRITE_TOKEN`                  |
| Neon              | `DATABASE_URL`                           |
| PlanetScale       | `DATABASE_URL`                           |
| Supabase          | `SUPABASE_URL`, `SUPABASE_ANON_KEY` 等   |

### 7.4 Next.js 中使用数据库

```typescript
// lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
```

```typescript
// app/api/users/route.ts
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM users");
  return Response.json(rows);
}
```

### 7.5 使用 Prisma

```bash
# 安装 Prisma
npm install prisma @prisma/client

# 初始化
npx prisma init
```

`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

---

## 8. 常用命令速查

### 部署相关

| 命令                       | 说明           |
| -------------------------- | -------------- |
| `vercel`                   | 预览部署       |
| `vercel --prod`            | 生产部署       |
| `vercel build`             | 本地构建       |
| `vercel deploy --prebuilt` | 部署预构建产物 |
| `vercel redeploy <url>`    | 重新部署       |
| `vercel rollback <url>`    | 回滚到指定部署 |

### 项目管理

| 命令                   | 说明               |
| ---------------------- | ------------------ |
| `vercel link`          | 链接本地目录到项目 |
| `vercel pull`          | 拉取项目配置       |
| `vercel inspect <url>` | 查看部署详情       |
| `vercel ls`            | 列出所有部署       |
| `vercel rm <url>`      | 删除部署           |
| `vercel logs <url>`    | 查看部署日志       |

### 环境变量

| 命令                   | 说明              |
| ---------------------- | ----------------- |
| `vercel env ls`        | 列出环境变量      |
| `vercel env add`       | 添加环境变量      |
| `vercel env rm <name>` | 删除环境变量      |
| `vercel env pull`      | 拉取到 .env.local |

### 域名管理

| 命令                          | 说明           |
| ----------------------------- | -------------- |
| `vercel domains ls`           | 列出所有域名   |
| `vercel domains add <domain>` | 添加域名       |
| `vercel alias <url> <domain>` | 绑定域名到部署 |
| `vercel alias ls`             | 列出所有别名   |
| `vercel dns ls`               | 列出 DNS 记录  |
| `vercel dns add`              | 添加 DNS 记录  |

### 其他

| 命令            | 说明             |
| --------------- | ---------------- |
| `vercel dev`    | 本地开发服务器   |
| `vercel login`  | 登录             |
| `vercel logout` | 登出             |
| `vercel whoami` | 查看当前用户     |
| `vercel switch` | 切换团队/账户    |
| `vercel open`   | 在浏览器打开项目 |

---

## 快速上手流程

```bash
# 1. 安装并登录
npm i -g vercel
vercel login

# 2. 进入项目目录并链接
cd my-nextjs-app
vercel link

# 3. 拉取环境变量
vercel env pull .env.local

# 4. 本地开发
npm run dev

# 5. 部署到预览环境
vercel

# 6. 部署到生产环境
vercel --prod

# 7. 添加自定义域名（在 Dashboard 或使用 alias）
vercel alias <deployment-url> app.yourdomain.com
```

---

## 参考资源

- [Vercel CLI 官方文档](https://vercel.com/docs/cli)
- [Vercel 环境变量文档](https://vercel.com/docs/environment-variables)
- [Vercel 域名配置指南](https://vercel.com/docs/getting-started-with-vercel/domains)
- [Next.js 部署到 Vercel](https://nextjs.org/docs/deployment)

---

_文档更新时间：2026 年 1 月_
