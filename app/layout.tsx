import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRUSH Config Server",
  description: "CRUSH 统一配置部署服务 - 快速配置 Crush AI 编程助手",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
