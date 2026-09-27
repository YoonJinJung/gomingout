import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { ApiErrorBody } from '@gomingout/shared';
import { ApiError } from '../lib/api-error.js';
import { isProduction } from '../config/env.js';

/** 라우터에 걸리지 않은 경로 */
export const notFoundHandler: RequestHandler = (_req, res) => {
  const body: ApiErrorBody = {
    error: { code: 'NOT_FOUND', message: '요청한 경로를 찾을 수 없어요.' },
  };
  res.status(404).json(body);
};

/**
 * 모든 에러 응답은 여기를 거친다.
 * 예상하지 못한 에러의 내부 메시지·스택은 클라이언트로 내보내지 않는다.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    const body: ApiErrorBody = {
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    };
    res.status(err.status).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || '_';
      (fields[key] ??= []).push(issue.message);
    }
    const body: ApiErrorBody = {
      error: { code: 'VALIDATION_FAILED', message: '입력값을 다시 확인해 주세요.', fields },
    };
    res.status(400).json(body);
    return;
  }

  // 예상하지 못한 에러: 서버 로그에는 남기고, 응답에는 상세를 담지 않는다.
  console.error('[unhandled error]', err);
  const body: ApiErrorBody = {
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction
        ? '잠시 문제가 생겼어요. 조금 뒤에 다시 시도해 주세요.'
        : `서버 오류: ${err instanceof Error ? err.message : String(err)}`,
    },
  };
  res.status(500).json(body);
};
