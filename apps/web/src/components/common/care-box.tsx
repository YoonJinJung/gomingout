import { CRISIS_HOTLINES } from '@gomingout/shared';
import { Moon } from 'lucide-react';

/**
 * 위기 안내 박스 (DESIGN.md 7장, PRD 8장).
 *
 * 설계 제약 (DESIGN.md 14장):
 * - 경고색(빨강·노랑)을 쓰지 않는다. --care / --care-bg만 사용한다.
 * - 사용자를 놀라게 하거나 판단하지 않는 문구를 쓴다.
 * - 작성을 막지 않는다 — 감지는 안내일 뿐이다.
 */
export function CareBox({ className }: { className?: string }) {
  return (
    <aside
      className={`rounded-card border-l-2 border-care bg-care-bg p-4 ${className ?? ''}`}
      aria-label="상담 안내"
    >
      <p className="flex items-center gap-2 text-title-sm text-care">
        <Moon size={20} strokeWidth={1.75} aria-hidden />
        혼자 견디지 않아도 괜찮아요
      </p>
      <p className="mt-2 text-body-sm text-text-muted">
        지금 많이 지치셨다면, 언제든 이야기를 들어줄 곳이 있어요.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {CRISIS_HOTLINES.map((hotline) => (
          <li key={hotline.phone}>
            {/* 탭하면 전화 연결 (DESIGN.md 7장) */}
            <a
              href={`tel:${hotline.phone.replace(/-/g, '')}`}
              className="flex min-h-11 items-center gap-2 rounded-control bg-surface px-3 text-body-sm text-text transition-colors duration-150 hover:bg-surface-2"
            >
              <span>{hotline.name}</span>
              <span className="text-care">{hotline.phone}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
