import type { ApiErrorBody, ErrorCode } from '@gomingout/shared';

/**
 * API 호출 래퍼.
 *
 * 경로는 항상 같은 오리진의 /api/* 를 쓴다. Next rewrites가 Express로 넘긴다(T3).
 * 덕분에 인증 쿠키(httpOnly)가 자동으로 실리고, 배포 시에도 코드가 그대로다.
 */
export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode | 'NETWORK_ERROR',
    message: string,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false;
  const { error } = value as { error: unknown };
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      // 인증 쿠키를 항상 함께 보낸다
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiClientError(
      0,
      'NETWORK_ERROR',
      '연결이 불안정한 것 같아요. 잠시 뒤에 다시 시도해 주세요.',
    );
  }

  if (response.status === 204) return undefined as T;

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorBody(body)) {
      throw new ApiClientError(
        response.status,
        body.error.code,
        body.error.message,
        body.error.fields,
      );
    }
    throw new ApiClientError(
      response.status,
      'INTERNAL_ERROR',
      '잠시 문제가 생겼어요. 조금 뒤에 다시 시도해 주세요.',
    );
  }

  return body as T;
}
