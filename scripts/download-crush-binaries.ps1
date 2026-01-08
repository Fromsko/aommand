# ============================================================================
# Download Crush Binaries Script
# 下载 Crush 二进制文件到 public/binaries 目录
# ============================================================================

param(
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-Success { param([string]$Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param([string]$Message) Write-Host "ℹ $Message" -ForegroundColor Blue }
function Write-Warn { param([string]$Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Err { param([string]$Message) Write-Host "✗ $Message" -ForegroundColor Red }

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "  Crush Binary Downloader" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# 获取脚本所在目录的父目录（项目根目录）
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BinariesDir = Join-Path $ProjectRoot "public\binaries"

Write-Info "Project root: $ProjectRoot"
Write-Info "Binaries dir: $BinariesDir"

# 如果是 latest，获取最新版本号
if ($Version -eq "latest") {
    Write-Info "Fetching latest version from GitHub..."
    try {
        $releaseInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/charmbracelet/crush/releases/latest"
        $Version = $releaseInfo.tag_name
        Write-Success "Latest version: $Version"
    } catch {
        Write-Err "Failed to fetch latest version: $_"
        exit 1
    }
}

$BaseUrl = "https://github.com/charmbracelet/crush/releases/download/$Version"

# 定义下载任务
$Downloads = @(
    @{ Name = "Linux x64"; Url = "$BaseUrl/crush_Linux_x86_64.tar.gz"; Dest = "linux\amd64"; Archive = "tar.gz" },
    @{ Name = "Linux ARM64"; Url = "$BaseUrl/crush_Linux_arm64.tar.gz"; Dest = "linux\arm64"; Archive = "tar.gz" },
    @{ Name = "macOS x64"; Url = "$BaseUrl/crush_Darwin_x86_64.tar.gz"; Dest = "darwin\amd64"; Archive = "tar.gz" },
    @{ Name = "macOS ARM64"; Url = "$BaseUrl/crush_Darwin_arm64.tar.gz"; Dest = "darwin\arm64"; Archive = "tar.gz" },
    @{ Name = "Windows x64"; Url = "$BaseUrl/crush_Windows_x86_64.zip"; Dest = "windows\amd64"; Archive = "zip" }
)

$TempDir = Join-Path $env:TEMP "crush_download_$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

Write-Host ""
Write-Info "Downloading Crush $Version binaries..."
Write-Host ""

$SuccessCount = 0
$FailCount = 0

foreach ($dl in $Downloads) {
    $destPath = Join-Path $BinariesDir $dl.Dest
    $archiveFile = Join-Path $TempDir "crush_$($dl.Dest -replace '\\', '_').$($dl.Archive)"
    
    Write-Info "Downloading $($dl.Name)..."
    
    try {
        # 确保目标目录存在
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
        }
        
        # 下载文件
        Invoke-WebRequest -Uri $dl.Url -OutFile $archiveFile -UseBasicParsing
        
        # 解压文件
        if ($dl.Archive -eq "zip") {
            Expand-Archive -Path $archiveFile -DestinationPath $destPath -Force
        } else {
            # tar.gz 需要使用 tar 命令
            tar -xzf $archiveFile -C $destPath
        }
        
        # 清理不需要的文件，只保留 crush 可执行文件
        $crushExe = if ($dl.Dest -like "windows*") { "crush.exe" } else { "crush" }
        $crushPath = Join-Path $destPath $crushExe
        
        if (Test-Path $crushPath) {
            # 删除其他文件（README, LICENSE 等）
            Get-ChildItem -Path $destPath -Exclude $crushExe | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Write-Success "$($dl.Name) -> $crushPath"
            $SuccessCount++
        } else {
            Write-Warn "$($dl.Name) - crush binary not found in archive"
            $FailCount++
        }
        
    } catch {
        Write-Err "$($dl.Name) failed: $_"
        $FailCount++
    }
}

# 清理临时目录
Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "  Download Summary" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "  Version:    $Version"
Write-Host "  Success:    $SuccessCount"
Write-Host "  Failed:     $FailCount"
Write-Host ""

if ($FailCount -eq 0) {
    Write-Success "All binaries downloaded successfully!"
} else {
    Write-Warn "Some downloads failed. Check the errors above."
}

Write-Host ""
Write-Info "Binary locations:"
Get-ChildItem -Path $BinariesDir -Recurse -Include "crush", "crush.exe" | ForEach-Object {
    Write-Host "  $($_.FullName)"
}
Write-Host ""
