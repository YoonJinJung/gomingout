# 아키텍처

## 폴더 구조

```
gomingout/
├─ apps/
│  ├─ api/                     Express + Prisma
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma      모델 정의 (M1부터 채운다)
│  │  │  └─ seed.ts            카테고리·테스트 계정 시드
│  │  ├─ prisma.config.ts      Prisma 7 CLI 설정 (마이그레이션용 URL)
│  │  └─ src/
│  │     ├─ app.ts             Express 앱 정의·export (listen 없음)
│  │     ├─ server.ts          listen 전용
│  │     ├─ config/env.ts      환경변수를 읽는 유일한 곳 (Zod 검증)
│  │     ├─ db/prisma.ts       PrismaClient 싱글톤 (driver adapter 주입)
│  │     ├─ lib/
│  │     │  ├─ api-error.ts    의도한 에러
│  │     │  ├─ email/          EmailSender 인터페이스 + mock·smtp 구현
│  │     │  └─ rate-limit/     RateLimiter 인터페이스 + memory 구현
│  │     ├─ middleware/        error-handler, not-found
│  │     ├─ routes/            /api 하위 라우터
│  │     └─ generated/prisma/  Prisma 생성 코드 (커밋하지 않음)
│  └─ web/                     Next.js App Router
│     ├─ next.config.ts        /api/* → api 서버 rewrite
│     ├─ scripts/screenshot.ts Playwright 2뷰포트 캡처
│     └─ src/
│        ├─ app/               페이지 (App Router)
│        │  └─ globals.css     ★ 앱 전체에서 hex 값을 가지는 유일한 파일
│        ├─ components/
│        │  ├─ layout/         AppShell · AppBar · Sidebar · BottomTabs
│        │  ├─ post/           PostCard · AuthorLabel · MbtiBadge · CountRow
│        │  └─ common/         Card · CareBox · EmptyState
│        └─ lib/
│           ├─ api-client.ts   fetch 래퍼 (에러 형식 해석)
│           ├─ query-provider.tsx  TanStack Query
│           ├─ format-time.ts  UTC → KST 표시
│           └─ mock/           ⚠️ M0 전용. 실제 API 붙으면 삭제
└─ packages/shared/            타입 · Zod 스키마 · 상수
```

## 요청 흐름

```
브라우저
   │  fetch('/api/posts')          ← 항상 같은 오리진
   ▼
Next.js (3000)
   │  rewrites: /api/:path* → API_ORIGIN/api/:path*
   ▼
Express (4000)
   │  express.json → cookieParser → cors → Cache-Control: private, no-store
   │  → /api 라우터 → notFound → errorHandler
   ▼
Prisma (driver adapter) → Postgres (5433)
```

**왜 rewrite인가**
브라우저에게는 전부 `localhost:3000`이라 인증 쿠키가 자동으로 실리고 CORS 문제가 없다.
배포(M8)에서도 같은 구조를 유지하며 `API_ORIGIN`만 바꾼다(T3).

> ⚠️ 이 구조 때문에 `apps/web`에 `app/api/` 라우트를 만들면 안 된다. 경로가 충돌한다.

## app.ts / server.ts 분리

`createApp()`은 앱만 만들어 export하고, `server.ts`만 `listen`한다.

- 서버리스(Vercel)는 포트를 열지 않고 핸들러만 받는다
- 테스트(supertest)가 포트 점유 없이 앱을 직접 호출한다

## 환경 의존을 인터페이스로 감싼 것

서버 메모리에 상태를 두지 않기 위해, 환경마다 구현이 달라지는 것은 인터페이스 뒤에 둔다.
구현 선택은 각 `index.ts`의 팩토리 한 곳에서만 한다.

| 인터페이스 | 로컬 | 배포(M8) |
|---|---|---|
| `EmailSender` | `MockEmailSender`(콘솔) / `SmtpEmailSender`(Mailpit) | Resend |
| `RateLimiter` | `MemoryRateLimiter` | Upstash Redis |

## Prisma 7 연결 구조

Prisma 7부터 `schema.prisma`에 URL을 쓸 수 없다. 두 갈래로 나뉜다.

| 용도 | 위치 | 사용하는 변수 |
|---|---|---|
| 마이그레이션·introspect (CLI) | `prisma.config.ts` → `datasource.url` | `DIRECT_URL` |
| 런타임 쿼리 | `PrismaClient({ adapter })` | `DATABASE_URL` |

T2와 정확히 맞물린다. 배포 시 런타임은 Supabase 풀러(pgbouncer)를, 마이그레이션은 직접 연결을 쓴다.
로컬에서는 두 값이 같아도 된다.

## 인증 흐름 (M1에서 구현)

```
이메일 입력 → 인증 코드 발송(mock이면 콘솔) → 코드 검증 → 단기 verification 토큰
  → 비밀번호·연령·약관·프로필 입력 → 가입
  → access token + refresh token, 둘 다 httpOnly 쿠키  ← T4, D27
```

### 토큰 구성 (D27)

