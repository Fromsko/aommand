/**
 * Crush 二进制文件下载 API
 * GET /api/download/crush/{platform}/{arch}
 *
 * 重定向到静态文件路径 /binaries/{platform}/{arch}/crush
 *
 * 支持的平台和架构：
 * - linux/amd64, linux/arm64
 * - darwin/amd64, darwin/arm64
 * - windows/amd64
 */

import { NextRequest, NextResponse } from "next/server";

// 支持的平台和架构
const SUPPORTED_PLATFORMS = ["linux", "darwin", "windows"] as const;
const SUPPORTED_ARCHS = ["amd64", "arm64"] as const;

type Platform = (typeof SUPPORTED_PLATFORMS)[number];
type Arch = (typeof SUPPORTED_ARCHS)[number];

interface RouteParams {
  params: Promise<{
    platform: string;
    arch: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const { platform, arch } = await params;

  // 验证平台
  if (!SUPPORTED_PLATFORMS.includes(platform as Platform)) {
    return NextResponse.json(
      {
        error: "Invalid Platform",
        message: `Platform '${platform}' is not supported. Supported platforms: ${SUPPORTED_PLATFORMS.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  // 验证架构
  if (!SUPPORTED_ARCHS.includes(arch as Arch)) {
    return NextResponse.json(
      {
        error: "Invalid Architecture",
        message: `Architecture '${arch}' is not supported. Supported architectures: ${SUPPORTED_ARCHS.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  // Windows 只支持 amd64
  if (platform === "windows" && arch === "arm64") {
    return NextResponse.json(
      {
        error: "Unsupported Combination",
        message: "Windows ARM64 is not currently supported. Please use amd64.",
      },
      { status: 400 }
    );
  }

  // 构建静态文件路径
  const filename = platform === "windows" ? "crush.exe" : "crush";
  const staticPath = `/binaries/${platform}/${arch}/${filename}`;

  // 获取请求的 host 来构建完整 URL
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUrl = `${protocol}://${host}${staticPath}`;

  // 重定向到静态文件
  return NextResponse.redirect(redirectUrl, {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
