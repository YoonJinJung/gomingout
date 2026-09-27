/** 카테고리 칩 — 소분류를 표시한다 (DESIGN.md 7장 PostCard) */
export function CategoryChip({ name }: { name: string }) {
  return (
    <span className="rounded-pill bg-surface-2 px-2 py-0.5 text-caption text-text-muted">
      {name}
    </span>
  );
}
