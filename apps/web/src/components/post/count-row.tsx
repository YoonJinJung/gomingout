import { Bookmark, Heart, MessageCircle } from 'lucide-react';

/**
 * 공감·댓글·스크랩 수 (DESIGN.md 7장).
 * 활성 상태: 공감은 --like 채움, 스크랩은 --primary 채움.
 */
export function CountRow({
  likeCount,
  commentCount,
  scrapCount,
  liked = false,
  scrapped = false,
}: {
  likeCount: number;
  commentCount: number;
  scrapCount: number;
  liked?: boolean;
  scrapped?: boolean;
}) {
  return (
    <span className="flex items-center gap-3 text-caption text-text-muted">
      <span className={liked ? 'flex items-center gap-1 text-like' : 'flex items-center gap-1'}>
        <Heart size={16} strokeWidth={1.75} fill={liked ? 'currentColor' : 'none'} aria-hidden />
        <span aria-label={`공감 ${String(likeCount)}`}>{likeCount}</span>
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
        <span aria-label={`댓글 ${String(commentCount)}`}>{commentCount}</span>
      </span>
      <span
        className={scrapped ? 'flex items-center gap-1 text-primary' : 'flex items-center gap-1'}
      >
        <Bookmark
          size={16}
          strokeWidth={1.75}
          fill={scrapped ? 'currentColor' : 'none'}
          aria-hidden
        />
        <span aria-label={`스크랩 ${String(scrapCount)}`}>{scrapCount}</span>
      </span>
    </span>
  );
}
