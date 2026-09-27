import { createApp } from './app.js';
import { env } from './config/env.js';

/** listen 전용. 앱 정의는 app.ts에 있다(CLAUDE.md 로컬 개발 원칙 3). */
const app = createApp();

const server = app.listen(env.PORT, () => {
  console.info(`[api] http://localhost:${String(env.PORT)}/api/health (${env.NODE_ENV})`);
});

function shutdown(signal: string): void {
  console.info(`[api] ${signal} 수신 — 종료합니다.`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
