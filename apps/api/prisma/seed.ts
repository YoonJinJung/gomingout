/**
 * 개발용 시드 스크립트.
 *
 * 실행: pnpm --filter @gomingout/api db:seed
 *
 * 담을 것 (마일스톤 순서대로 채운다):
 * - M1: 카테고리 시드 + 테스트 계정 (아래 TEST_ACCOUNTS)
 * - M2: 화면 확인용 더미 게시글
 *
 * ⚠️ 여기서 만드는 계정은 로컬 개발·보고서 스크린샷 전용이다.
 *    배포(M8) 환경에서는 절대 실행하지 않는다 — 아래에서 NODE_ENV를 검사한다.
 */
import { env } from '../src/config/env.js';

/**
 * 보고서·스크린샷용 고정 테스트 계정 (M1에서 생성).
 *
 * 이메일 인증은 mock 발송기(EMAIL_PROVIDER=mock)로 건너뛰고,
 * 시드에서는 emailVerifiedAt을 채운 상태로 바로 만든다.
 * 비밀번호가 코드에 그대로 있는 것은 로컬 전용이기 때문이며,
 * 이 계정 정보는 실제 서비스에 존재하지 않는다.
 */
export const TEST_ACCOUNTS = [
  {
    email: 'test@gomingout.local',
    password: 'test1234!',
    nickname: '밤하늘',
    mbti: 'INFP',
    role: 'USER',
  },
  {
    email: 'test2@gomingout.local',
    password: 'test1234!',
    nickname: '초승달',
    mbti: 'ENTP',
    role: 'USER',
  },
  {
    email: 'admin@gomingout.local',
    password: 'admin1234!',
    nickname: '관리자',
    mbti: 'ISTJ',
    role: 'ADMIN',
  },
  {
    email: 'super@gomingout.local',
    password: 'super1234!',
    nickname: '운영자',
    mbti: 'INTJ',
    role: 'SUPER_ADMIN',
  },
] as const;

async function main(): Promise<void> {
  if (env.NODE_ENV === 'production') {
    throw new Error('시드 스크립트는 production에서 실행할 수 없습니다.');
  }

  console.info('[seed] M0에서는 아직 생성할 모델이 없습니다.');
  console.info('[seed] M1에서 카테고리와 아래 테스트 계정을 생성합니다:');
  for (const account of TEST_ACCOUNTS) {
    console.info(`  - ${account.email} / ${account.password} (${account.role})`);
  }
}

main().catch((error: unknown) => {
  console.error('[seed] 실패:', error);
  process.exit(1);
});
