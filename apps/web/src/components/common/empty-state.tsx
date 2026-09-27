/**
 * 빈 상태 (DESIGN.md 7장).
 * 달·별 모티프는 로고·빈 상태·스플래시에만 쓴다 (DESIGN.md 8장).
 */
export function EmptyState({
  title = '아직 조용한 밤이에요',
  description = '첫 이야기를 들려주세요.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path
          d="M34 10a18 18 0 1 0 10 32.6A20.4 20.4 0 0 1 34 10Z"
          fill="currentColor"
          className="text-surface-2"
        />
        <circle cx="42" cy="15" r="2" fill="currentColor" className="text-primary opacity-60" />
        <circle cx="48" cy="24" r="1.4" fill="currentColor" className="text-primary opacity-40" />
        <circle cx="13" cy="17" r="1.2" fill="currentColor" className="text-primary opacity-30" />
      </svg>
      <p className="mt-4 text-title-sm text-text">{title}</p>
      <p className="mt-1 text-body-sm text-text-muted">{description}</p>
    </div>
  );
}
