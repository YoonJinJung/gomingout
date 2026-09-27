import { Router } from 'express';
import { prisma } from '../db/prisma.js';

export const healthRouter = Router();

/**
 * GET /api/health
 * M0 완료 기준: localhost:3000/api/health 가 Next rewrites를 거쳐 이 응답을 반환한다.
 * DB 연결까지 함께 확인해 "서버는 떴지만 DB가 없는" 상태를 구분한다.
 */
healthRouter.get('/health', async (_req, res) => {
  let db: 'up' | 'down' = 'down';
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = 'up';
  } catch (error) {
    console.error('[health] DB 연결 실패:', error instanceof Error ? error.message : error);
  }

  res.status(db === 'up' ? 200 : 503).json({
    ok: db === 'up',
    db,
    // 시간은 항상 UTC로 다룬다(CLAUDE.md 코드 컨벤션)
    time: new Date().toISOString(),
  });
});
