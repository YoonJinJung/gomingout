import { describe, expect, it } from 'vitest';
import { MBTI_TYPES, isMbti } from './mbti.js';

describe('MBTI 상수', () => {
  it('정확히 16종이다', () => {
    expect(MBTI_TYPES).toHaveLength(16);
  });

  it('중복이 없다', () => {
    expect(new Set(MBTI_TYPES).size).toBe(MBTI_TYPES.length);
  });

  it('isMbti가 목록 밖의 값을 거른다', () => {
    expect(isMbti('INFP')).toBe(true);
    expect(isMbti('infp')).toBe(false);
    expect(isMbti('XXXX')).toBe(false);
  });
});
