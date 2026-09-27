# M0 인수인계 메모 (작업 중단 지점)

> 2026-09-27 작업 중단. **아직 `pnpm install`을 실행하지 않았으므로 어떤 것도 실행·검증되지 않았다.**
> 파일 작성까지만 끝난 상태다. 재개 시 아래 순서대로 진행한다.

## 재개 전 준비 (셸마다 필요)

```bash
nvm use 22                 # Node v22.23.3. 미설치면 nvm install 22
node -v                    # v22.23.3 확인
open -a Docker             # Docker Desktop 실행 (데몬 필요)
```

## 지금까지 만든 것 ✅

| 영역 | 상태 |
|---|---|
| git | `git init` 완료, `main` 브랜치, `.gitignore` 작성 (첫 커밋 전에 작성 — `.env` 추적 안 됨) |
| 루트 설정 | `package.json`(스크립트 전부), `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc.json`, `.npmrc`, `.nvmrc`, `.editorconfig` |
| Docker | `docker-compose.yml` — Postgres 17(TZ=UTC, healthcheck) + Mailpit |
| `packages/shared` | MBTI 16종, 카테고리 시드, 신고 사유, 위기 키워드+감지 함수, 프로필 enum, 길이 제한, `PublicAuthor/PublicPost/PublicComment/CursorPage` 타입, `ErrorCode` 목록, 커서 스키마 + **테스트 3종** |
| `apps/api` | Zod env config, Prisma datasource(모델 없음), `app.ts`/`server.ts` 분리, `/api/health`(DB ping), error-handler(`{error:{code,message}}`), `EmailSender`(mock/smtp), `RateLimiter`(memory), `ApiError`, **health 테스트 4종**, `.env.example` + `.env` |
| `apps/web` | `package.json`, `next.config.ts`(rewrites), `tsconfig.json`, `postcss.config.mjs`, `globals.css`(**DESIGN.md 토큰 전체 + shadcn 매핑**), `layout.tsx`(Pretendard), `AppShell`/`AppBar`/`Sidebar`/`BottomTabs`/`Logo`, `lib/utils.ts`, `lib/api-client.ts`, `lib/query-provider.tsx` |
| 폰트 | `apps/web/public/fonts/PretendardVariable.woff2` (2.0MB) + OFL 라이선스 |

## 남은 작업 (이 순서대로)

### 1. 페이지 스텁 5개 — 아직 없음 ⬅️ **여기서 재개**
`apps/web/src/app/` 아래에 빈 페이지가 필요하다. 없으면 빌드가 실패한다.
- `page.tsx` (홈), `categories/page.tsx`, `write/page.tsx`, `me/page.tsx`, `login/page.tsx`
- DESIGN.md 7장 빈 상태 문구 사용: "아직 조용한 밤이에요. 첫 이야기를 들려주세요."

### 2. 남은 설정 파일
- `apps/web/vitest.config.ts` + `vitest.setup.ts` (jsdom, @testing-library)
- `apps/web/src/components/layout/app-shell.test.tsx` (렌더 테스트)
- `apps/web/scripts/screenshot.ts` (Playwright, 390×844 / 1440×900, `scrollWidth <= innerWidth` 자동 단정)

### 3. 설치 · 검증
```bash
pnpm install                          # 아직 한 번도 실행하지 않았다
pnpm --filter @gomingout/api prisma:generate   # Prisma 7 prisma-client 생성기
pnpm db:up                            # Docker Postgres + Mailpit
pnpm typecheck && pnpm lint && pnpm test
pnpm dev                              # web:3000 + api:4000
curl -s localhost:4000/api/health     # {"ok":true,"db":"up"}
curl -s localhost:3000/api/health     # 동일 ← ROADMAP M0 Done 기준
pnpm screenshot
```

### 4. 문서 · 커밋
- `docs/dev/` 4종(SETUP/ARCHITECTURE/ENV/TESTING), `docs/progress/M0.md` 보고서, `PROGRESS.md` ✅ 갱신
- `git push -u origin main` (원격 `YoonJinJung/gomingout` — public, 현재 비어 있음)

## 재개 시 먼저 확인할 위험 3가지

1. **Prisma 7 생성 경로** — `prisma-client` 생성기를 `../src/generated/prisma`로 설정했다.
   `apps/api/src/db/prisma.ts`가 `../generated/prisma/client.js`를 import하는데,
   실제 생성 파일명이 다를 수 있다. `prisma generate` 후 경로를 확인해 맞춘다.
   **모델이 0개인 상태에서 generate가 성공하는지도 미확인.**
2. **ESLint flat config + `projectService: true`** — 타입 인식 린트가 모노레포 전체에서 동작하는지 미검증.
   `eslint-config-next`는 아직 flat config에 연결하지 않았다(설치만 했다). `pnpm lint` 결과를 보고 붙인다.
3. **Tailwind v4 커스텀 유틸** — `max-w-reading`, `rounded-pill`, `text-caption`, `safe-bottom`,
   `size-14` 등이 실제로 생성되는지 첫 렌더에서 확인해야 한다.
   `@utility safe-bottom` 문법과 `--container-reading` → `max-w-reading` 매핑이 v4.3에서 유효한지 미검증.

## 확정된 버전 (설치 시점 레지스트리 확인 결과)

Node 22.23.3 · pnpm 12.6.0 · TypeScript **5.9.3** · Next 16.3.6 · React 19.3.0 ·
Tailwind 4.3.3 · Zod 4.6.5 · Express 5.2.1 · Prisma **7.10.0** · Vitest 5.0.2 ·
Playwright 1.63.0 · ESLint 10.11.0 · typescript-eslint 8.70.1

**버전 선택에서 걸러낸 함정 2개 (되돌리지 말 것):**
- `prisma`의 npm `latest` 태그가 `8.0.0-rc.17`(RC)이고 `@prisma/client`는 7.10.0이다 → 둘 다 **7.10.0**으로 고정했다.
- TypeScript 최신은 **7.0.2**지만 `typescript-eslint@8`의 peer 범위는 `>=4.8.4 <6.1.0`이다.
  TS 6 stable은 존재하지 않는다(beta/dev만). `any` 금지를 lint로 강제해야 하므로 **5.9.3**을 선택했다.
  → typescript-eslint가 TS 7을 지원하면 재검토한다.

## 사용자 지시로 추가된 사항 (DECISIONS.md에 D19로 추가 예정)

- 이메일 인증은 **mock 가능**. `EMAIL_PROVIDER=mock`이 로컬 기본값이며 인증 코드를 콘솔에 출력한다.
  Mailpit(`smtp`)도 그대로 쓸 수 있다.
- **보고서·스크린샷용 고정 테스트 계정**을 시드로 만든다. 진입점은 `apps/api/prisma/seed.ts`에
  `TEST_ACCOUNTS`로 정의해 두었고(test / test2 / admin), `User` 모델이 생기는 **M1에서 실제 생성**한다.
  `pnpm --filter @gomingout/api db:seed`로 실행하며 production에서는 실행을 거부한다.

## 확인이 필요한 미결 사항

- 카테고리 `몸 > 외모` 표기 — PRD 6장 문구를 그대로 썼다(`slug: appearance`). 의도한 표기인지 확인 필요.
- 그 외 문서 모순·결정 필요 사항은 승인된 계획서 2장에 정리되어 있다:
  `~/.claude/plans/claude-md-docs-replicated-emerson.md`
