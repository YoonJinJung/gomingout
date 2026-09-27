import { describe, expect, it } from 'vitest';
import { ALL_CATEGORY_SLUGS, CATEGORY_SEED, LEAF_CATEGORY_SLUGS } from './categories.js';

describe('카테고리 시드', () => {
  it('slug가 전체에서 유일하다 — 중복되면 URL이 충돌한다', () => {
    expect(new Set(ALL_CATEGORY_SLUGS).size).toBe(ALL_CATEGORY_SLUGS.length);
  });

  it('모든 대분류가 소분류를 최소 1개 가진다 — 게시글은 소분류에만 연결되므로', () => {
    for (const parent of CATEGORY_SEED) {
      expect(parent.children.length).toBeGreaterThan(0);
    }
  });

  it('slug는 소문자·숫자·하이픈만 쓴다', () => {
    for (const slug of ALL_CATEGORY_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('소분류 slug 수가 전체에서 대분류 수만큼 적다', () => {
    expect(LEAF_CATEGORY_SLUGS.length).toBe(ALL_CATEGORY_SLUGS.length - CATEGORY_SEED.length);
  });
});
