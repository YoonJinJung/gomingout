import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { apiRouter } from './routes/index.js';

/**
 * Express 앱 정의만 담당한다. listen은 server.ts가 한다.
 *
 * 왜 분리하는가 (CLAUDE.md 로컬 개발 원칙 3):
 * 서버리스(Vercel)에서는 포트를 열지 않고 앱 핸들러만 넘긴다.
 * 또 테스트(supertest)가 포트를 점유하지 않고 앱을 직접 호출할 수 있다.
 */
export function createApp(): Express {
  const app = express();

  // 프록시(Next rewrites / Vercel) 뒤에 있으므로 클라이언트 IP를 신뢰 범위 안에서 읽는다.
  // rate limit이 모든 요청을 같은 IP로 보는 것을 막기 위해 필요하다.
  app.set('trust proxy', 1);
  // 서버 구현을 노출하지 않는다
  app.disable('x-powered-by');

  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      // 인증 쿠키(httpOnly)를 주고받아야 한다
      credentials: true,
    }),
  );

  /**
   * 응답 캐시 금지.
   *
   * 왜 전역으로 막는가 (익명성):
   * 응답에는 viewer.liked / isMine 처럼 "보는 사람에 따라 달라지는" 값이 들어간다.
   * 중간 캐시가 이를 공유하면 다른 사용자에게 내 상태가 노출될 수 있다.
   * 익명 글의 isMine이 새는 것은 곧 작성자 특정으로 이어진다.
   */
  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-store');
    next();
  });

  // 모든 라우트는 /api 하위 (API.md, T3)
  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
