import { notFound } from 'next/navigation';
import { CareBox } from '@/components/common/care-box';
import { Card } from '@/components/common/card';
import { AuthorLabel } from '@/components/post/author-label';
import { CategoryChip } from '@/components/post/category-chip';
import { CountRow } from '@/components/post/count-row';
import { formatRelativeKst } from '@/lib/format-time';
import { MOCK_COMMENTS, MOCK_POSTS } from '@/lib/mock/fixtures';

/**
 * 게시글 상세 + 댓글 (PRD 9장).
 * M0는 mock 데이터로 구성 확인. 실제 API는 M2(글)·M3(댓글)에서 붙인다.
 */
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = MOCK_POSTS.find((candidate) => candidate.id === id);
  if (!post) notFound();

  const comments = MOCK_COMMENTS.filter((comment) => comment.postId === post.id);
  const topLevel = comments.filter((comment) => comment.parentId === null);

  return (
    <article className="space-y-4">
      <Card className="px-4 py-4">
        <div className="flex items-center gap-2">
          <CategoryChip name={post.category.name} />
          <span className="text-caption text-text-muted">
            {post.category.parent.name} · {formatRelativeKst(post.createdAt)}
            {post.editedAt !== null && ' · 수정됨'}
          </span>
        </div>

        <h1 className="mt-3 text-title text-text">{post.title}</h1>

        <div className="mt-2">
          <AuthorLabel author={post.author} />
        </div>

        {/* 본문: 16/27(1.7) — 긴 글 가독성 최우선 (DESIGN.md 4장) */}
        <div className="mt-4 space-y-4 text-body text-text">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-6 border-t pt-3">
          <CountRow
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            scrapCount={post.scrapCount}
            liked={post.viewer?.liked}
            scrapped={post.viewer?.scrapped}
          />
        </div>
      </Card>

      {/* 위기 키워드가 감지된 글에는 상담 창구 안내를 표시한다 (PRD 8장) */}
      {post.crisisFlag && <CareBox />}

      <Card className="px-4 py-4">
        <h2 className="text-title-sm text-text">댓글 {post.commentCount}</h2>

        <ul className="mt-3 divide-y">
          {topLevel.map((comment) => {
            const replies = comments.filter((reply) => reply.parentId === comment.id);
            return (
              <li key={comment.id} className="py-3">
                <div className="flex items-center gap-2">
                  <AuthorLabel author={comment.author} />
                  <span className="text-caption text-text-muted">
                    {formatRelativeKst(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-body text-text">{comment.content}</p>

                {/* 대댓글은 1단계까지 (D18) */}
                {replies.length > 0 && (
                  <ul className="mt-3 space-y-3 border-l border-border pl-3">
                    {replies.map((reply) => (
                      <li key={reply.id}>
                        <div className="flex items-center gap-2">
                          <AuthorLabel author={reply.author} />
                          <span className="text-caption text-text-muted">
                            {formatRelativeKst(reply.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-body text-text">{reply.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </article>
  );
}
