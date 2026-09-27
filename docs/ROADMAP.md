# 작업 순서 (마일스톤)

원칙: **로컬에서 기능을 먼저 완성하고, 배포는 M8에서 한다.** 단 배포 호환 구조는 처음부터 유지한다(CLAUDE.md "로컬 개발 원칙").

모든 마일스톤 공통 완료 기준:
- 관련 테스트 통과
- 모바일(390×844)·데스크톱(1440×900) 스크린샷 확인 및 저장 (UI가 있는 경우)
- 문서 갱신 + `docs/progress/M{번호}.md` 완료 보고서 작성 + 커밋

## M0. 로컬 기반 세팅
- pnpm 모노레포 (apps/web, apps/api, packages/shared)
- ESLint, Prettier, TypeScript strict
- Docker Compose: PostgreSQL, Mailpit
- Prisma 연결, `.env.example`, Zod 기반 config 모듈
- Express `app.ts`/`server.ts` 분리, `/api/health`
- Next.js rewrites(`/api/*` → localhost:4000), `pnpm dev`로 동시 실행
- `docs/DESIGN.md` 토큰을 CSS 변수·Tailwind·shadcn 테마에 연결, Pretendard 적용
- 기본 레이아웃: 모바일 하단 탭 / 데스크톱 사이드바 (빈 페이지들)
- Playwright 설치, `pnpm screenshot` 스크립트(모바일·데스크톱 뷰포트)
- 테스트 환경(Vitest 등) 구성
- `docs/dev/` 4개 문서 초안, `docs/progress/PROGRESS.md` 갱신
- **Done**: `pnpm dev` 후 localhost:3000에서 `/api/health` 응답 확인, 기본 레이아웃 스크린샷 2종

## M1. 인증 + 프로필
- User/Session/EmailVerification 스키마
- 이메일 인증 코드(로컬은 Mailpit에서 확인), 가입 플로우(연령 확인·약관·프로필·MBTI), 로그인/로그아웃/갱신, 비밀번호 재설정
- RateLimiter 인터페이스(메모리 구현)
- 프로필 조회(공개 항목 필터링)·수정
- **Done**: 가입~로그인~프로필 수정 동작, 비공개 항목 미노출 테스트 통과

## M2. 카테고리 + 게시글
- 카테고리 시드, 트리 API
- 게시글 CRUD, 익명/닉네임·MBTI 스냅샷, serializer
- 카테고리 피드(최신순), 커서 페이지네이션
- 개발용 더미 데이터 시드(화면 확인용)
- **Done**: 익명 글 응답에 authorId/nickname 미포함 테스트 통과

## M3. 댓글
- 댓글 CRUD, AnonymousAlias(익명 번호·글쓴이 표시), 1단계 대댓글
- commentCount 동기화
- **Done**: 같은 사람 익명 댓글 번호 고정, 글쓴이 표시 테스트 통과

## M4. 공감·스크랩·인기
- 게시글·댓글 공감, 게시글 스크랩 (카운트 트랜잭션 처리)
- 인기순 정렬, 홈 인기글 섹션
- 마이페이지(내 글·댓글·스크랩)
- **Done**: 홈 화면 완성

## M5. 안전 기능
- 신고 API, 누적 자동 블라인드
- 어드민 신고 관리 페이지, 사용자 정지
- 위기 키워드 감지(작성 전 모달, crisisFlag, 상세 안내 박스)
- **Done**: 신고 5회 → 블라인드 → 어드민 복구 시나리오 동작

## M6. 계정·정책
- 비밀번호 변경, 회원 탈퇴(개인정보 파기, 글은 "탈퇴한 사용자"로 표시)
- 이용약관·개인정보처리방침 페이지
- **Done**: 탈퇴 후 개인정보 컬럼 파기 확인

## M7. PWA·마무리
- manifest, 아이콘, Serwist 서비스워커, 오프라인 폴백 (localhost에서 설치 확인)
- 전체 화면 반응형·접근성 점검, 로딩/빈 상태/에러 UI
- 성능 점검(Lighthouse), 전체 화면 스크린샷 세트
- **Done**: 로컬에서 전 기능 완성, 모든 문서 최신화

## M8. 배포
- Supabase(서울) DB, Prisma 연결 전환(풀러/직접 URL)
- Vercel 프로젝트 2개 + rewrite, 함수 리전 icn1
- EmailSender → Resend, RateLimiter → Upstash 구현 추가
- 환경변수, 도메인, 실기기 PWA 설치 확인
- `docs/dev/DEPLOY.md` 작성
- **Done**: 배포 URL에서 전 기능 동작
