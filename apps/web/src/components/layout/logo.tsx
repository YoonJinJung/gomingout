/**
 * 로고. 달·별 모티프는 로고·빈 상태·스플래시에만 제한적으로 쓴다 (DESIGN.md 8장).
 * 정식 로고는 추후 제작하고, 지금은 초승달 + 워드마크로 둔다.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="shrink-0 text-primary"
        >
          {/* 초승달 */}
          <path d="M13.2 2.6a7.6 7.6 0 1 0 4.2 12.9A8.6 8.6 0 0 1 13.2 2.6Z" fill="currentColor" />
          <circle cx="16.4" cy="4.4" r="1.05" fill="currentColor" opacity="0.75" />
        </svg>
        <span className="text-title-sm text-text">고밍아웃</span>
      </span>
    </span>
  );
}
