import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

/**
 * PrismaClient 싱글톤.
 *
 * Prisma 7은 런타임 연결을 driver adapter로 받는다.
 * 여기에는 DATABASE_URL(배포 시 Supabase 풀러)을 쓰고,
 * 마이그레이션용 직접 연결(DIRECT_URL)은 prisma.config.ts가 따로 쓴다 — T2.
 *
 * globalThis에 캐시하는 이유:
 * 개발 중 tsx watch가 모듈을 다시 읽을 때마다 새 클라이언트를 만들면
 * 커넥션이 쌓여 Postgres 연결 한도에 부딪힌다.
 * (상태를 두는 것이 아니라 커넥션 풀을 재사용하는 것이다.)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
