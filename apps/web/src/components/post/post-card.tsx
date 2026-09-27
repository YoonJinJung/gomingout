import type { PublicPostSummary } from '@gomingout/shared';
import Link from 'next/link';
import { formatRelativeKst } from '@/lib/format-time';
import { AuthorLabel } from './author-label';
import { CategoryChip } from './category-chip';
import { CountRow } from './count-row';

/**
 * 게시글 카드 (DESIGN.md 7장).
 * 카드 전체가 탭 영역이고, 눌림 시 --surface-2.
 */
export function PostCard({ post, now }: { post: PublicPostSummary; now?: number }) {
  return (
    <li className="border-b last:border-b-0">
      <Link
        href={`/posts/${post.id}`}
        className="block px-4 py-4 transition-colors duration-150 hover:bg-surface-2 active:bg-surface-2"
      >
        <span className="mb-2 flex items-center gap-2">
          <CategoryChip name={post.category.name} />
          <span className="text-caption text-text-muted">
            {formatRelativeKst(post.createdAt, now)}
          </span>
        </span>

        <h3 className="truncate text-title-sm text-text">{post.title}</h3>

        <p className="mt-1 line-clamp-2 text-body-sm text-text-muted">{post.preview}</p>

        <span className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <AuthorLabel author={post.author} />
          <CountRow
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            scrapCount={post.scrapCount}
          />
        </span>
      </Link>
    </li>
  );
}
