'use client';

import { AGE_RANGE_LABELS, OCCUPATION_LABELS } from '@gomingout/shared';
import { useState } from 'react';
import { Card } from '@/components/common/card';
import { EmptyState } from '@/components/common/empty-state';
import { AuthorLabel } from '@/components/post/author-label';
import { MbtiBadge } from '@/components/post/mbti-badge';
import { PostCard } from '@/components/post/post-card';
import { formatRelativeKst } from '@/lib/format-time';
import { MOCK_FEED, MOCK_ME, MOCK_MY_COMMENTS } from '@/lib/mock/fixtures';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'posts', label: '내 글' },
  { key: 'comments', label: '내 댓글' },
  { key: 'scraps', label: '스크랩' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/**
 * 마이페이지 (PRD 9장).
 * 익명으로 쓴 글도 본인의 마이페이지에서는 보인다(PRD 4장).
 * 실제 API는 M4에서 붙인다.
 */
export default function MyPage() {
  const [tab, setTab] = useState<TabKey>('posts');

  const myPosts = MOCK_FEED.filter((post) => post.id === 'p3');
  const scraps = MOCK_FEED.filter((post) => post.id === 'p2');

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-title text-text">{MOCK_ME.nickname}</span>
          <MbtiBadge mbti={MOCK_ME.mbti} />
        </div>
        <p className="mt-2 text-body-sm text-text-muted">{MOCK_ME.bio}</p>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-text-muted">
          {MOCK_ME.occupation !== null && (
            <div className="flex gap-1">
              <dt>현재 상태</dt>
              <dd className="text-text">{OCCUPATION_LABELS[MOCK_ME.occupation]}</dd>
            </div>
          )}
          {MOCK_ME.ageRange !== null && (
            <div className="flex gap-1">
              <dt>연령대</dt>
              <dd className="text-text">{AGE_RANGE_LABELS[MOCK_ME.ageRange]}</dd>
              {/* 비공개 항목은 본인에게만 보이며 배지로 표시한다 (절대규칙 4) */}
              <dd className="text-text-subtle">(비공개)</dd>
            </div>
          )}
        </dl>
      </Card>

      <div role="tablist" aria-label="내 활동" className="flex gap-2">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => {
              setTab(item.key);
            }}
            className={cn(
              'min-h-11 flex-1 rounded-pill text-body-sm transition-colors duration-150',
              tab === item.key
                ? 'bg-primary-soft text-primary'
                : 'bg-surface text-text-muted hover:text-text',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <Card>
          <ul>
            {myPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>
        </Card>
      )}

      {tab === 'comments' && (
        <Card>
          <ul className="divide-y">
            {MOCK_MY_COMMENTS.map((comment) => (
              <li key={comment.id} className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <AuthorLabel author={comment.author} />
                  <span className="text-caption text-text-muted">
                    {formatRelativeKst(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-body-sm text-text">{comment.content}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'scraps' &&
        (scraps.length > 0 ? (
          <Card>
            <ul>
              {scraps.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <EmptyState title="스크랩한 글이 없어요" description="마음에 남는 글을 모아두세요." />
          </Card>
        ))}
    </div>
  );
}
