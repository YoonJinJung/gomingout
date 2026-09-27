/**
 * RateLimiter 인터페이스.
 *
 * 왜 인터페이스로 감싸는가 (CLAUDE.md 로컬 개발 원칙 4):
 * 로컬은 메모리, 배포(M8)는 Upstash Redis를 쓴다.
 * 서버리스에서는 인스턴스가 여러 개라 메모리 구현이 맞지 않기 때문이다.
 */
export type RateLimitResult = {
  /** 허용 여부 */
  allowed: boolean;
  /** 남은 횟수 */
  remaining: number;
  /** 제한이 풀리는 시각 (epoch ms) */
  resetAt: number;
};

export interface RateLimiter {
  /**
   * @param key 제한 단위 (예: `login:${ip}`, `send-code:${email}`)
   * @param limit 창(window) 내 허용 횟수
   * @param windowMs 창 길이 (ms)
   */
  consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
}
