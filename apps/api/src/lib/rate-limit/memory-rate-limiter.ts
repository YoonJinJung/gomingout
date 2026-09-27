import type { RateLimiter, RateLimitResult } from './types.js';

type Bucket = { count: number; resetAt: number };

/**
 * 로컬 개발용 고정 창(fixed window) 구현.
 *
 * 프로세스 메모리를 쓰므로 서버가 재시작되면 초기화되고, 인스턴스가 여러 개면 정확하지 않다.
 * 그래서 배포(M8)에서는 Upstash 구현으로 교체한다 — 인터페이스를 둔 이유가 이것이다.
 */
export class MemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      this.sweep(now);
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    existing.count += 1;
    const allowed = existing.count <= limit;
    return {
      allowed,
      remaining: Math.max(0, limit - existing.count),
      resetAt: existing.resetAt,
    };
  }

  /** 만료된 버킷을 정리해 Map이 무한히 커지는 것을 막는다. */
  private sweep(now: number): void {
    if (this.buckets.size < 1000) return;
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}
