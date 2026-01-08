# Crush 二进制文件托管

此目录用于存放 Crush 二进制文件，供安装脚本自动下载。

## 目录结构

```
binaries/
├── linux/
│   ├── amd64/
│   │   └── crush          # Linux x86_64 二进制
│   └── arm64/
│       └── crush          # Linux ARM64 二进制
├── darwin/
│   ├── amd64/
│   │   └── crush          # macOS Intel 二进制
│   └── arm64/
│       └── crush          # macOS Apple Silicon 二进制
└── windows/
    └── amd64/
        └── crush.exe      # Windows x86_64 二进制
```

## 如何添加二进制文件

### 方法一：从 GitHub Releases 下载

1. 访问 [Crush Releases](https://github.com/charmbracelet/crush/releases)
2. 下载对应平台的二进制文件
3. 解压并重命名为 `crush` (Windows 为 `crush.exe`)
4. 放入对应的目录

### 方法二：使用脚本自动下载

```bash
# 设置版本号
VERSION="latest"

# Linux amd64
curl -L "https://github.com/charmbracelet/crush/releases/download/${VERSION}/crush_Linux_x86_64.tar.gz" | tar xz -C public/binaries/linux/amd64/

# Linux arm64
curl -L "https://github.com/charmbracelet/crush/releases/download/${VERSION}/crush_Linux_arm64.tar.gz" | tar xz -C public/binaries/linux/arm64/

# macOS amd64
curl -L "https://github.com/charmbracelet/crush/releases/download/${VERSION}/crush_Darwin_x86_64.tar.gz" | tar xz -C public/binaries/darwin/amd64/

# macOS arm64
curl -L "https://github.com/charmbracelet/crush/releases/download/${VERSION}/crush_Darwin_arm64.tar.gz" | tar xz -C public/binaries/darwin/arm64/

# Windows amd64
curl -L "https://github.com/charmbracelet/crush/releases/download/${VERSION}/crush_Windows_x86_64.zip" -o windows.zip
unzip windows.zip -d public/binaries/windows/amd64/
rm windows.zip
```

## 注意事项

1. 二进制文件较大，建议使用 Git LFS 管理
2. 确保文件有执行权限 (Unix): `chmod +x crush`
3. 定期更新到最新版本

## API 端点

安装脚本通过以下 API 下载二进制文件：

- `GET /api/download/crush/{platform}/{arch}`
  - platform: `linux`, `darwin`, `windows`
  - arch: `amd64`, `arm64`

示例：

- `/api/download/crush/linux/amd64` - Linux x86_64
- `/api/download/crush/darwin/arm64` - macOS Apple Silicon
- `/api/download/crush/windows/amd64` - Windows x86_64
