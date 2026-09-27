/** 입력 길이 제한. SCHEMA.md의 컬럼 길이와 반드시 일치해야 한다. */
export const LIMITS = {
  nickname: { min: 2, max: 16 },
  password: { min: 8, max: 72 }, // bcrypt는 72바이트를 넘으면 잘린다
  postTitle: { min: 1, max: 100 }, // Post.title VarChar(100)
  postContent: { min: 1, max: 10_000 }, // Post.content Text
  commentContent: { min: 1, max: 1_000 }, // Comment.content VarChar(1000)
  bio: { max: 100 }, // User.bio VarChar(100)
  reportDetail: { max: 300 }, // Report.detail VarChar(300)
} as const;

/** 커서 페이지네이션 (CLAUDE.md: 페이지네이션은 커서 기반) */
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 50,
} as const;

/** 신고 누적 자동 블라인드 임계값 (PRD 8장). 서버 설정값으로 덮어쓸 수 있다. */
export const DEFAULT_REPORT_BLIND_THRESHOLD = 5;

/** 홈 인기글 섹션 (PRD 7장) */
export const HOT_HOME = { windowHours: 72, take: 5 } as const;

/** 인기순 피드 대상 기간 (PRD 7장) */
export const HOT_FEED_WINDOW_DAYS = 7;
