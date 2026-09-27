import Link from 'next/link';
import { Card } from '@/components/common/card';
import { SectionHeader } from '@/components/common/section-header';
import { PostCard } from '@/components/post/post-card';
import { MOCK_FEED, MOCK_HOT } from '@/lib/mock/fixtures';

/**
 * 홈 (PRD 9장): 인기글 섹션 + 최신 글.
 * M0에서는 mock 데이터로 구성을 확인한다. 실제 API는 M2·M4에서 붙인다.
 */
export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 홈 상단에만 아주 은은한 밤하늘 그라데이션 허용 (DESIGN.md 8장) */}
      <section
        className="rounded-card px-4 py-6"
        style={{ background: 'linear-gradient(160deg, var(--bg), var(--night-gradient-end))' }}
      >
        <h1 className="text-title-lg text-text">오늘은 어떤 마음인가요</h1>
        <p className="mt-2 text-body-sm text-text-muted">
          털어놓고 싶은 이야기가 있다면 편하게 적어주세요.
        </p>
      </section>

      <Card>
        <SectionHeader
          title="지금 많이 읽히는 이야기"
          action={
            <Link href="/categories" className="text-caption text-primary">
              전체 보기
            </Link>
          }
        />
        <ul>
          {MOCK_HOT.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      </Card>

      <Card>
        <SectionHeader title="최근 이야기" />
        <ul>
          {MOCK_FEED.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
