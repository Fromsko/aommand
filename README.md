# CRUSH 统一配置部署服务

基于 Next.js 16 App Router 构建的配置服务器，为团队成员提供统一的 Crush 配置模板、Skills 管理和跨平台安装脚本。

## 功能特性

- **配置模板 API** (`/api/config`) - 返回统一的 Crush 配置 JSON
- **Skills API** (`/api/skills`) - 返回可用 Skills 列表，支持分类过滤
- **健康检查 API** (`/api/health`) - 返回服务状态信息
- **安装脚本** - 支持 Unix (Linux/macOS) 和 Windows 平台的一键安装
- **Web UI** - 可视化的配置管理和安装指引界面

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 安装 Crush 配置

**Unix (Linux/macOS):**

```bash
curl -fsSL https://your-domain.vercel.app/api/install/unix | bash
```

**Windows (PowerShell):**

```powershell
iwr https://your-domain.vercel.app/api/install/windows | iex
```

## 部署到 Vercel

### 方式一：Git 集成部署（推荐）

这是最简单的部署方式，Vercel 会自动检测 Next.js 项目并配置最佳默认值。

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/your-username/your-repo.git

# 推送到 GitHub
git push -u origin main
```

#### 步骤 2: 连接 Vercel

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **New Project**
3. 选择 **Import Git Repository**
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测 Next.js 项目（零配置）
6. 点击 **Deploy** 完成部署

#### 自动部署

连接 Git 仓库后，Vercel 会自动处理部署：

- 推送到 `main` 分支 → 自动生产部署
- 创建 Pull Request → 自动预览部署

### 方式二：Vercel CLI 部署

适用于快速测试或不想连接 Git 仓库的场景。

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

## 环境变量配置（可选）

在 Vercel Dashboard → Project Settings → Environment Variables 中配置：

| 变量名                 | 说明               | 必需 |
| ---------------------- | ------------------ | ---- |
| `NEXT_PUBLIC_BASE_URL` | 自定义服务基础 URL | 否   |

**说明：**

- Vercel 会自动提供 `VERCEL_URL` 环境变量
- 只有在需要使用自定义域名时才需要设置 `NEXT_PUBLIC_BASE_URL`
- URL 检测优先级：`NEXT_PUBLIC_BASE_URL` > `VERCEL_URL` > 请求头 host

## 自定义域名绑定

1. 进入 Vercel Dashboard → 选择项目
2. 点击 **Settings** → **Domains**
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录：
   - **A 记录**: 指向 `76.76.21.21`
   - **CNAME 记录**: 指向 `cname.vercel-dns.com`
5. Vercel 会自动配置 HTTPS 证书（免费）

## API 端点

| 端点                       | 方法 | 说明                |
| -------------------------- | ---- | ------------------- |
| `/api/config`              | GET  | 获取 Crush 配置模板 |
| `/api/skills`              | GET  | 获取 Skills 列表    |
| `/api/skills?category=dev` | GET  | 按分类过滤 Skills   |
| `/api/health`              | GET  | 健康检查            |
| `/api/install/unix`        | GET  | Unix 安装脚本       |
| `/api/install/windows`     | GET  | Windows 安装脚本    |

## 项目结构

```
crush-config-server/
├── app/
│   ├── page.tsx                    # Web UI 首页
│   ├── layout.tsx                  # 根布局
│   ├── globals.css                 # 全局样式
│   └── api/
│       ├── config/route.ts         # Config API
│       ├── skills/route.ts         # Skills API
│       ├── health/route.ts         # Health API
│       └── install/
│           ├── unix/route.ts       # Unix 安装脚本
│           └── windows/route.ts    # Windows 安装脚本
├── lib/
│   ├── data/
│   │   ├── config-data.ts          # 配置数据
│   │   └── skills-data.ts          # Skills 数据
│   ├── templates/
│   │   ├── unix-script.ts          # Unix 脚本模板
│   │   └── windows-script.ts       # Windows 脚本模板
│   └── utils/
│       ├── url.ts                  # URL 工具
│       └── errors.ts               # 错误处理
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel

## License

MIT
