# TIBO, PLS.

> 리셋의 성인 · 비공식 팬아트 웹  
> **PATRON SAINT OF ONE MORE RESET · SAINT TIBO**

정적 프론트엔드 사이트입니다. (서버 저장 없음, 로컬 데모)

## 서버에 한 번에 설치

PC를 서버로 쓰는 경우, 저장소의 `install.sh` 한 줄이면 Docker + 컨테이너 + 자동 업데이트가 뜹니다.

```bash
# 1) HTTP (기본, LAN / 포트 80)
curl -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash

# 2) HTTPS — Cloudflare Tunnel (가정용 PC 권장, 포트포워딩 불필요)
curl -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash -s -- --tunnel 'YOUR_TUNNEL_TOKEN'

# 3) HTTPS — Caddy + Let's Encrypt (공인 도메인 + 80/443 포워딩 필요)
curl -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash -s -- --caddy example.com you@example.com
```

설치 위치 기본값: `~/tibo`

## 자동 빌드 → 자동 배포

1. `main` 에 push → GitHub Actions가 Docker 이미지 빌드
2. `ghcr.io/divelabkr/tibo:latest` 로 푸시
3. 서버의 **Watchtower**가 새 이미지를 감지하고 컨테이너를 재시작

첫 이미지 빌드 후 GHCR 패키지가 private이면  
GitHub → Packages → `tibo` → Package settings → Change visibility → **Public**  
또는 서버에서 `docker login ghcr.io` 후 사용.

## Compose 직접 실행

```bash
git clone https://github.com/divelabkr/tibo.git
cd tibo
cp .env.example .env

# HTTP
docker compose -f docker-compose.yml -f docker-compose.http.yml up -d

# Caddy HTTPS
# .env 에 TIBO_DOMAIN, CADDY_EMAIL
docker compose -f docker-compose.yml -f docker-compose.caddy.yml up -d

# Cloudflare Tunnel
# .env 에 CLOUDFLARE_TUNNEL_TOKEN
# 대시보드 Public hostname → http://tibo:80
docker compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d
```

## 로컬에서 이미지 빌드

```bash
docker build -t tibo-pls .
docker run -d --name tibo-pls -p 80:80 tibo-pls
```

## Cloudflare Tunnel 설정 요약

1. [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → Networks → Tunnels → Create
2. Docker 설치 방식 선택 후 **토큰** 복사
3. Public Hostname 추가: 서비스 URL `http://tibo:80`
4. `./install.sh --tunnel '<토큰>'`

## 폴더 구조

```
├── index.html
├── robots.txt
├── web.config                 # IIS용 (Docker에서는 사용 안 함)
├── assets/
├── Dockerfile
├── nginx.conf
├── docker-compose.yml         # tibo + watchtower
├── docker-compose.http.yml
├── docker-compose.caddy.yml
├── docker-compose.tunnel.yml
├── Caddyfile
├── install.sh
├── .env.example
└── .github/workflows/docker.yml
```

## 보안 헤더

nginx에 포함:

- Content-Security-Policy (엄격)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer
- X-Robots-Tag: noindex, nofollow

## 라이선스 / 고지

비공식 팬 프로젝트 · OpenAI와 제휴 관계가 아닙니다.  
하트·큰절은 실제 사용량 리셋과 무관합니다.
