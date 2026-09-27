import { describe, expect, it } from 'vitest';
import { AUTHOR_LABEL, anonymousNumberLabel, isPostAuthorLabel } from './author-label.js';

describe('작성자 라벨', () => {
  it('익명 번호 라벨을 만든다', () => {
    expect(anonymousNumberLabel(1)).toBe('익명1');
    expect(anonymousNumberLabel(12)).toBe('익명12');
  });

  it('글쓴이 라벨을 판별한다', () => {
    expect(isPostAuthorLabel(AUTHOR_LABEL.postAuthor)).toBe(true);
    expect(isPostAuthorLabel('익명1')).toBe(false);
    expect(isPostAuthorLabel(AUTHOR_LABEL.anonymous)).toBe(false);
  });

  it('익명 번호 라벨은 글쓴이로 오인되지 않는다', () => {
    for (let index = 1; index <= 20; index += 1) {
      expect(isPostAuthorLabel(anonymousNumberLabel(index))).toBe(false);
    }
  });
});
