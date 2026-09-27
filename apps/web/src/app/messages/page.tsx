import { Mail } from 'lucide-react';
import { Card } from '@/components/common/card';

export const metadata = { title: '쪽지' };

/**
 * 쪽지 — 준비 중 (D5, D24).
 *
 * 쪽지는 MVP 범위 밖이다. 다만 하단 탭에 자리를 미리 두었으므로,
 * 누른 사람이 막다른 곳에 도착하지 않도록 안내 화면을 둔다.
 *
 * 익명 커뮤니티에서 DM은 괴롭힘 위험이 있어 별도 설계가 필요하다(D5).
 * 특히 익명 글 작성자에게 쪽지를 보낼 때 상대 신원이 드러나지 않아야 한다.
 */
export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <h1 className="px-1 text-title-lg text-text">쪽지</h1>

      <Card className="px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-pill bg-surface-2">
            <Mail size={24} strokeWidth={1.75} aria-hidden className="text-text-subtle" />
          </span>

          <p className="mt-4 text-title-sm text-text">아직 준비하고 있어요</p>
          <p className="mt-2 max-w-xs text-body-sm text-text-muted">
            마음이 맞는 사람과 조용히 이야기 나눌 수 있는 쪽지를 준비하고 있어요. 조금만
            기다려주세요.
          </p>

          <p className="mt-6 max-w-sm rounded-card bg-surface-2 px-4 py-3 text-caption text-text-subtle">
            익명으로 쓴 글에 쪽지를 받더라도 누구인지 드러나지 않도록 만들고 있어요.
          </p>
        </div>
      </Card>
    </div>
  );
}
