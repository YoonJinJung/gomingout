# 고밍아웃 (Gomingout) — Claude Code 작업 지침

## 프로젝트 요약
고민 상담에 특화된 익명 커뮤니티 웹 서비스. 웹 + 모바일(PWA)을 하나의 Next.js 앱으로 지원한다.
1인 풀스택 개발. **현재 단계는 로컬 개발로 기능을 완성하는 것이며, 배포는 마지막 마일스톤(M8)에서 한다.**

## 반드시 먼저 읽을 문서
- 기획/요구사항: `docs/PRD.md`
- 결정 기록: `docs/DECISIONS.md` (적힌 결정은 임의로 바꾸지 말 것. 변경이 필요하면 먼저 제안)
- DB 스키마: `docs/SCHEMA.md`
- API 명세: `docs/API.md`
- 디자인 가이드: `docs/DESIGN.md` (**UI 작업 전 반드시 읽고 따를 것**)
- 작업 순서: `docs/ROADMAP.md`
- 진행 현황: `docs/progress/PROGRESS.md` (작업 시작 전 확인, 끝나면 갱신)

## 기술 스택
- 모노레포: pnpm workspaces
  - `apps/web`: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + PWA(Serwist)
  - `apps/api`: Express + TypeScript + Prisma
  - `packages/shared`: 공통 타입, Zod 스키마, 상수(카테고리 시드, 신고 사유, 위기 키워드, MBTI 목록)
- 로컬 개발: Docker Compose로 PostgreSQL + Mailpit(메일 확인용)
- 배포(M8): Vercel(web, api) + Supabase Postgres(서울) + Resend + Upstash Redis

## 로컬 개발 원칙 (배포 호환 유지)
1. `pnpm dev` 한 번으로 web(3000) + api(4000)가 함께 실행되게 한다.
2. web의 `/api/*`는 Next.js rewrites로 api 서버에 연결한다(배포 시에도 같은 구조).
3. Express는 `app.ts`(앱 정의·export)와 `server.ts`(listen)를 분리한다. 서버리스 배포 대비.
4. 서버 메모리에 상태를 두지 않는다. 필요한 경우 인터페이스로 감싼다.
   - `EmailSender`: 로컬은 Mailpit(SMTP), 배포는 Resend
   - `RateLimiter`: 로컬은 메모리 구현, 배포는 Upstash
5. 환경변수는 Zod로 검증하는 config 모듈 한 곳에서만 읽는다. `.env.example`을 항상 최신으로 유지.

## 절대 규칙 (보안·익명성)
1. **익명 글·댓글의 작성자 식별 정보(authorId, nickname, 프로필)는 어떤 API 응답에도 포함하지 않는다.** 응답은 반드시 serializer(`toPublicPost`, `toPublicComment`)를 거친다. Prisma 결과를 그대로 반환 금지.
2. 익명 글·댓글에 노출 가능한 프로필 정보는 MBTI(작성 시 `showMbti=true`인 경우, 작성 시점 스냅샷)뿐이다.
3. 이미 작성된 글·댓글의 익명/닉네임 여부는 수정할 수 없다.
4. 다른 사용자의 프로필 조회 시 `*Public=false`인 항목은 응답에서 제외한다.
5. 삭제는 soft delete(`status`, `deletedAt`)로 처리한다.
6. 모든 입력은 `packages/shared`의 Zod 스키마로 검증한다(프론트·백 동일 스키마).
7. 익명성 관련 로직에는 반드시 테스트를 작성한다(응답에 authorId가 새지 않는지 검사 포함).

## 코드 컨벤션
- TypeScript strict. `any` 금지.
- 시간은 DB에 UTC로 저장, 화면에서 KST로 표시.
- UI 문구는 한국어. 톤은 `docs/DESIGN.md` 12장을 따른다.
- 색상·글꼴·간격은 `docs/DESIGN.md`의 토큰만 사용. 컴포넌트에 hex 값 직접 사용 금지.
- 페이지네이션은 커서 기반.
- 에러 응답 형식: `{ error: { code: string, message: string } }`
- 커밋: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …), 의미 있는 단위마다 커밋.

## 화면 확인 (모바일·웹)
- UI 작업이 끝나면 Playwright로 두 뷰포트 스크린샷을 찍어 직접 확인한다.
  - 모바일: 390×844 (iPhone 14 기준)
  - 데스크톱: 1440×900
- 스크린샷은 `docs/progress/screenshots/M{번호}/`에 `{화면명}-mobile.png`, `{화면명}-desktop.png`로 저장.
- 레이아웃 깨짐, 가로 스크롤, 겹침, 대비 부족이 없는지 점검하고 문제가 있으면 고친 뒤 다시 찍는다.
- 명령: `pnpm screenshot` (M0에서 스크립트 구성)

## 문서화 규칙 (필수)
문서는 코드와 같은 커밋에서 갱신한다. 문서가 코드와 다르면 버그로 간주한다.
- `docs/progress/PROGRESS.md`: 마일스톤별 상태 현황판. 작업 시작·완료 시 갱신.
- `docs/progress/M{번호}.md`: 마일스톤 완료 보고서 (템플릿: `docs/progress/_TEMPLATE.md`)
- `docs/dev/SETUP.md`: 처음 받은 사람이 로컬 실행까지 가는 방법
- `docs/dev/ARCHITECTURE.md`: 폴더 구조, 요청 흐름, 인증 흐름, 익명 처리 흐름
- `docs/dev/ENV.md`: 환경변수 목록과 설명
- `docs/dev/TESTING.md`: 테스트 실행 방법, 테스트 범위
- 구현이 `SCHEMA.md`·`API.md`와 달라지면 해당 문서를 갱신한다.
- 새로운 결정이 생기면 `DECISIONS.md`에 ID를 붙여 추가한다(사용자 승인 후).
- 익명성·보안 관련 코드에는 "왜 이렇게 하는지" 주석을 단다.

## 작업 방식
- `docs/ROADMAP.md`의 마일스톤을 순서대로 하나씩 진행한다. 여러 마일스톤을 섞지 않는다.
- 각 마일스톤 시작 전 상세 계획을 먼저 제시하고 승인을 받은 뒤 코드를 작성한다.
- 마일스톤 종료 시: 테스트 통과 → 스크린샷 확인 → 문서 갱신 → 완료 보고서 작성 → 커밋.
- 스키마 변경은 Prisma migration으로만 한다.
