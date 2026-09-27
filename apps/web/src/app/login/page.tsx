import { Card } from '@/components/common/card';

export const metadata = { title: '로그인' };

/** 로그인 (PRD 9장). 실제 인증은 M1에서 붙인다 — M0는 화면 구성만. */
export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-4 py-8">
      <div className="text-center">
        <h1 className="text-title-lg text-text">다시 오셨네요</h1>
        <p className="mt-2 text-body-sm text-text-muted">편하게 이야기 나눠요.</p>
      </div>

      <Card className="space-y-3 p-4">
        <label className="block">
          <span className="text-caption text-text-muted">이메일</span>
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-1 min-h-12 w-full rounded-control bg-surface-2 px-3 text-text"
          />
        </label>
        <label className="block">
          <span className="text-caption text-text-muted">비밀번호</span>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 min-h-12 w-full rounded-control bg-surface-2 px-3 text-text"
          />
        </label>
        <button
          type="button"
          className="min-h-12 w-full rounded-control bg-primary text-body-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-strong"
        >
          로그인
        </button>
        <p className="text-center text-caption text-text-subtle">M1에서 실제 인증이 연결됩니다.</p>
      </Card>
    </div>
  );
}
