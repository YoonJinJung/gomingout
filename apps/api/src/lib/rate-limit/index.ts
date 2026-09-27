import { env } from '../../config/env.js';
import { MemoryRateLimiter } from './memory-rate-limiter.js';
import type { RateLimiter } from './types.js';

export type { RateLimiter, RateLimitResult } from './types.js';

export function createRateLimiter(): RateLimiter {
  switch (env.RATE_LIMIT_PROVIDER) {
    case 'memory':
      return new MemoryRateLimiter();
    case 'upstash':
      // M8에서 구현한다.
      throw new Error('Upstash RateLimiter는 M8에서 구현됩니다.');
  }
}
