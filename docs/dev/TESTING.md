# 테스트

## 실행

```bash
pnpm test                              # 전체 (shared → api → web)
pnpm --filter @gomingout/api test      # 특정 패키지만
pnpm verify                            # format:check + lint + typecheck + test
```

`apps/api` 테스트는 **Docker Postgres가 떠 있어야** 한다(`pnpm db:up`).
health 테스트가 실제 DB 연결을 확인하기 때문이다.

## 구성

| 패키지 | 러너 | 환경 | 대상 |
|---|---|---|---|
| `packages/shared` | Vitest 5 | node | 상수·스키마 불변식 |
| `apps/api` | Vitest 5 + supertest | node | `createApp()`을 직접 호출(포트 점유 없음) |
| `apps/web` | Vitest 5 + Testing Library | jsdom | 컴포넌트 렌더 |

`app.ts`와 `server.ts`를 나눈 덕분에 API 테스트가 서버를 띄우지 않고 앱을 직접 호출한다.

## 현재 테스트 (M0 기준 23개)

### packages/shared (11)
- MBTI 16종·중복 없음·`isMbti` 경계
- 카테고리 slug 전역 유일성, 대분류마다 소분류 존재, slug 형식
- 위기 키워드: 일반 고민 글 오탐 없음, 위기 표현 감지, 공백 우회 감지

### apps/api (4)
- `GET /api/health` 응답 형식과 UTC 시각
- **`Cache-Control: private, no-store`** — viewer 상태가 캐시로 새지 않는지
- `x-powered-by` 미노출
- 없는 경로가 `{ error: { code, message } }` 형식의 404를 반환

### apps/web (8)
- `AppShell` 하단 탭·사이드바 렌더
- **`AuthorLabel` 익명성 (핵심)**

## 익명성 테스트 원칙 (CLAUDE.md 절대규칙 7)

익명성 관련 코드에는 반드시 테스트를 쓴다. 현재 검사하는 것:

- 익명 작성자 표시에 **라벨과 MBTI 외에 아무것도 나오지 않는다**
- MBTI 표시를 끈 익명 작성자는 라벨만 렌더된다
- `mbtiPublic=false`인 닉네임 작성자는 MBTI 배지가 없다
- 탈퇴한 사용자는 닉네임을 노출하지 않는다
- 익명 작성자 객체에 `nickname`·`id` 키가 **존재하지 않는다**
- 직렬화 결과에 `authorId` 문자열이 나타나지 않는다

마지막 두 개는 실제 API가 붙는 M2·M3에서 **serializer(`toPublicPost`/`toPublicComment`) 출력**을
대상으로 같은 검사를 반복한다.

## 화면 확인

```bash
pnpm dev          # 다른 터미널에서
pnpm screenshot   # 기본 M0. 다른 마일스톤은 pnpm screenshot -- M1
```

- 모바일 390×844, 데스크톱 1440×900 두 뷰포트
- `docs/progress/screenshots/M{번호}/`에 저장
- 각 화면에서 **가로 스크롤(`scrollWidth > innerWidth`)을 자동으로 잡고**, 콘솔 에러를 모아 보고한다.
  문제가 있으면 종료 코드 1로 끝난다.
- `position: fixed`인 하단 탭이 전체 페이지 캡처에서 중간에 박제되므로 **뷰포트 캡처**를 쓴다.
