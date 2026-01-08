"use client";

import { SKILLS, type Skill, type SkillCategory } from "@/lib/data/skills-data";
import { useEffect, useState } from "react";

/**
 * 服务特性列表
 */
const FEATURES = [
  {
    icon: "⚡",
    title: "一键安装",
    description: "自动下载 Crush 并配置，支持 Unix 和 Windows",
  },
  {
    icon: "🔧",
    title: "统一配置",
    description: "预配置的 LLM 提供商、LSP 和 MCP 设置",
  },
  {
    icon: "🎯",
    title: "Agent Skills",
    description: "预装官方 Skills，扩展 AI 能力",
  },
  {
    icon: "🔄",
    title: "自动更新",
    description: "Skills 仓库自动克隆和更新",
  },
];

/**
 * 二进制下载链接
 */
const BINARY_DOWNLOADS = [
  {
    platform: "Linux x64",
    path: "/api/download/crush/linux/amd64",
    icon: "🐧",
  },
  {
    platform: "Linux ARM64",
    path: "/api/download/crush/linux/arm64",
    icon: "🐧",
  },
  {
    platform: "macOS Intel",
    path: "/api/download/crush/darwin/amd64",
    icon: "🍎",
  },
  {
    platform: "macOS Apple Silicon",
    path: "/api/download/crush/darwin/arm64",
    icon: "🍎",
  },
  {
    platform: "Windows x64",
    path: "/api/download/crush/windows/amd64",
    icon: "🪟",
  },
];

/**
 * 分类显示名称映射
 */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  creative: "创意思维",
  design: "设计",
  docs: "文档",
  dev: "开发",
};

/**
 * 分类颜色映射
 */
const CATEGORY_COLORS: Record<SkillCategory, string> = {
  creative: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  design: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  docs: "bg-green-500/20 text-green-300 border-green-500/30",
  dev: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

/**
 * 安装命令组件
 */
function InstallCommand({
  platform,
  command,
}: {
  platform: string;
  command: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
        <span className="text-sm text-zinc-300 font-medium">{platform}</span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors min-h-[32px] sm:min-h-0"
          aria-label={copied ? "已复制到剪贴板" : "复制命令"}
        >
          {copied ? "已复制!" : "复制"}
        </button>
      </div>
      <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm">
        <code className="text-green-400 break-all sm:break-normal">
          {command}
        </code>
      </pre>
    </div>
  );
}

/**
 * Skill 卡片组件
 */
function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-3 sm:p-4 hover:border-zinc-600 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap sm:flex-nowrap">
        <h3 className="font-mono text-sm font-medium text-zinc-50">
          {skill.name}
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
            CATEGORY_COLORS[skill.category]
          }`}
        >
          {CATEGORY_LABELS[skill.category]}
        </span>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {skill.description}
      </p>
    </div>
  );
}

/**
 * 特性卡片组件
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-zinc-900/30 rounded-lg border border-zinc-700/50 p-4 hover:border-zinc-600/50 transition-colors">
      <div className="text-2xl mb-2" role="img" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-medium text-zinc-50 mb-1">{title}</h3>
      <p className="text-sm text-zinc-300">{description}</p>
    </div>
  );
}

/**
 * 首页组件
 */
export default function HomePage() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // 在客户端获取当前 URL
    setBaseUrl(window.location.origin);
  }, []);

  const unixCommand = `curl -fsSL ${
    baseUrl || "{baseUrl}"
  }/api/install/unix | bash`;
  const windowsCommand = `iwr ${
    baseUrl || "{baseUrl}"
  }/api/install/windows | iex`;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-10 sm:py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-zinc-50 to-zinc-300 bg-clip-text text-transparent">
            CRUSH Config Server
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-6 sm:mb-8 px-2">
            统一配置部署服务 - 快速配置 Crush AI 编程助手
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-600 text-sm text-zinc-200">
            <span
              className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              aria-hidden="true"
            ></span>
            <span>服务运行中</span>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-10 sm:py-12 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-zinc-50">
            快速安装
          </h2>
          <p className="text-zinc-300 text-center mb-6 sm:mb-8 px-2">
            选择你的操作系统，运行以下命令即可完成配置
          </p>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                <span role="img" aria-label="Linux">
                  🐧
                </span>{" "}
                Linux / macOS
              </h3>
              <InstallCommand platform="Bash" command={unixCommand} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                <span role="img" aria-label="Windows">
                  🪟
                </span>{" "}
                Windows
              </h3>
              <InstallCommand platform="PowerShell" command={windowsCommand} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-zinc-50">
            服务特性
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-10 sm:py-12 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-zinc-50">
            Agent Skills
          </h2>
          <p className="text-zinc-300 text-center mb-6 sm:mb-8 px-2">
            预装的官方 Skills，扩展 Crush 的 AI 能力
          </p>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </section>

      {/* Binary Downloads Section */}
      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-zinc-50">
            手动下载
          </h2>
          <p className="text-zinc-300 text-center mb-6 sm:mb-8 px-2">
            如果自动安装失败，可以手动下载对应平台的 Crush 二进制文件
          </p>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {BINARY_DOWNLOADS.map((download) => (
              <a
                key={download.path}
                href={`${baseUrl}${download.path}`}
                className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 transition-all"
                download
              >
                <span className="text-2xl" role="img" aria-hidden="true">
                  {download.icon}
                </span>
                <span className="text-sm text-zinc-200 text-center">
                  {download.platform}
                </span>
              </a>
            ))}
          </div>
          <p className="text-xs text-zinc-500 text-center mt-4">
            注意：需要先上传二进制文件到服务器才能下载
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 border-t border-zinc-700">
        <div className="max-w-4xl mx-auto text-center text-sm text-zinc-400">
          <p className="mb-2">
            Powered by{" "}
            <a
              href="https://charm.sh/crush"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2 transition-colors"
            >
              Crush
            </a>{" "}
            - Terminal AI Programming Assistant by Charmbracelet
          </p>
          <nav className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            <a
              href="/api/health"
              className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2 transition-colors"
            >
              API Health
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/api/config"
              className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2 transition-colors"
            >
              Config API
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/api/skills"
              className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2 transition-colors"
            >
              Skills API
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
