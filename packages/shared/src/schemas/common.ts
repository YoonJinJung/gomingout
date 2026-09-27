import { z } from 'zod';
import { PAGINATION } from '../constants/limits.js';

/**
 * 커서 페이지네이션 쿼리 (API.md: ?cursor=<id>&limit=20)
 * 프론트·백이 같은 스키마로 검증한다 (절대규칙 6).
 */
export const cursorQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(PAGINATION.maxLimit).default(PAGINATION.defaultLimit),
});

export type CursorQuery = z.infer<typeof cursorQuerySchema>;

/** cuid 형태의 리소스 id */
export const idParamSchema = z.object({ id: z.string().min(1) });

export const sortSchema = z.enum(['latest', 'hot']).default('latest');
export type FeedSort = z.infer<typeof sortSchema>;
