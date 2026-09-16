# TIBO, PLS.

> 리셋의 성인 · 비공식 팬아트 웹  
> **PATRON SAINT OF ONE MORE RESET · SAINT TIBO**  
> 프로덕션: **https://belo.team**

정적 프론트엔드 사이트입니다. (서버 저장 없음)

## 프로덕션 (belo.team)

서버 PC에서:

```bash
# HTTPS belo.team — Caddy + Let's Encrypt (80/443 열려 있어야 함)
curl -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash

# Caddy + Cloudflare Tunnel (토큰이 있으면 둘 다)
curl -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash -s -- --tunnel 'YOUR_TUNNEL_TOKEN'
```

이미 설치한 경우:

```bash
cd ~/tibo
git pull
cp .env.example .env   # TIBO_DOMAIN=belo.team 확인
docker compose --env-file .env -f docker-compose.yml -f docker-compose.caddy.yml up -d
```

### Cloudflare DNS

| 레코드 | 이름 | 대상 |
|--------|------|------|
| A      | `@`  | 서버 공인 IP (Caddy 사용 시) |
| A 또는 CNAME | `www` | `@` 또는 서버 IP |
| Tunnel | `belo.team`, `www.belo.team` | `http://tibo:80` |

- 네임서버는 Cloudflare 로 위임
- 오렌지 클라우드(프록시)면 SSL/TLS 모드 **Full**
- Tunnel만 쓰면 A 레코드 대신 대시보드 Public hostname

## 자동 빌드 → 자동 배포

1. `main` push → GitHub Actions가 `ghcr.io/divelabkr/tibo:latest` 빌드
2. Watchtower가 서버 컨테이너를 갱신
3. Caddy가 `belo.team` / `www.belo.team` 인증서 유지

GHCR 패키지가 private이면 Packages → `tibo` → Public.

## Compose

```bash
# HTTPS (belo.team)
docker compose --env-file .env -f docker-compose.yml -f docker-compose.caddy.yml up -d

# + Cloudflare Tunnel
docker compose --env-file .env -f docker-compose.yml -f docker-compose.caddy.yml -f docker-compose.tunnel.yml up -d
```

## 라이선스 / 고지

비공식 팬 프로젝트 · OpenAI와 제휴 관계가 아닙니다.  
하트·큰절은 실제 사용량 리셋과 무관합니다.
