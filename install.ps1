# TIBO, PLS. — Windows PowerShell installer (belo.team)
# 실행:
#   irm https://raw.githubusercontent.com/divelabkr/tibo/main/install.ps1 | iex
# 터널:
#   irm https://raw.githubusercontent.com/divelabkr/tibo/main/install.ps1 | iex -TunnelToken '토큰'
param(
  [ValidateSet('http','caddy','prod')]
  [string]$Mode = 'caddy',
  [string]$Domain = 'belo.team',
  [string]$Email = 'admin@belo.team',
  [string]$TunnelToken = $env:CLOUDFLARE_TUNNEL_TOKEN,
  [string]$InstallDir = $(Join-Path $HOME 'tibo'),
  [string]$HttpPort = '80'
)

$ErrorActionPreference = 'Stop'
$RepoUrl = 'https://github.com/divelabkr/tibo.git'
$Image = 'ghcr.io/divelabkr/tibo:latest'

function Need-Cmd($name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

if (-not (Need-Cmd docker)) {
  Write-Error "Docker Desktop 이 필요합니다. https://www.docker.com/products/docker-desktop/ 설치 후 이 창을 다시 여세요."
}

docker info 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Docker 엔진이 꺼져 있습니다. Docker Desktop 을 실행한 뒤 다시 시도하세요."
}

if (-not (Need-Cmd git)) {
  Write-Error "Git 이 필요합니다. https://git-scm.com/download/win 설치 후 다시 시도하세요."
}

if (Test-Path (Join-Path $InstallDir '.git')) {
  git -C $InstallDir fetch --depth 1 origin main
  git -C $InstallDir reset --hard origin/main
} else {
  if (Test-Path $InstallDir) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
  }
  git clone --depth 1 $RepoUrl $InstallDir
}

Set-Location $InstallDir

@"
TIBO_IMAGE=$Image
HTTP_PORT=$HttpPort
WATCHTOWER_POLL_INTERVAL=300
TIBO_DOMAIN=$Domain
CADDY_EMAIL=$Email
CLOUDFLARE_TUNNEL_TOKEN=$TunnelToken
"@ | Set-Content -Path (Join-Path $InstallDir '.env') -Encoding ascii

$compose = @('compose', '--env-file', '.env', '-f', 'docker-compose.yml')
switch ($Mode) {
  'http'  { $compose += @('-f', 'docker-compose.http.yml') }
  'caddy' { $compose += @('-f', 'docker-compose.caddy.yml') }
  'prod'  {
    $compose += @('-f', 'docker-compose.caddy.yml')
    if ($TunnelToken) { $compose += @('-f', 'docker-compose.tunnel.yml') }
  }
}
if ($Mode -eq 'caddy' -and $TunnelToken) {
  $compose += @('-f', 'docker-compose.tunnel.yml')
}

Write-Host "Pulling images..."
& docker @compose pull
Write-Host "Starting ($Mode) for $Domain ..."
& docker @compose up -d --remove-orphans

Write-Host ""
Write-Host "TIBO is running on $Domain"
Write-Host "Open https://$Domain"
Write-Host "설치 폴더: $InstallDir"
