import { defineConfig } from 'prisma/config';

/**
 * Prisma CLI 설정 (Prisma 7).
 *
 * 왜 여기에 URL이 있는가:
 * Prisma 7부터 datasource url을 schema.prisma에 쓸 수 없다.
 * 마이그레이션·introspect 같은 CLI 작업은 이 datasource.url을 사용하고,
 * 런타임 연결은 PrismaClient에 driver adapter로 따로 주입한다.
 *
 * T2와 맞물리는 부분:
 *   - CLI(마이그레이션)  → DIRECT_URL (직접 연결). 풀러를 통하면 마이그레이션이 실패한다.
 *   - 런타임(PrismaClient) → DATABASE_URL (배포 시 Supabase 풀러, pgbouncer=true)
 * 로컬에서는 두 값이 같아도 된다.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
});
