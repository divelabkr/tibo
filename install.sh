#!/usr/bin/env bash
# TIBO, PLS. — belo.team 배포
# 기본: Caddy HTTPS for belo.team
#   curl -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash
# Cloudflare Tunnel 까지:
#   ./install.sh --tunnel '<CLOUDFLARE_TUNNEL_TOKEN>'
set -euo pipefail

REPO_URL="${TIBO_REPO_URL:-https://github.com/divelabkr/tibo.git}"
INSTALL_DIR="${TIBO_DIR:-$HOME/tibo}"
IMAGE="${TIBO_IMAGE:-ghcr.io/divelabkr/tibo:latest}"
MODE="caddy"
DOMAIN="${TIBO_DOMAIN:-belo.team}"
EMAIL="${CADDY_EMAIL:-admin@belo.team}"
TUNNEL_TOKEN="${CLOUDFLARE_TUNNEL_TOKEN:-}"
HTTP_PORT="${HTTP_PORT:-80}"

usage() {
  cat <<'EOF'
Usage:
  ./install.sh                         # HTTPS belo.team (Caddy)
  ./install.sh --http [--port 80]
  ./install.sh --caddy [domain] [email]
  ./install.sh --tunnel '<token>'      # Caddy + Cloudflare Tunnel
  ./install.sh --dir ~/tibo

Default domain: belo.team
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --http) MODE="http"; shift ;;
    --caddy)
      MODE="caddy"
      shift
      if [[ $# -gt 0 && "$1" != --* ]]; then
        DOMAIN="$1"
        shift
      fi
      if [[ $# -gt 0 && "$1" != --* ]]; then
        EMAIL="$1"
        shift
      fi
      ;;
    --tunnel)
      MODE="prod"
      TUNNEL_TOKEN="${2:-}"
      if [[ -z "$TUNNEL_TOKEN" ]]; then
        echo "error: --tunnel needs a Cloudflare tunnel token" >&2
        exit 1
      fi
      shift 2
      ;;
    --prod) MODE="caddy"; shift ;;
    --dir) INSTALL_DIR="$2"; shift 2 ;;
    --port) HTTP_PORT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

install_docker() {
  if need_cmd docker && docker compose version >/dev/null 2>&1; then
    return
  fi
  echo "Docker not found. Installing..."
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "error: Docker 설치는 root/sudo 가 필요합니다." >&2
    exit 1
  fi
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker 2>/dev/null || true
}

install_docker

if ! docker info >/dev/null 2>&1; then
  echo "error: docker daemon 에 접근할 수 없습니다. sudo 또는 docker 그룹을 확인하세요." >&2
  exit 1
fi

mkdir -p "$INSTALL_DIR"
if [[ -d "$INSTALL_DIR/.git" ]]; then
  git -C "$INSTALL_DIR" fetch --depth 1 origin main
  git -C "$INSTALL_DIR" reset --hard origin/main
else
  git clone --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi
cd "$INSTALL_DIR"

ENV_FILE="$INSTALL_DIR/.env"
cat > "$ENV_FILE" <<EOF
TIBO_IMAGE=$IMAGE
HTTP_PORT=$HTTP_PORT
WATCHTOWER_POLL_INTERVAL=300
TIBO_DOMAIN=$DOMAIN
CADDY_EMAIL=$EMAIL
CLOUDFLARE_TUNNEL_TOKEN=$TUNNEL_TOKEN
EOF

COMPOSE=(docker compose --env-file "$ENV_FILE" -f docker-compose.yml)
case "$MODE" in
  http)   COMPOSE+=(-f docker-compose.http.yml) ;;
  caddy)  COMPOSE+=(-f docker-compose.caddy.yml) ;;
  prod)
    COMPOSE+=(-f docker-compose.caddy.yml)
    COMPOSE+=(-f docker-compose.tunnel.yml)
    ;;
  tunnel) COMPOSE+=(-f docker-compose.tunnel.yml) ;;
esac

echo "Pulling images..."
"${COMPOSE[@]}" pull

echo "Starting ($MODE) for ${DOMAIN}..."
"${COMPOSE[@]}" up -d --remove-orphans

echo
echo "TIBO is running on ${DOMAIN}."
case "$MODE" in
  http)
    echo "Open http://localhost:${HTTP_PORT}  or  http://<server-ip>:${HTTP_PORT}"
    ;;
  caddy)
    echo "Open https://${DOMAIN}  and  https://www.${DOMAIN}"
    echo "Cloudflare DNS: A 레코드가 이 서버 IP 를 가리켜야 합니다. SSL 모드는 Full."
    ;;
  prod)
    echo "Open https://${DOMAIN}"
    echo "Cloudflare Tunnel Public hostname: ${DOMAIN} / www.${DOMAIN} → http://tibo:80"
    ;;
  tunnel)
    echo "Cloudflare Public hostname: ${DOMAIN} / www.${DOMAIN} → http://tibo:80"
    ;;
esac
echo "Watchtower 가 약 300초마다 새 이미지를 확인하고 자동 재시작합니다."
