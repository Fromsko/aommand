# Vercel 部署经验总结

本文档总结了在 Vercel 上部署 Next.js 应用时遇到的问题和解决方案。

## 1. Serverless Functions 无法访问 public/ 目录

### 问题

在 Vercel 上，API Routes（Serverless Functions）和静态资源是分开部署的。使用 `fs.readFile()` 和 `process.cwd()` 读取 `public/` 目录中的文件会失败。

### 错误表现

```json
{
  "error": "Binary Not Found",
  "message": "Crush binary for linux/amd64 is not available."
}
```

### 解决方案

1. **方案一：重定向到静态文件路径**

   ```typescript
   // 不要这样做
   const filePath = path.join(process.cwd(), "public", "binaries", "crush");
   const file = await readFile(filePath); // ❌ 在 Serverless 中会失败

   // 改为重定向
   return NextResponse.redirect(`${baseUrl}/binaries/linux/amd64/crush`); // ✅
   ```

2. **方案二：直接使用静态文件 URL**
   - 静态文件路径：`/binaries/linux/amd64/crush`
   - 不需要经过 API，直接访问静态资源

## 2. VERCEL_URL 返回预览地址而非生产地址

### 问题

`process.env.VERCEL_URL` 在 Vercel 上会返回当前部署的 URL，包括预览部署的地址（如 `app-abc123-user.vercel.app`），而不是生产域名。

### 错误表现

生成的安装脚本中 `BASE_URL` 变成了预览地址：

```bash
BASE_URL="https://aommand-962e04j5g-kongxiaoaaas-projects.vercel.app"
# 期望的是
BASE_URL="https://aommand.vercel.app"
```

### 解决方案

优先使用请求头中的 `host`，而不是 `VERCEL_URL`：

```typescript
export function getBaseUrl(request: NextRequest): string {
  // 1. 用户显式配置的 URL（最高优先级）
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 2. 从请求头获取 host（保持用户访问的实际 URL）✅
  const host = request.headers.get("host");
  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  // 3. VERCEL_URL 作为兜底（可能是预览 URL）
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
```

## 3. 构建时下载大文件

### 问题

需要在部署时下载二进制文件（约 55MB x 5 = 275MB），但不想提交到 Git。

### 解决方案

1. **创建下载脚本** `scripts/download-crush-binaries.sh`
2. **修改 package.json 的 build 命令**：
   ```json
   {
     "scripts": {
       "build": "npm run download-binaries && next build",
       "download-binaries": "bash scripts/download-crush-binaries.sh"
     }
   }
   ```
3. **添加到 .gitignore**：
   ```gitignore
   # Crush binaries (downloaded during build)
   public/binaries/linux/
   public/binaries/darwin/
   public/binaries/windows/
   ```

### Bash 脚本注意事项

- 避免使用 `((count++))` 等 bash 特有语法，可能在某些环境不兼容
- 使用 `set -e` 让脚本在错误时退出
- 下载后检查文件是否在子目录中，需要移动到正确位置

## 4. GitHub Release 文件命名格式

### 问题

GitHub Release 的文件命名格式可能与预期不同。

### 示例

```bash
# 错误的 URL（不包含版本号）
https://github.com/charmbracelet/crush/releases/download/v0.31.0/crush_Linux_x86_64.tar.gz

# 正确的 URL（包含版本号，不带 v 前缀）
https://github.com/charmbracelet/crush/releases/download/v0.31.0/crush_0.31.0_Linux_x86_64.tar.gz
```

### 解决方案

通过 GitHub API 获取实际的 asset 名称：

```bash
curl -s https://api.github.com/repos/charmbracelet/crush/releases/latest | grep '"name"'
```

## 5. 静态文件与 API 路由的选择

### 何时使用静态文件

- 大文件下载（二进制文件、图片等）
- 不需要动态处理的内容
- 需要 CDN 缓存的内容

### 何时使用 API 路由

- 需要动态生成内容
- 需要验证或权限控制
- 需要处理请求参数

### 混合使用

API 路由可以重定向到静态文件：

```typescript
// API 做验证，然后重定向到静态文件
export async function GET(request: NextRequest) {
  // 验证逻辑...
  return NextResponse.redirect(`${baseUrl}/binaries/file.bin`);
}
```

## 6. 项目结构最佳实践

```
project/
├── app/
│   ├── api/
│   │   ├── config/route.ts      # 配置 API
│   │   ├── download/            # 下载 API（重定向）
│   │   └── install/             # 安装脚本 API
│   └── page.tsx                 # Web UI
├── lib/
│   ├── data/                    # 数据模块
│   ├── templates/               # 脚本模板
│   └── utils/                   # 工具函数
├── public/
│   └── binaries/                # 静态二进制文件（构建时下载）
├── scripts/
│   └── download-crush-binaries.sh  # 构建脚本
└── docs/                        # 文档
```

## 7. 调试技巧

### 查看 Vercel 构建日志

- 在 Vercel Dashboard 中查看 Deployments
- 点击具体部署查看 Build Logs

### 查看部署产物

构建完成后会显示静态资源和 Serverless Functions 列表：

```
staticAssets: ["/binaries/linux/amd64/crush", ...]
serverlessFunctions: ["/api/config", "/api/download/crush/[platform]/[arch]", ...]
```

### 本地测试

```bash
# 构建并启动
npm run build
npm run start

# 测试 API
curl http://localhost:3000/api/install/unix
```

## 总结

| 问题                        | 原因         | 解决方案                 |
| --------------------------- | ------------ | ------------------------ |
| Serverless 无法读取 public/ | 分离部署架构 | 使用静态文件路径或重定向 |
| VERCEL_URL 是预览地址       | 环境变量特性 | 优先使用请求头 host      |
| 大文件不想提交 Git          | 仓库体积     | 构建时下载 + .gitignore  |
| Release 文件名不对          | 命名格式差异 | 通过 API 获取实际名称    |
