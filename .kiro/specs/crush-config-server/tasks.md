# Implementation Plan: CRUSH 统一配置部署服务

## Overview

基于 Next.js 16 App Router 构建配置服务器，提供配置模板 API、Skills API、健康检查 API、跨平台安装脚本和 Web UI，部署到 Vercel 平台。

## Tasks

- [x] 1. 项目初始化和基础设施

  - [x] 1.1 创建 Next.js 16 项目，配置 TypeScript、Tailwind CSS
    - 初始化 package.json，安装 next、react、typescript、tailwindcss 依赖
    - 配置 tsconfig.json、next.config.js、tailwind.config.js
    - 创建 app/layout.tsx 和 app/globals.css
    - _Requirements: 6.7 (深色主题)_
  - [x] 1.2 创建错误处理工具模块
    - 创建 lib/utils/errors.ts
    - 实现 ApiError 类和 createErrorResponse 函数
    - 定义 ErrorTypes 常量（NOT_FOUND、METHOD_NOT_ALLOWED、INTERNAL_ERROR、VALIDATION_ERROR）
    - _Requirements: 9.1, 9.2_

- [x] 2. 数据层实现

  - [x] 2.1 实现配置数据模块
    - 创建 lib/data/config-data.ts
    - 定义 CrushConfig、ConfigOptions、SkillsConfig、ProviderConfig 接口
    - 实现 generateConfig() 函数，返回完整配置对象
    - 确保 version 符合语义化版本格式，updated_at 为 ISO 8601 时间戳
    - _Requirements: 1.1, 1.2, 7.1, 7.3, 7.4_
  - [x] 2.2 实现 Skills 数据模块
    - 创建 lib/data/skills-data.ts
    - 定义 Skill 接口和 SkillCategory 类型
    - 创建预定义 SKILLS 数组（包含 creative、design、docs、dev 分类）
    - 实现 filterSkillsByCategory() 函数
    - 确保 skill name 唯一且符合 kebab-case 格式
    - _Requirements: 2.3, 2.4, 8.1, 8.3, 8.4, 8.5_
  - [ ]\* 2.3 编写 Skills 数据属性测试
    - **Property 3: Skills API 响应结构与过滤**
    - **Property 4: Skill 数据验证**
    - **Validates: Requirements 2.1, 2.2, 2.3, 8.3, 8.4, 8.5**

- [x] 3. Config API 实现

  - [x] 3.1 实现 Config API 路由
    - 创建 app/api/config/route.ts
    - 实现 GET handler，返回配置 JSON
    - 设置 Content-Type: application/json
    - 实现错误处理，内部错误返回 500
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ]\* 3.2 编写 Config API 属性测试
    - **Property 1: Config API 响应结构完整性**
    - **Property 2: JSON 序列化往返一致性**
    - **Validates: Requirements 1.1, 1.4, 7.1, 7.2, 7.4**

- [x] 4. Skills API 实现

  - [x] 4.1 实现 Skills API 路由
    - 创建 app/api/skills/route.ts
    - 实现 GET handler，返回 skills 列表
    - 支持 category 查询参数过滤
    - 无效 category 返回空数组，total 为 0
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Health API 实现

  - [x] 5.1 实现 Health API 路由
    - 创建 app/api/health/route.ts
    - 实现 GET handler，返回 status、timestamp、version
    - 正常情况返回 status: "ok"
    - timestamp 使用 ISO 8601 格式
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]\* 5.2 编写 Health API 属性测试
    - **Property 5: Health API 响应结构**
    - **Validates: Requirements 3.1, 3.3, 3.4**

- [x] 6. Checkpoint - API 基础功能验证

  - 确保所有 API 测试通过，如有问题请询问用户

- [x] 7. 安装脚本模板实现

  - [x] 7.1 实现 Unix 脚本模板
    - 创建 lib/templates/unix-script.ts
    - 实现 generateUnixScript(baseUrl) 函数
    - 包含：Crush 检查、目录创建、配置下载、Skills 克隆/更新、安装验证
    - 包含彩色输出（绿色成功、红色错误、蓝色信息、黄色警告）
    - 包含安装摘要和下一步说明
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 10.1, 10.2, 10.3, 10.4, 10.5_
  - [x] 7.2 实现 Windows 脚本模板
    - 创建 lib/templates/windows-script.ts
    - 实现 generateWindowsScript(baseUrl) 函数
    - 包含：Crush 检查、目录创建、配置下载、Skills 克隆/更新、安装验证
    - 包含彩色输出（绿色成功、红色错误、蓝色信息、黄色警告）
    - 包含安装摘要和下一步说明
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 10.1, 10.2, 10.3, 10.4, 10.5_
  - [ ]\* 7.3 编写安装脚本属性测试
    - **Property 6: 安装脚本内容完整性**
    - **Property 7: 安装脚本输出格式**
    - **Validates: Requirements 4.2-4.8, 5.2-5.8, 10.1-10.5**

