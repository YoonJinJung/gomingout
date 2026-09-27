/** MBTI 배지: 테두리형 칩, --primary 테두리, caption 크기 (DESIGN.md 7장) */
export function MbtiBadge({ mbti }: { mbti: string }) {
  return (
    <span className="rounded-pill border border-current px-1.5 py-px text-caption text-primary">
      {mbti}
    </span>
  );
}
