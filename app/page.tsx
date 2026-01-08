"use client";

import { Skill, SKILLS, type SkillCategory } from "@/lib/data/skills-data";
import { useEffect, useState } from "react";

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
  { icon: "🔄", title: "自动更新", description: "Skills 仓库自动克隆和更新" },
];

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
    platform: "macOS ARM",
    path: "/api/download/crush/darwin/arm64",
    icon: "🍎",
  },
  {
    platform: "Windows x64",
    path: "/api/download/crush/windows/amd64",
    icon: "🪟",
  },
];

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  creative: "创意思维",
  design: "设计",
  docs: "文档",
  dev: "开发",
};

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  creative: "badge-secondary",
  design: "badge-info",
  docs: "badge-success",
  dev: "badge-warning",
};

function TerminalMockup({
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
    <div className="relative group">
      <div className="mockup-code bg-base-300 shadow-2xl">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleCopy}
            className={`btn btn-sm btn-circle ${
              copied ? "btn-success" : "btn-ghost"
            }`}
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
        <pre data-prefix="$" className="text-success">
          <code>{command}</code>
        </pre>
        <pre data-prefix=">" className="text-warning opacity-60">
          <code>{platform}</code>
        </pre>
      </div>
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="badge badge-success gap-1 animate-bounce">
            ✓ 已复制到剪贴板
          </div>
        </div>
      )}
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-base-300 hover:border-primary/50">
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title text-base font-mono text-primary">
            {skill.name}
          </h3>
          <span className={`badge badge-sm ${CATEGORY_COLORS[skill.category]}`}>
            {CATEGORY_LABELS[skill.category]}
          </span>
        </div>
        <p className="text-sm opacity-70 leading-relaxed">
          {skill.description}
        </p>
      </div>
    </div>
  );
}

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
    <div className="card bg-base-200/80 backdrop-blur hover:bg-base-300 transition-all duration-300 border border-base-300 hover:border-primary/30 group hover:-translate-y-1">
      <div className="card-body p-6 items-center text-center">
        <div className="avatar placeholder mb-2">
          <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-3xl">{icon}</span>
          </div>
        </div>
        <h3 className="card-title text-lg">{title}</h3>
        <p className="text-sm opacity-70">{description}</p>
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow-2xl bg-base-200/90 backdrop-blur-lg w-full max-w-3xl border border-base-300">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">Skills</div>
        <div className="stat-value text-primary">{SKILLS.length}</div>
        <div className="stat-desc">预装官方技能</div>
      </div>
      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">平台</div>
        <div className="stat-value text-secondary">5</div>
        <div className="stat-desc">支持的系统架构</div>
      </div>
      <div className="stat">
        <div className="stat-figure text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            ></path>
          </svg>
        </div>
        <div className="stat-title">Providers</div>
        <div className="stat-value text-accent">3</div>
        <div className="stat-desc">LLM 提供商</div>
      </div>
    </div>
  );
}

