import { z } from 'zod';

/**
 * 환경변수는 이 모듈 한 곳에서만 읽는다(CLAUDE.md 로컬 개발 원칙 5).
 * process.env를 다른 파일에서 직접 참조하면 .env.example과 어긋나기 쉽다.
 *
 * 검증 실패 시 서버를 띄우지 않고 즉시 죽인다.
 * 설정이 빠진 채로 뜨면 런타임에 엉뚱한 곳에서 터지기 때문이다.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL이 필요합니다. .env.example을 참고하세요.'),
  /** 마이그레이션용 직접 연결 (T2). 로컬에서는 DATABASE_URL과 같아도 된다. */
  DIRECT_URL: z.string().min(1).optional(),

  /** 쿠키·CORS를 위한 웹 오리진 */
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),

  /**
   * mock   : 콘솔에 인증 코드 출력 (로컬 기본 — 배포 단계가 아니므로 실제 발송 불필요)
   * smtp   : Docker Mailpit (http://localhost:8025)
   * resend : 배포(M8)
   */
  EMAIL_PROVIDER: z.enum(['mock', 'smtp', 'resend']).default('mock'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  EMAIL_FROM: z.string().default('고밍아웃 <no-reply@gomingout.local>'),

  /** 로컬은 메모리, 배포는 Upstash로 교체된다 */
  RATE_LIMIT_PROVIDER: z.enum(['memory', 'upstash']).default('memory'),

  /** 신고 누적 자동 블라인드 임계값 (PRD 8장: 임계값은 설정값) */
  REPORT_BLIND_THRESHOLD: z.coerce.number().int().positive().default(5),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`환경변수 설정이 올바르지 않습니다.\n${issues}\n\napps/api/.env.example을 참고하세요.`);
  }

  return parsed.data;
}

export const env = loadEnv();

export const isProduction = env.NODE_ENV === 'production';

/**
 * 로컬은 http이므로 Secure 쿠키를 쓸 수 없다.
 * 배포(https)에서는 반드시 Secure를 켠다(PRD 10장).
 */
export const cookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
} as const;