| 토큰 | 형태 | 기간 | 저장 |
|---|---|---|---|
| access | JWT | 15분 | 저장하지 않음(무상태) |
| refresh | 랜덤 32바이트 | 30일 | `Session.refreshTokenHash`(해시) |
| 이메일 인증 코드 | 6자리 숫자 | 10분 | `EmailVerification.codeHash`(해시) |
| verification 토큰 | 단기 JWT, 1회용 | 10분 | 저장하지 않음 |

### 지켜야 할 것

- **평문 저장 금지**: refresh token과 인증 코드는 해시만 저장한다. DB가 유출돼도 그대로 쓸 수 없어야 한다.
- **refresh 회전 + 재사용 감지**: 갱신할 때마다 새 세션을 만들고 이전 세션에 `rotatedToId`를 남긴다.
  이미 회전된 토큰이 다시 들어오면 탈취로 보고 **해당 사용자의 모든 세션을 끊는다**.
- **시도 제한**: 인증 코드는 5회까지, 재발송은 60초 쿨다운. 로그인·가입·코드 발송에 rate limit을 건다.
- **계정 존재 여부를 흘리지 않는다**: 비밀번호 재설정은 가입된 이메일이든 아니든 같은 응답을 준다.
  로그인 실패도 "이메일이 없음"과 "비밀번호 틀림"을 구분하지 않는다(`INVALID_CREDENTIALS` 하나).
- **비밀번호**: bcryptjs 해싱(T5). 72바이트를 넘으면 잘리므로 입력 길이를 제한한다.
- 쿠키의 `secure` 플래그는 `config/env.ts`의 `cookieBaseOptions`가 `NODE_ENV`로 분기한다.
  로컬은 http라 `secure: false`, 배포는 https라 `true`.

### 권한 (D26)

`Role`은 `USER` / `ADMIN` / `SUPER_ADMIN` 3단계다.
M1에서는 enum과 시드 계정만 만들고, 두 관리자 역할을 구분하지 않는다.
권한 분기(예: 사용자 정지·영구 삭제는 SUPER_ADMIN만)는 어드민 기능이 생기는 M5에서 넣는다.

## 익명 처리 흐름 (핵심)

```
Prisma 결과 (authorId 포함)
        │
        │  ★ toPublicPost / toPublicComment  — 반드시 통과
        ▼
PublicPost / PublicComment   (authorId를 담을 자리가 타입에 없다)
        ▼
    API 응답
```

**설계 의도**: `PublicAuthor`를 판별 유니온으로 만들어, 익명 분기에는 `nickname`·`id` 필드가
아예 존재하지 않게 했다. 실수로 스프레드(`...post`)를 해도 타입 에러로 걸린다.

```ts
type PublicAuthor =
  | { type: 'nickname';  nickname: string; mbti: Mbti | null }  // mbtiPublic일 때만
  | { type: 'anonymous'; label: string;    mbti: Mbti | null }  // 작성 시점 스냅샷
  | { type: 'deleted' };                                         // 탈퇴한 사용자 (D18)
```

지키는 규칙:

1. 익명 글·댓글에 노출 가능한 프로필 정보는 **MBTI 스냅샷뿐**이다. 작성 시점 값을 저장하므로
   이후 MBTI를 바꿔도 과거 글은 변하지 않는다.
2. 닉네임 작성자의 MBTI는 `mbtiPublic=true`일 때만 채운다.
3. 익명 번호(`익명1`, `익명2`)는 **게시글 범위 안에서만** 유지된다(`AnonymousAlias`).
   다른 글에서는 같은 사람이 다른 번호를 받는다.
4. 응답은 전역으로 `Cache-Control: private, no-store`다. `viewer.isMine` 같은 값이
   중간 캐시를 통해 다른 사용자에게 새면 익명 글의 작성자가 특정될 수 있다.
5. 어드민 신고 처리 API만 예외적으로 작성자를 다룬다(PRD 4장). 그 외 어떤 경로로도 노출되지 않는다.

### `글쓴이` 라벨 규칙 (D22 — 확정)

게시글 작성자의 댓글은 **글·댓글의 익명 여부와 무관하게** `글쓴이`로 표시한다.
대화 맥락에서 글쓴이의 답글임을 아는 편이 더 중요하다고 판단했다.

감수하는 것: 닉네임 글에 익명 댓글을 달면 그 댓글의 작성자가 글쓴이임이 드러난다.
의도된 동작이므로 **댓글 작성 화면에서 이를 안내한다**(M3).

`글쓴이`일 때도 `nickname`·`id`는 응답에 넣지 않는다. 라벨만 바뀔 뿐 익명 보호 자체는 유지된다.

## 디자인 토큰

`apps/web/src/app/globals.css`가 앱 전체에서 hex 값을 가지는 유일한 파일이다.

```
:root { --bg, --surface, --primary, ... }        DESIGN.md 3장 원본 토큰
   │
   ├─ @theme inline { --color-bg: var(--bg) }    → Tailwind 유틸 (bg-bg, text-text-muted)
   └─ @layer base   { --background: var(--bg) }  → shadcn/ui 변수
```

컴포넌트에 hex를 직접 쓰지 않는다. 다크가 기본이고, 라이트 토큰은 `:root[data-theme='light']`에
정의만 해두고 전환은 M7에서 붙인다(D15).