function InstallTimeline() {
  return (
    <ul className="timeline timeline-vertical lg:timeline-horizontal">
      <li>
        <div className="timeline-start timeline-box bg-base-200 border-primary/30">
          运行命令
        </div>
        <div className="timeline-middle">
          <div className="badge badge-primary badge-lg">1</div>
        </div>
        <hr className="bg-primary" />
      </li>
      <li>
        <hr className="bg-primary" />
        <div className="timeline-middle">
          <div className="badge badge-primary badge-lg">2</div>
        </div>
        <div className="timeline-end timeline-box bg-base-200 border-primary/30">
          下载 Crush
        </div>
        <hr className="bg-primary" />
      </li>
      <li>
        <hr className="bg-primary" />
        <div className="timeline-start timeline-box bg-base-200 border-primary/30">
          配置环境
        </div>
        <div className="timeline-middle">
          <div className="badge badge-primary badge-lg">3</div>
        </div>
        <hr className="bg-secondary" />
      </li>
      <li>
        <hr className="bg-secondary" />
        <div className="timeline-middle">
          <div className="badge badge-secondary badge-lg">4</div>
        </div>
        <div className="timeline-end timeline-box bg-base-200 border-secondary/30">
          安装 Skills
        </div>
        <hr className="bg-secondary" />
      </li>
      <li>
        <hr className="bg-secondary" />
        <div className="timeline-start timeline-box bg-base-200 border-success/30">
          开始使用 🎉
        </div>
        <div className="timeline-middle">
          <div className="badge badge-success badge-lg">✓</div>
        </div>
      </li>
    </ul>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"unix" | "windows">("unix");
  const [selectedCategory, setSelectedCategory] = useState<
    SkillCategory | "all"
  >("all");

  useEffect(() => {
    setMounted(true);
    setBaseUrl(window.location.origin);
  }, []);

  // 使用占位符避免 hydration 不匹配
  const displayUrl = mounted ? baseUrl : "https://your-domain.com";
  const unixCommand = `curl -fsSL ${displayUrl}/api/install/unix | bash`;
  const windowsCommand = `iwr ${displayUrl}/api/install/windows | iex`;
  const filteredSkills =
    selectedCategory === "all"
      ? SKILLS
      : SKILLS.filter((s) => s.category === selectedCategory);

  return (
    <div className="drawer">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-200/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-300">
          <div className="navbar-start">
            <label
              htmlFor="main-drawer"
              className="btn btn-ghost drawer-button lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <a className="btn btn-ghost text-xl font-bold gap-1">
              <span className="text-primary">CRUSH</span>
              <span className="opacity-70">Config</span>
            </a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1">
              <li>
                <a href="#install" className="rounded-lg">
                  安装
                </a>
              </li>
              <li>
                <a href="#skills" className="rounded-lg">
                  Skills
                </a>
              </li>
              <li>
                <a href="#download" className="rounded-lg">
                  下载
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar-end gap-3">
            <div className="flex items-center gap-1.5 text-success text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="hidden sm:inline opacity-80">在线</span>
            </div>
            <a
              href="https://github.com/charmbracelet/crush"
              target="_blank"
              rel="noopener"
              className="btn btn-sm btn-primary"
            >
              官网
            </a>
          </div>
        </div>

        <main className="min-h-screen bg-base-100">
          {/* Hero Section */}
          <section className="hero min-h-[70vh] bg-gradient-to-br from-base-200 via-base-100 to-base-200 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
            </div>
            <div className="hero-content text-center py-20 relative z-10">
              <div className="max-w-3xl">
                <div className="badge badge-primary badge-outline mb-6 py-3 px-4 animate-pulse">
                  ✨ Terminal AI Programming Assistant
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                    Crush
                  </span>
                  <br />
                  <span className="text-base-content">统一配置服务</span>
                </h1>
                <p className="text-lg md:text-xl opacity-80 mb-10 max-w-xl mx-auto">
                  一键安装配置 Crush AI 编程助手
                  <br />
                  预装 Skills 和 MCP 服务，开箱即用
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="#install"
                    className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    开始安装
                  </a>
                  <a href="#skills" className="btn btn-outline btn-lg gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    查看 Skills
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 px-4 flex justify-center -mt-16 relative z-20">
            <StatsSection />
          </section>

          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">服务特性</h2>
                <p className="opacity-70">为什么选择 Crush Config Server</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURES.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </div>
            </div>
          </section>

          {/* Installation Section */}
          <section id="install" className="py-20 px-4 bg-base-200/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">快速安装</h2>
                <p className="opacity-70">选择你的操作系统，一行命令搞定</p>
              </div>

              {/* Tab buttons */}
              <div
                role="tablist"
                className="tabs tabs-boxed bg-base-300 p-1 max-w-md mx-auto mb-8"
              >
                <button
                  role="tab"
                  className={`tab tab-lg flex-1 gap-2 ${
                    activeTab === "unix"
                      ? "tab-active bg-primary text-primary-content"
                      : ""
                  }`}
                  onClick={() => setActiveTab("unix")}
                >
                  🐧 Unix / macOS
                </button>
                <button
                  role="tab"
                  className={`tab tab-lg flex-1 gap-2 ${
                    activeTab === "windows"
                      ? "tab-active bg-primary text-primary-content"
                      : ""
                  }`}
                  onClick={() => setActiveTab("windows")}
                >
                  🪟 Windows
                </button>
              </div>

              {/* Command display */}
              <div className="max-w-2xl mx-auto">
                {activeTab === "unix" ? (
                  <TerminalMockup platform="Bash / Zsh" command={unixCommand} />
                ) : (
                  <TerminalMockup
                    platform="PowerShell"
                    command={windowsCommand}
                  />
                )}
              </div>

              {/* Installation timeline */}
              <div className="mt-16 flex justify-center overflow-x-auto pb-4">
                <InstallTimeline />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Agent Skills</h2>
                <p className="opacity-70">
                  预装的官方 Skills，扩展 Crush 的 AI 能力
                </p>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                  className={`btn btn-sm ${
                    selectedCategory === "all" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  全部 ({SKILLS.length})
                </button>
                {(
                  Object.entries(CATEGORY_LABELS) as [SkillCategory, string][]
                ).map(([key, label]) => {
                  const count = SKILLS.filter((s) => s.category === key).length;
                  return (
                    <button
                      key={key}
                      className={`btn btn-sm ${
                        selectedCategory === key
                          ? CATEGORY_COLORS[key].replace("badge-", "btn-")
                          : "btn-ghost"
                      }`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSkills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          </section>

          {/* Downloads Section */}
          <section id="download" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">手动下载</h2>
                <p className="opacity-60">
                  如果自动安装失败，可以手动下载二进制文件
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {BINARY_DOWNLOADS.map((download) => (
                  <a
                    key={download.path}
                    href={`${displayUrl}${download.path}`}
                    className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-base-200 hover:bg-primary/10 border border-base-300 hover:border-primary/50 transition-all duration-300"
                    download
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {download.icon}
                    </span>
                    <span className="text-sm font-medium opacity-80 group-hover:opacity-100">
                      {download.platform}
                    </span>
                  </a>
                ))}
              </div>

              <p className="text-center text-sm opacity-50 mt-8">
                💡 下载后需要手动配置环境变量和 Skills 目录
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-base-300 bg-base-200">
            <div className="max-w-6xl mx-auto px-6 py-10">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* Brand */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-primary">
                      CRUSH
                    </span>
                    <span className="text-xl font-bold opacity-70">Config</span>
                  </div>
                  <p className="opacity-60 text-sm max-w-xs">
                    Powered by{" "}
                    <a
                      href="https://github.com/charmbracelet/crush"
                      className="link link-primary"
                      target="_blank"
                      rel="noopener"
                    >
                      Crush
                    </a>{" "}
                    - Terminal AI Assistant
                  </p>
                </div>

                {/* Links */}
                <div className="flex gap-16">
                  <div>
                    <h6 className="font-semibold mb-3 opacity-80">API</h6>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="/api/health"
                          className="link link-hover opacity-70 hover:opacity-100"
                        >
                          Health
                        </a>
                      </li>
                      <li>
                        <a
                          href="/api/config"
                          className="link link-hover opacity-70 hover:opacity-100"
                        >
                          Config
                        </a>
                      </li>
                      <li>
                        <a
                          href="/api/skills"
                          className="link link-hover opacity-70 hover:opacity-100"
                        >
                          Skills
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-3 opacity-80">链接</h6>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="https://github.com/charmbracelet/crush"
                          target="_blank"
                          rel="noopener"
                          className="link link-hover opacity-70 hover:opacity-100"
                        >
                          官网
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/charmbracelet"
                          target="_blank"
                          rel="noopener"
                          className="link link-hover opacity-70 hover:opacity-100"
                        >
                          GitHub
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-base-300 py-4 text-center">
              <p className="text-sm opacity-50">© 2026 Crush Config Server</p>
            </div>
          </footer>
        </main>
      </div>

      {/* Drawer sidebar for mobile */}
      <div className="drawer-side z-50">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="menu-title">
            <span className="text-primary font-bold text-lg">CRUSH Config</span>
          </li>
          <li>
            <a href="#install" className="text-lg py-3">
              🚀 安装
            </a>
          </li>
          <li>
            <a href="#skills" className="text-lg py-3">
              🎯 Skills
            </a>
          </li>
          <li>
            <a href="#download" className="text-lg py-3">
              📦 下载
            </a>
          </li>
          <div className="divider"></div>
          <li>
            <a
              href="https://github.com/charmbracelet/crush"
              target="_blank"
              rel="noopener"
              className="text-lg py-3"
            >
              🌐 官网
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
