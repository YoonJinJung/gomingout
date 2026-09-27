import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';

/**
 * PrismaClient 싱글톤.
 *
 * 개발 중 tsx watch가 모듈을 다시 읽을 때마다 새 클라이언트를 만들면
 * 커넥션이 계속 쌓여 Postgres 연결 한도에 부딪힌다. globalThis에 캐시해 이를 막는다.
 * (서버 메모리에 "상태"를 두는 것이 아니라 커넥션 풀을 재사용하는 것이다.)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
