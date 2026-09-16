# TIBO, PLS.

> 리셋의 성인 · 비공식 팬아트 웹  
> **PATRON SAINT OF ONE MORE RESET · SAINT TIBO**  
> 프로덕션: **https://belo.team**

정적 프론트엔드 사이트입니다. (서버 저장 없음)

## 프로덕션 (belo.team)

### Windows (PowerShell)

PowerShell의 `curl`은 리눅스 curl이 아닙니다. 아래를 쓰세요.

```powershell
# Docker Desktop 실행된 상태에서
irm https://raw.githubusercontent.com/divelabkr/tibo/main/install.ps1 | iex
```

또는 직접:

```powershell
git clone https://github.com/divelabkr/tibo.git $HOME\tibo
cd $HOME\tibo
Copy-Item .env.example .env
docker compose --env-file .env -f docker-compose.yml -f docker-compose.caddy.yml up -d
```

Cloudflare Tunnel:

```powershell
irm https://raw.githubusercontent.com/divelabkr/tibo/main/install.ps1 | iex
# 토큰이 있으면:
#  .\install.ps1 -TunnelToken 'YOUR_TOKEN'
```

### Linux / macOS / Git Bash / WSL

```bash
curl.exe -fsSL https://raw.githubusercontent.com/divelabkr/tibo/main/install.sh | bash
# Git Bash / WSL 에서만 위가 동작. Windows PowerShell 에서는 install.ps1 사용.
```

이미 설치한 경우:

```powershell
cd $HOME\tibo
git pull
docker compose --env-file .env -f docker-compose.yml -f docker-compose.caddy.yml up -d
```

### Cloudflare DNS

| 레코드 | 이름 | 대상 |
|--------|------|------|
| A      | `@`  | 서버 공인 IP (Caddy 사용 시) |
| A 또는 CNAME | `www` | `@` 또는 서버 IP |
| Tunnel | `belo.team`, `www.belo.team` | `http://tibo:80` |

- 네임서버는 Cloudflare 로 위임
- 오렌지 클라우드면 SSL/TLS 모드 **Full**

## 자동 빌드 → 자동 배포

1. `main` push → GitHub Actions가 `ghcr.io/divelabkr/tibo:latest` 빌드
2. Watchtower가 서버 컨테이너를 갱신
3. Caddy가 `belo.team` / `www.belo.team` 인증서 유지

## 라이선스 / 고지

비공식 팬 프로젝트 · OpenAI와 제휴 관계가 아닙니다.  
하트·큰절은 실제 사용량 리셋과 무관합니다.