- [x] 8. 安装脚本 API 实现

  - [x] 8.1 实现 Unix 安装脚本 API
    - 创建 app/api/install/unix/route.ts
    - 实现 GET handler，返回 bash 脚本
    - 设置 Content-Type: text/plain
    - 使用 getBaseUrl() 获取实际服务器 URL
    - _Requirements: 4.1, 4.2_
  - [x] 8.2 实现 Windows 安装脚本 API
    - 创建 app/api/install/windows/route.ts
    - 实现 GET handler，返回 PowerShell 脚本
    - 设置 Content-Type: text/plain
    - 使用 getBaseUrl() 获取实际服务器 URL
    - _Requirements: 5.1, 5.2_

- [x] 9. Checkpoint - 安装脚本功能验证

  - 确保所有安装脚本测试通过，如有问题请询问用户

- [x] 10. Web UI 实现

  - [x] 10.1 实现首页 UI
    - 创建 app/page.tsx
    - 显示 Unix 安装命令：curl -fsSL {baseUrl}/api/install/unix | bash
    - 显示 Windows 安装命令：iwr {baseUrl}/api/install/windows | iex
    - 显示 Skills 列表（名称和描述）
    - 显示服务主要特性
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 10.2 实现响应式设计和深色主题
    - 确保移动端正确显示
    - 应用深色主题，确保颜色对比度符合可读性要求
    - _Requirements: 6.6, 6.7_

- [x] 11. 错误处理完善

  - [x] 11.1 为所有 API 添加统一错误处理
    - 404 资源未找到
    - 405 方法不支持
    - 500 内部错误
    - 确保错误响应包含 error 和 message 字段
    - _Requirements: 9.1, 9.2, 9.4, 9.5_
  - [ ]\* 11.2 编写错误处理属性测试
    - **Property 8: 错误响应结构**
    - **Validates: Requirements 9.1, 9.2**

- [x] 12. Final Checkpoint - 完整功能验证

  - 确保所有测试通过，如有问题请询问用户

- [x] 13. Vercel 部署配置

  - [x] 13.1 实现 URL 自动检测逻辑
    - 创建 lib/utils/url.ts
    - 实现 getBaseUrl(request) 函数
    - 优先级：NEXT_PUBLIC_BASE_URL > VERCEL_URL > request host header
    - 在安装脚本 API 中使用此函数
    - _Requirements: 11.3_
  - [x] 13.2 创建部署文档
    - 更新 README.md 添加部署说明
    - 包含 Git 集成部署步骤（推荐方式：连接 GitHub 仓库）
    - 包含 Vercel CLI 部署步骤（备选方式）
    - 包含环境变量配置说明（可选）
    - 包含自定义域名绑定说明
    - _Requirements: 11.4_
  - [x] 13.3 创建可选的 vercel.json（如需自定义缓存）
    - 仅配置安装脚本的缓存头（s-maxage=300）
    - 不配置 framework/buildCommand 等（Vercel 自动检测 Next.js）
    - _Requirements: 11.5_

- [-] 14. 部署验证

  - [-] 14.1 初始化 Git 仓库并推送到 GitHub
    - git init, git add, git commit
    - 创建 GitHub 仓库并推送
    - _Requirements: 11.6_
  - [ ] 14.2 通过 Vercel Dashboard 部署
    - 访问 vercel.com，点击 New Project
    - 连接 GitHub 仓库
    - 验证 Vercel 自动检测 Next.js（零配置）
    - 点击 Deploy 完成部署
    - 验证自动 HTTPS 证书
    - _Requirements: 11.1, 11.2_
  - [ ] 14.3 验证部署结果
    - 验证所有 API 端点正常工作
    - 验证 Web UI 正常显示
    - 验证安装脚本可正常下载
    - 测试安装脚本中的 BASE_URL 是否正确
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 15. Crush 二进制文件托管和自动安装
  - [ ] 15.1 创建二进制文件托管目录结构
    - 创建 public/binaries 目录
    - 创建 README 说明如何添加二进制文件
    - _Requirements: 5.5.4_
  - [ ] 15.2 实现二进制文件下载 API
    - 创建 app/api/download/crush/[platform]/[arch]/route.ts
    - 支持 linux/darwin/windows 平台
    - 支持 amd64/arm64 架构
    - 返回 Content-Type: application/octet-stream
    - _Requirements: 5.5.1, 5.5.2, 5.5.3, 5.5.5_
  - [ ] 15.3 更新 Unix 安装脚本支持自动安装 Crush
    - 检测平台 (linux/darwin) 和架构 (amd64/arm64)
    - 如果 Crush 未安装，自动下载并安装
    - 安装到 ~/.local/bin 或 /usr/local/bin
    - _Requirements: 4.3, 4.4_
  - [ ] 15.4 更新 Windows 安装脚本支持自动安装 Crush
    - 如果 Crush 未安装，自动下载并安装
    - 安装到 %LOCALAPPDATA%\crush\bin
    - 添加到用户 PATH
    - _Requirements: 5.3, 5.8_
  - [ ] 15.5 更新 Web UI 显示二进制下载链接
    - 显示各平台下载链接
    - _Requirements: 6.5_

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求条目以确保可追溯性
- Checkpoint 任务用于增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
- Vercel 部署采用零配置方式，自动检测 Next.js 项目
