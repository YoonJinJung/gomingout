import type { PublicAuthor } from '@gomingout/shared';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthorLabel } from './author-label';
import { MOCK_COMMENTS, MOCK_POSTS } from '@/lib/mock/fixtures';

/**
 * 익명성 테스트 (CLAUDE.md 절대규칙 7).
 * 화면에 작성자 식별 정보가 새지 않는지 검사한다.
 */
describe('AuthorLabel — 익명 표시', () => {
  it('익명 작성자는 라벨과 MBTI만 보여준다', () => {
    const author: PublicAuthor = { type: 'anonymous', label: '익명3', mbti: 'INFP' };
    render(<AuthorLabel author={author} />);

    expect(screen.getByText('익명3')).toBeInTheDocument();
    expect(screen.getByText('INFP')).toBeInTheDocument();
  });

  it('MBTI 표시를 끈 익명 작성자는 라벨만 보여준다', () => {
    const author: PublicAuthor = { type: 'anonymous', label: '익명', mbti: null };
    const { container } = render(<AuthorLabel author={author} />);

    expect(screen.getByText('익명')).toBeInTheDocument();
    expect(container.textContent).toBe('익명');
  });

  it('글쓴이 익명 댓글은 "글쓴이"로 표시된다', () => {
    const author: PublicAuthor = { type: 'anonymous', label: '글쓴이', mbti: 'INFP' };
    render(<AuthorLabel author={author} />);

    expect(screen.getByText('글쓴이')).toBeInTheDocument();
  });

  it('탈퇴한 사용자는 닉네임을 노출하지 않는다', () => {
    const { container } = render(<AuthorLabel author={{ type: 'deleted' }} />);
    expect(container.textContent).toBe('탈퇴한 사용자');
  });

  it('mbtiPublic=false인 닉네임 작성자는 MBTI 배지를 그리지 않는다', () => {
    const author: PublicAuthor = { type: 'nickname', nickname: '민트초코', mbti: null };
    const { container } = render(<AuthorLabel author={author} />);

    expect(container.textContent).toBe('민트초코');
  });
});

describe('mock 데이터가 익명 규칙을 지킨다', () => {
  it('익명 글·댓글에 nickname 키가 존재하지 않는다', () => {
    const anonymousAuthors = [...MOCK_POSTS, ...MOCK_COMMENTS]
      .map((item) => item.author)
      .filter((author) => author.type === 'anonymous');

    expect(anonymousAuthors.length).toBeGreaterThan(0);
    for (const author of anonymousAuthors) {
      expect(author).not.toHaveProperty('nickname');
      expect(author).not.toHaveProperty('id');
    }
  });

  it('어떤 글·댓글에도 authorId가 새지 않는다', () => {
    const serialized = JSON.stringify([...MOCK_POSTS, ...MOCK_COMMENTS]);
    expect(serialized).not.toContain('authorId');
  });
});
