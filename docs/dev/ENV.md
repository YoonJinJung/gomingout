# 환경변수

> ⚠️ 이 저장소는 **public**이다.
> `.env`는 `.gitignore`로 제외되며, 커밋되는 것은 `apps/api/.env.example` 하나뿐이다.
> 이 문서에는 **변수 이름과 설명만** 적고 실제 값은 적지 않는다.

환경변수는 `apps/api/src/config/env.ts` **한 곳에서만** 읽는다(CLAUDE.md 로컬 개발 원칙 5).
Zod로 검증하며, 값이 빠지거나 형식이 틀리면 서버가 뜨지 않고 어떤 변수가 문제인지 알려준다.

## apps/api

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `NODE_ENV` | | `development` | `development` \| `test` \| `production` |
| `PORT` | | `4000` | Express 포트 |
| `DATABASE_URL` | **✔** | — | 런타임 연결. PrismaClient에 driver adapter로 주입된다. 배포 시 Supabase 풀러(`pgbouncer=true`) — T2 |
| `DIRECT_URL` | | `DATABASE_URL` | 마이그레이션 전용 직접 연결. `prisma.config.ts`가 사용한다 — T2 |
| `WEB_ORIGIN` | | `http://localhost:3000` | CORS 허용 오리진 |
| `EMAIL_PROVIDER` | | `mock` | `mock` \| `smtp` \| `resend` |
| `SMTP_HOST` | | `localhost` | `EMAIL_PROVIDER=smtp`일 때 |
| `SMTP_PORT` | | `1025` | Mailpit SMTP |
| `EMAIL_FROM` | | `고밍아웃 <no-reply@gomingout.local>` | 발신자 |
| `RATE_LIMIT_PROVIDER` | | `memory` | `memory` \| `upstash` |
| `REPORT_BLIND_THRESHOLD` | | `5` | 신고 누적 자동 블라인드 임계값 (PRD 8장) |

### EMAIL_PROVIDER 고르기

| 값 | 동작 | 언제 |
|---|---|---|
| `mock` | 인증 코드를 **콘솔에 출력**한다. 실제 발송 없음 | 로컬 기본. 가장 빠르다 |
| `smtp` | Mailpit으로 보낸다. http://localhost:8025 에서 확인 | 실제 메일 형태·HTML을 볼 때 |
| `resend` | M8에서 구현 | 배포 |

## apps/web

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `API_ORIGIN` | | `http://localhost:4000` | `next.config.ts`의 rewrite 대상. 배포 시 api 프로젝트 URL로 바꾼다 |

web에는 현재 `.env` 파일이 필요 없다. 브라우저에서 API를 부를 때는 항상 같은 오리진의
`/api/*`를 쓰고 rewrite가 넘기므로, 클라이언트에 노출되는 API 주소 변수가 없다.

## 배포(M8)에서 추가될 변수

저장소에 커밋하지 않고 **Vercel 환경변수로만** 관리한다.

| 변수 | 설명 |
|---|---|
| `JWT_SECRET` | access token 서명 키. `openssl rand -base64 32`로 생성 |
| `RESEND_API_KEY` | 이메일 발송 |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | rate limit |
