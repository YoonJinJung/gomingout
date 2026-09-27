import { Router, type Router as ExpressRouter } from 'express';
import { healthRouter } from './health.js';

/**
 * 모든 라우트는 /api 하위에 마운트된다(API.md).
 * 로컬에서는 Next rewrites가, 배포(M8)에서는 Vercel rewrite가 같은 경로로 넘긴다 — T3.
 */
export const apiRouter: ExpressRouter = Router();

apiRouter.use(healthRouter);
