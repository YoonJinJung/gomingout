import type { ErrorCode } from '@gomingout/shared';

/**
 * 의도한 에러. error-handler가 이 형태를 보고
 * { error: { code, message } }로 직렬화한다(CLAUDE.md 코드 컨벤션).
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(code: ErrorCode, message: string): ApiError {
    return new ApiError(400, code, message);
  }

  static unauthorized(message = '로그인이 필요해요.'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = '권한이 없어요.'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(code: ErrorCode = 'NOT_FOUND', message = '찾을 수 없어요.'): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(code: ErrorCode, message: string): ApiError {
    return new ApiError(409, code, message);
  }
}
