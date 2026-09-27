import { describe, expect, it } from 'vitest';
import { detectCrisisKeyword } from './crisis-keywords.js';

describe('위기 키워드 감지', () => {
  it('일반적인 고민 글은 감지하지 않는다', () => {
    expect(detectCrisisKeyword('요즘 진로가 고민이에요. 조언 부탁드려요.')).toBe(false);
    expect(detectCrisisKeyword('친구랑 싸웠는데 어떻게 화해해야 할까요')).toBe(false);
  });

  it('위기 표현을 감지한다', () => {
    expect(detectCrisisKeyword('너무 힘들어서 죽고 싶어요')).toBe(true);
    expect(detectCrisisKeyword('자해를 반복하고 있어요')).toBe(true);
  });

  it('공백으로 우회한 표현도 감지한다', () => {
    expect(detectCrisisKeyword('죽 고 싶 다')).toBe(true);
  });

  it('빈 문자열은 감지하지 않는다', () => {
    expect(detectCrisisKeyword('')).toBe(false);
  });
});
