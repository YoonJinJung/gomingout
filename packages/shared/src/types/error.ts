/**
 * 에러 응답 형식 (CLAUDE.md 코드 컨벤션):
 *   { error: { code: string, message: string } }
 *
 * code는 클라이언트 분기용 기계 판독값, message는 사용자에게 보여줄 한국어 문구다.
 * 문구 톤은 DESIGN.md 12장을 따른다(비난하지 않는 표현).
 */
export const ERROR_CODES = [
  // 공통
  'BAD_REQUEST',
  'VALIDATION_FAILED',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL_ERROR',

  // 인증 (M1)
  'INVALID_CREDENTIALS',
  'EMAIL_ALREADY_EXISTS',
  'NICKNAME_ALREADY_EXISTS',
  'EMAIL_NOT_VERIFIED',
  'VERIFICATION_CODE_INVALID',
  'VERIFICATION_CODE_EXPIRED',
  'VERIFICATION_ATTEMPTS_EXCEEDED',
  'TOKEN_INVALID',
  'TOKEN_EXPIRED',
  'AGE_RESTRICTED',
  'ACCOUNT_SUSPENDED',
  'ACCOUNT_DELETED',

  // 콘텐츠 (M2~M5)
  'POST_NOT_FOUND',
  'COMMENT_NOT_FOUND',
  'CATEGORY_NOT_FOUND',
  'CONTENT_BLINDED',
  'NOT_CONTENT_OWNER',
  'ALREADY_REPORTED',
  'CANNOT_REPORT_OWN_CONTENT',
  'IMMUTABLE_FIELD', // 익명 여부·카테고리는 수정 불가 (절대규칙 3)
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type ApiErrorBody = {
  error: {
    code: ErrorCode;
    message: string;
    /** Zod 검증 실패 시 필드별 메시지. VALIDATION_FAILED에서만 채운다. */
    fields?: Record<string, string[]>;
  };
};
