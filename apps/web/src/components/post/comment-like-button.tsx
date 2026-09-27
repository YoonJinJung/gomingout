import { Heart } from 'lucide-react';

/**
 * 댓글 공감 (D18, D23).
 * 활성 시 --like로 채운다. 게시글 공감과 같은 규칙이다 (DESIGN.md 7장).
 * 실제 토글은 M4에서 붙인다.
 */
export function CommentLikeButton({ likeCount, liked }: { likeCount: number; liked: boolean }) {
  return (
    <button
      type="button"
      aria-label={liked ? '공감 취소' : '공감'}
      aria-pressed={liked}
      className={`flex min-h-11 items-center gap-1 text-caption transition-colors duration-150 ${
        liked ? 'text-like' : 'text-text-muted hover:text-text'
      }`}
    >
      <Heart size={16} strokeWidth={1.75} fill={liked ? 'currentColor' : 'none'} aria-hidden />
      {likeCount}
    </button>
  );
}
