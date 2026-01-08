#!/bin/bash
# ============================================================================
# Download Crush Binaries Script
# 下载 Crush 二进制文件到 public/binaries 目录
# 用于 Vercel CI/CD 环境
# ============================================================================

set -e

echo ""
echo "============================================================"
echo "  Crush Binary Downloader"
echo "============================================================"
echo ""

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BINARIES_DIR="$PROJECT_ROOT/public/binaries"

echo "[..] Project root: $PROJECT_ROOT"
echo "[..] Binaries dir: $BINARIES_DIR"

# 获取版本号
VERSION="${1:-latest}"

if [ "$VERSION" = "latest" ]; then
    echo "[..] Fetching latest version from GitHub..."
    VERSION=$(curl -s https://api.github.com/repos/charmbracelet/crush/releases/latest | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')
    if [ -z "$VERSION" ]; then
        echo "[XX] Failed to fetch latest version"
        exit 1
    fi
    echo "[OK] Latest version: $VERSION"
fi

# 去掉版本号前面的 v
VERSION_NUM="${VERSION#v}"

BASE_URL="https://github.com/charmbracelet/crush/releases/download/$VERSION"

echo ""
echo "[..] Downloading Crush $VERSION binaries..."
echo ""

# 下载函数
download_binary() {
    local name="$1"
    local file="$2"
    local dest="$3"
    local exe_name="$4"
    
    local dest_path="$BINARIES_DIR/$dest"
    local download_url="$BASE_URL/$file"
    local temp_file="/tmp/crush_$$_$(echo $file | tr '/' '_')"
    
    echo "[..] Downloading $name..."
    echo "    URL: $download_url"
    
    # 创建目标目录
    mkdir -p "$dest_path"
    
    # 下载文件
    if curl -fsSL "$download_url" -o "$temp_file"; then
        # 解压文件
        if echo "$file" | grep -q "\.zip$"; then
            unzip -q -o "$temp_file" -d "$dest_path"
        else
            tar -xzf "$temp_file" -C "$dest_path"
        fi
        
        # 查找并移动 crush 可执行文件
        local crush_file=$(find "$dest_path" -name "$exe_name" -type f 2>/dev/null | head -1)
        
        if [ -n "$crush_file" ]; then
            local final_path="$dest_path/$exe_name"
            
            # 如果文件在子目录中，移动到目标目录
            if [ "$crush_file" != "$final_path" ]; then
                mv "$crush_file" "$final_path"
            fi
            
            # 设置执行权限
            chmod +x "$final_path"
            
            # 删除其他文件和子目录（保留 crush 可执行文件）
            find "$dest_path" -mindepth 1 -maxdepth 1 ! -name "$exe_name" -exec rm -rf {} \; 2>/dev/null || true
            
            echo "[OK] $name -> $final_path"
        else
            echo "[!!] $name - crush binary not found in archive"
        fi
        
        rm -f "$temp_file"
    else
        echo "[XX] $name failed to download"
    fi
}

# 下载各平台二进制文件
download_binary "Linux x64" "crush_${VERSION_NUM}_Linux_x86_64.tar.gz" "linux/amd64" "crush"
download_binary "Linux ARM64" "crush_${VERSION_NUM}_Linux_arm64.tar.gz" "linux/arm64" "crush"
download_binary "macOS x64" "crush_${VERSION_NUM}_Darwin_x86_64.tar.gz" "darwin/amd64" "crush"
download_binary "macOS ARM64" "crush_${VERSION_NUM}_Darwin_arm64.tar.gz" "darwin/arm64" "crush"
download_binary "Windows x64" "crush_${VERSION_NUM}_Windows_x86_64.zip" "windows/amd64" "crush.exe"

echo ""
echo "============================================================"
echo "  Download Complete"
echo "============================================================"
echo ""
echo "[..] Binary locations:"
find "$BINARIES_DIR" -type f \( -name "crush" -o -name "crush.exe" \) -exec ls -lh {} \; 2>/dev/null | while read line; do
    echo "  $line"
done
echo ""
echo "[OK] Done!"
